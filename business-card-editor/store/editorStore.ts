/* eslint-disable @typescript-eslint/no-explicit-any */
import { produce } from 'immer';
import { create } from 'zustand';
import type { ProjectType, NewElementInput, Element } from '../types/project';
import { generateId, generateObjectId } from '../lib/utils';
import { encryptData, decryptData } from '../lib/encryption';

const MAX_STACK = 60;
const STORAGE_KEY = 'swoocards';

type Selected = { pageId: string; elementId: string } | null;
type SelectedElements = Array<{ pageId: string; elementId: string }>;
type SaveStatus = 'unsaved' | 'saving' | 'saved' | 'error';

type EditorState = {
  project: ProjectType | null;
  currentPage: number;
  selected: Selected;
  selectedElements: SelectedElements;
  undoStack: ProjectType[];
  redoStack: ProjectType[];
  snapToGrid: boolean;
  gridSize: number;
  pendingElement: Partial<Element> | null;
  saveStatus: SaveStatus;
  saveStatusMessage: string | null;
  lastSavedAt: number | null; // timestamp of last successful save

  // placement actions
  startPlacement: (el: Partial<Element>) => void;
  cancelPlacement: () => void;
  placePending: (pageId: string, x: number, y: number, w?: number, h?: number) => Element | null;

  // actions
  loadProject: (p: ProjectType) => void;
  setCurrentPage: (i: number) => void;
  setSelected: (sel: Selected) => void;
  selectElement: (pageId: string, elementId: string, multiSelect?: boolean) => void;
  toggleSelectElement: (pageId: string, elementId: string) => void;
  clearSelection: () => void;
  pushUndo: () => void;
  undo: () => void;
  redo: () => void;

  addElement: (pageId: string, el: NewElementInput) => Element | null;
  updateElement: (pageId: string, elementId: string, patch: Partial<Element>) => Element | null;
  removeElement: (pageId: string, elementId: string) => void;
  moveElement: (pageId: string, elementId: string, x: number, y: number) => Element | null;

  // update the canvas / card properties (width/height/backgroundColor)
  updateCanvas: (patch: Partial<ProjectType['canvas']>) => void;
  // batch update multiple elements
  updateElements: (updates: Array<{ pageId: string; elementId: string; patch: Partial<Element> }>) => void;

  // update project metadata
  updateProjectName: (name: string) => void;

  // save actions
  saveToServer: (endpoint?: string, saveMode?: 'local' | 'remote' | 'both') => Promise<Response | null>;
  setSaveStatus: (status: SaveStatus, message?: string | null) => void;
  markUnsaved: () => void;
};

function cloneProject(p: ProjectType | null): ProjectType | null {
  if (!p) return null;
  return JSON.parse(JSON.stringify(p)) as ProjectType;
}

function saveToLocalStorage(project: ProjectType | null) {
  if (!project || !project._id) return;
  if (typeof window === 'undefined') return;
  try {
    // Get all projects from localStorage
    const allProjects: Record<string, ProjectType> = {};
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const decrypted = decryptData(stored);
      if (decrypted) {
        Object.assign(allProjects, decrypted);
      }
    }
    
    // Update/add the current project
    allProjects[project._id] = project;
    
    // Encrypt and save all projects
    const encrypted = encryptData(allProjects);
    localStorage.setItem(STORAGE_KEY, encrypted);
  } catch (err) {
    console.warn('Failed to save to localStorage:', err);
  }
}

function loadFromLocalStorage(projectId: string): ProjectType | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const decrypted = decryptData(stored);
    if (!decrypted || typeof decrypted !== 'object') return null;
    
    return decrypted[projectId] || null;
  } catch (err) {
    console.warn('Failed to load from localStorage:', err);
    return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _unused = loadFromLocalStorage;

export const useEditorStore = create<EditorState>((set, get) => ({
  project: null,
  currentPage: 0,
  selected: null,
  selectedElements: [],
  undoStack: [],
  redoStack: [],
  snapToGrid: true,
  gridSize: 5,
  saveStatus: 'unsaved',
  saveStatusMessage: null,
  lastSavedAt: null,

  loadProject: (p) => {
    const cloned = cloneProject(p) as ProjectType;
    // ensure front/back pages exist
    cloned.pages = cloned.pages && cloned.pages.length > 0 ? cloned.pages : [];
    if (cloned.pages.length < 2) {
      // create Front and Back if missing
      cloned.pages = [
        { id: generateId('page_front'), elements: [], name: 'Front' } as any,
        { id: generateId('page_back'), elements: [], name: 'Back' } as any,
      ];
    }
    saveToLocalStorage(cloned);
    set(() => ({ project: cloned, currentPage: 0, selected: null, selectedElements: [], undoStack: [], redoStack: [] }));
  },

  setCurrentPage: (i) => set(() => ({ currentPage: i, selected: null, selectedElements: [] })),

  setSelected: (sel) => set(() => ({ selected: sel, selectedElements: sel ? [sel] : [] })),

  selectElement: (pageId, elementId, multiSelect = false) => {
    if (!multiSelect) {
      set(() => ({ selected: { pageId, elementId }, selectedElements: [{ pageId, elementId }] }));
    } else {
      set(state => {
        const already = state.selectedElements.some(e => e.elementId === elementId && e.pageId === pageId);
        if (already) {
          const filtered = state.selectedElements.filter(e => !(e.elementId === elementId && e.pageId === pageId));
          return { selectedElements: filtered, selected: filtered[0] ?? null };
        }
        const updated = [...state.selectedElements, { pageId, elementId }];
        return { selectedElements: updated, selected: { pageId, elementId } };
      });
    }
  },

  toggleSelectElement: (pageId, elementId) => {
    set(state => {
      const already = state.selectedElements.some(e => e.elementId === elementId && e.pageId === pageId);
      if (already) {
        const filtered = state.selectedElements.filter(e => !(e.elementId === elementId && e.pageId === pageId));
        return { selectedElements: filtered, selected: filtered[0] ?? null };
      }
      const updated = [...state.selectedElements, { pageId, elementId }];
      return { selectedElements: updated, selected: { pageId, elementId } };
    });
  },

  clearSelection: () => set(() => ({ selected: null, selectedElements: [] })),

  // begin placement flow: user-initiated pending element placement (click to place or click-drag to size)
  pendingElement: null,

  startPlacement: (el) => set(() => ({ pendingElement: el })),

  cancelPlacement: () => set(() => ({ pendingElement: null })),

  placePending: (pageId, x, y, w, h) => {
    const pending = get().pendingElement;
    const project = get().project;
    if (!pending || !project) return null;
    get().pushUndo();
    const element: Element = {
      id: pending.id || generateId('el_'),
      type: (pending.type as any) || 'shape',
      content: pending.content ?? undefined,
      src: (pending as any).src ?? undefined,
      position: { x: Math.round(x), y: Math.round(y) },
      size: { width: Math.round(w ?? (pending.size?.width ?? 100)), height: Math.round(h ?? (pending.size?.height ?? 40)) },
      rotation: pending.rotation ?? 0,
      style: pending.style ?? undefined,
      parentId: pending.parentId ?? null,
      zIndex: pending.zIndex ?? 0,
    } as Element;

    set(state => {
      const updated = produce(state.project as ProjectType, draft => {
        const page = draft.pages.find(p => p.id === pageId) as any;
        if (!page) {
          (draft.pages[0] ?? (draft.pages[0] = { id: generateId('page_'), elements: [] })).elements.push(element as any);
        } else {
          page.elements.push(element as any);
        }
      });
      saveToLocalStorage(updated);
      return { project: updated, pendingElement: null } as Partial<EditorState>;
    });

    return element;
  },

  pushUndo: () => {
    const current = get().project;
    if (!current) return;
    const copy = cloneProject(current) as ProjectType;
    set(state => {
      const stack = [copy, ...state.undoStack].slice(0, MAX_STACK);
      return { undoStack: stack, redoStack: [] } as Partial<EditorState>;
    });
  },

  undo: () => {
    const { undoStack, project } = get();
    if (!undoStack || undoStack.length === 0) return;
    const [prev, ...rest] = undoStack;
    const currentCopy = cloneProject(project) as ProjectType | null;
    set(() => ({ project: cloneProject(prev), undoStack: rest, redoStack: currentCopy ? [currentCopy, ...get().redoStack].slice(0, MAX_STACK) : get().redoStack }));
  },

  redo: () => {
    const { redoStack, project } = get();
    if (!redoStack || redoStack.length === 0) return;
    const [next, ...rest] = redoStack;
    const currentCopy = cloneProject(project) as ProjectType | null;
    set(() => ({ project: cloneProject(next), redoStack: rest, undoStack: currentCopy ? [currentCopy, ...get().undoStack].slice(0, MAX_STACK) : get().undoStack }));
  },

  addElement: (pageId, el) => {
    const project = get().project;
    if (!project) return null;
    get().pushUndo();
    get().markUnsaved();
    const element: Element = {
      id: el.id || generateId('el_'),
      type: el.type as any,
      content: el.content ?? undefined,
      src: (el as any).src ?? undefined,
      position: el.position ?? { x: 0, y: 0 },
      size: el.size ?? { width: 100, height: 40 },
      rotation: el.rotation ?? 0,
      style: el.style ?? undefined,
      parentId: el.parentId ?? null,
      zIndex: el.zIndex ?? 0,
    } as Element;

    set(state => {
      const updated = produce(state.project as ProjectType, draft => {
        const page = draft.pages.find(p => p.id === pageId) as any;
        if (!page) {
          // fallback: push to first page
          (draft.pages[0] ?? (draft.pages[0] = { id: generateId('page_'), elements: [] })).elements.push(element as any);
        } else {
          page.elements.push(element as any);
        }
      });
      saveToLocalStorage(updated);
      return { project: updated };
    });

    return element;
  },

  updateElement: (pageId, elementId, patch) => {
    const project = get().project;
    if (!project) return null;
    get().pushUndo();
    get().markUnsaved();
    let updated: Element | null = null;
    set(state => {
      const newProject = produce(state.project as ProjectType, draft => {
        const page = draft.pages.find(p => p.id === pageId) as any;
        if (!page) return;
        const el = page.elements.find((e: any) => e.id === elementId);
        if (!el) return;
        Object.assign(el, patch);
        updated = el as Element;
      });
      saveToLocalStorage(newProject);
      return { project: newProject };
    });

    return updated;
  },

  removeElement: (pageId, elementId) => {
    const project = get().project;
    if (!project) return;
    get().pushUndo();
    get().markUnsaved();
    set(state => {
      const newProject = produce(state.project as ProjectType, draft => {
        const page = draft.pages.find(p => p.id === pageId) as any;
        if (!page) return;
        page.elements = page.elements.filter((e: any) => e.id !== elementId);
      });
      saveToLocalStorage(newProject);
      return { project: newProject };
    });
  },

  moveElement: (pageId, elementId, x, y) => {
    const project = get().project;
    if (!project) return null;
    get().pushUndo();
    get().markUnsaved();
    const { snapToGrid, gridSize } = get();
    const snap = (v: number) => (snapToGrid ? Math.round(v / gridSize) * gridSize : v);
    let moved: Element | null = null;
    set(state => {
      const newProject = produce(state.project as ProjectType, draft => {
        const page = draft.pages.find(p => p.id === pageId) as any;
        if (!page) return;
        const el = page.elements.find((e: any) => e.id === elementId);
        if (!el) return;
        el.position.x = snap(x);
        el.position.y = snap(y);
        moved = el as Element;
      });
      saveToLocalStorage(newProject);
      return { project: newProject };
    });
    return moved;
  },

  updateCanvas: (patch) => {
    const project = get().project;
    if (!project) return;
    get().pushUndo();
    get().markUnsaved();
    set(state => {
      const newProject = produce(state.project as ProjectType, draft => {
        draft.canvas = { ...(draft.canvas ?? {}), ...(patch as any) } as any;
      });
      saveToLocalStorage(newProject);
      return { project: newProject };
    });
  },

  updateElements: (updates) => {
    const project = get().project;
    if (!project) return;
    get().pushUndo();
    get().markUnsaved();
    set(state => {
      const newProject = produce(state.project as ProjectType, draft => {
        updates.forEach(({ pageId, elementId, patch }) => {
          const page = draft.pages.find(p => p.id === pageId) as any;
          if (!page) return;
          const el = page.elements.find((e: any) => e.id === elementId);
          if (!el) return;
          Object.assign(el, patch);
        });
      });
      saveToLocalStorage(newProject);
      return { project: newProject };
    });
  },

  updateProjectName: (name: string) => {
    const project = get().project;
    if (!project) return;
    get().pushUndo();
    get().markUnsaved();
    set(state => {
      const newProject = produce(state.project as ProjectType, draft => {
        draft.name = name;
      });
      saveToLocalStorage(newProject);
      return { project: newProject };
    });
  },

  // saveMode: 'local' | 'remote' | 'both' - when omitted, caller's intent determines behavior
  saveToServer: async (endpoint = '/api/projects', saveMode?: 'local' | 'remote' | 'both') => {
    const project = get().project;
    if (!project) return null;
    
    // Always save to localStorage first
    // Ensure local ID exists for client-side projects. Use a Mongo-like id and prefix with `local_`.
    if (!project._id) {
      project._id = `local_${generateObjectId()}`;
    }
    saveToLocalStorage(project);
    
    try {
      // Get token from localStorage
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      
      let body: any;
      // Determine whether to POST (create remote) or PUT (update remote)
      const isLocalId = typeof project._id === 'string' && project._id.startsWith('local_');

      // If caller explicitly requested local-only, skip server call
      if (saveMode === 'local') {
        // already saved locally above
        // return a synthetic Response indicating local save
        const localResp = new Response(JSON.stringify({ success: true, saved: 'local', project }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        return localResp;
      }

      if (!project._id) {
        // POST: create new remote project
        body = { ...project, saveMode: saveMode ?? 'remote' };
      } else if (isLocalId) {
        // If local id has a valid ObjectId-like suffix (local_<24hex>), try using the suffix for remote PUT
        const suffix = String(project._id).replace(/^local_/, '');
        const isHex24 = /^[a-f0-9]{24}$/i.test(suffix);
        if (isHex24) {
          // Attempt to update remote with the suffix id
          body = { id: suffix, data: project, saveMode: saveMode ?? 'remote' };
        } else {
          // Otherwise POST to create new remote project
          body = { ...project, saveMode: saveMode ?? 'remote' };
        }
      } else {
        // PUT: update existing remote project
        body = { id: project._id, data: project, saveMode: saveMode ?? 'remote' };
      }
      
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const method = body && body.id ? 'PUT' : 'POST';
      console.log('[saveToServer] method:', method, 'endpoint:', endpoint, 'tokenPresent:', !!token, 'projectId:', project._id, 'saveMode:', saveMode);
      const res = await fetch(endpoint, {
        method,
        headers,
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const json = await res.json();
        // The projects API returns a structured response with `result.remote` when saving remotely.
        // Support both: either the endpoint returns the project directly, or returns { result: { remote: project } }.
        let remoteProject: any = null;
        if (json && json.result && json.result.remote) {
          remoteProject = json.result.remote;
        } else if (json && json._id) {
          remoteProject = json;
        } else if (json && json.project) {
          remoteProject = json.project;
        }

        if (remoteProject) {
          // If we created a remote from a local id, replace the local id with remote id
          const refreshed = cloneProject(remoteProject as any) as ProjectType;
          saveToLocalStorage(refreshed);
          set(() => ({ project: refreshed }));
        } else {
          // For local-only responses, just ensure local copy remains saved
          saveToLocalStorage(project);
        }
      }
      return res;
    } catch (err) {
      console.error('saveToServer error', err);
      return null;
    }
  },

  setSaveStatus: (status: SaveStatus, message: string | null = null) => {
    set(() => ({
      saveStatus: status,
      saveStatusMessage: message,
      lastSavedAt: status === 'saved' ? Date.now() : get().lastSavedAt,
    }));
    // Auto-reset 'saved' status after 2.5 seconds
    if (status === 'saved') {
      setTimeout(() => {
        if (get().saveStatus === 'saved') {
          set(() => ({ saveStatus: 'unsaved' }));
        }
      }, 2500);
    }
  },

  markUnsaved: () => {
    set(() => ({ saveStatus: 'unsaved', saveStatusMessage: null }));
  },
}));

export default useEditorStore;
