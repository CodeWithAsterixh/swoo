import ProjectModel from '../models/Project';
import { Types } from 'mongoose';
import type { ProjectType, NewElementInput } from '../types/project';
import { generateId } from '../lib/utils';

const listProjects = async (userId?: string): Promise<ProjectType[]> => {
  const query: any = {};
  if (userId) {
    query.userId = userId;
  }
  const docs = await ProjectModel.find(query).lean().exec();
  return docs as unknown as ProjectType[];
};

const getProjectById = async (id: string): Promise<ProjectType | null> => {
  // Prevent CastError for non-ObjectId values (e.g. local_... ids)
  if (!Types.ObjectId.isValid(String(id))) return null;
  const doc = await ProjectModel.findById(id).lean().exec();
  return (doc as unknown as ProjectType) || null;
};

const createProject = async (payload: Partial<ProjectType>): Promise<ProjectType> => {
  const defaultCanvas = { width: 350, height: 200, backgroundColor: '#ffffff' };
  // Only set `userId` when it's a valid ObjectId; local/demo strings should be ignored
  const maybeUserId = payload.userId && Types.ObjectId.isValid(String(payload.userId)) ? payload.userId : undefined;
  const project = new ProjectModel({
    userId: maybeUserId,
    name: payload.name || 'Untitled',
    canvas: payload.canvas || defaultCanvas,
    pages: payload.pages && payload.pages.length ? payload.pages : [{ id: generateId('page_'), elements: [] }]
  });
  const saved = await project.save();
  return saved.toObject() as unknown as ProjectType;
};

const updateProject = async (id: string, data: Partial<ProjectType>): Promise<ProjectType | null> => {
  if (!Types.ObjectId.isValid(String(id))) return null;
  const updated = await ProjectModel.findByIdAndUpdate(id, data, { new: true }).lean().exec();
  return updated as unknown as ProjectType | null;
};

const deleteProject = async (id: string): Promise<void> => {
  if (!Types.ObjectId.isValid(String(id))) return;
  await ProjectModel.findByIdAndDelete(id).exec();
};

const addElement = async (projectId: string, pageId: string, elementInput: NewElementInput) => {
  const element = {
    ...elementInput,
    id: elementInput.id || generateId('el_'),
    position: elementInput.position || { x: 0, y: 0 },
    size: elementInput.size || { width: 100, height: 40 },
    rotation: elementInput.rotation ?? 0,
    zIndex: elementInput.zIndex ?? 0,
  } as any;

  if (!Types.ObjectId.isValid(String(projectId))) throw new Error('Project not found');
  const proj = await ProjectModel.findById(projectId).exec();
  if (!proj) throw new Error('Project not found');
  const page = proj.pages.find((p: any) => p.id === pageId) as any;
  if (!page) throw new Error('Page not found');
  page.elements.push(element);
  await proj.save();
  return element;
};

const removeElement = async (projectId: string, pageId: string, elementId: string) => {
  if (!Types.ObjectId.isValid(String(projectId))) throw new Error('Project not found');
  const proj = await ProjectModel.findById(projectId).exec();
  if (!proj) throw new Error('Project not found');
  const page = proj.pages.find((p: any) => p.id === pageId) as any;
  if (!page) throw new Error('Page not found');
  page.elements = page.elements.filter((e: any) => e.id !== elementId);
  await proj.save();
};

const saveProject = async (projectJson: ProjectType) => {
  // If projectJson._id is missing or is a client-local id (prefixed), create a new remote project
  if (!projectJson._id || String(projectJson._id).startsWith('local_')) return createProject(projectJson);
  const id = projectJson._id;
  const data = {
    userId: projectJson.userId,
    name: projectJson.name,
    canvas: projectJson.canvas,
    pages: projectJson.pages,
  };
  return await updateProject(String(id), data);
};

export default {
  listProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addElement,
  removeElement,
  saveProject,
};
