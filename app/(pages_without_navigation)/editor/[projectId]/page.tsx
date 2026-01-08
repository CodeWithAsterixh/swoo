"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Canvas from '../../../../business-card-editor/components/Canvas/Canvas';
import Toolbar from '../../../../business-card-editor/components/Toolbar/Toolbar';
import PropertiesPanel from '../../../../business-card-editor/components/PropertiesPanel/PropertiesPanel';
import TopBar from '../../../../business-card-editor/components/TopBar/TopBar';
import useEditorStore from '../../../../business-card-editor/store/editorStore';
import { decryptData } from '../../../../business-card-editor/lib/encryption';

const getStoredProject = (projectId: string) => {
  if (globalThis.window === undefined) return null;

  try {
    const stored = localStorage.getItem('swoocards');
    if (!stored) return null;

    const decrypted = decryptData(stored);
    if (decrypted && typeof decrypted === 'object' && decrypted[projectId]) {
      return decrypted[projectId];
    }
  } catch (err) {
    console.error('Error decrypting local project:', err);
  }
  return null;
};

const createDemoProject = (projectId: string) => ({
  _id: projectId,
  userId: 'demo',
  name: 'Untitled Project',
  canvas: { width: 350, height: 200, backgroundColor: '#fff' },
  pages: [
    { id: 'page_1', elements: [] },
    { id: 'page_2', elements: [] },
  ],
});

const EditorPage: React.FC = () => {
  const params = useParams();
  const projectId = params?.projectId ?? '';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadProject = useEditorStore(state => state.loadProject);

  useEffect(() => {
    const fetchProject = async () => {
      const projectIdStr = Array.isArray(projectId) ? projectId[0] : projectId;
      if (!projectIdStr) return;

      try {
        setLoading(true);

        // 1. Try Local Storage
        const localProject = getStoredProject(projectIdStr);
        if (localProject) {
          loadProject(localProject);
          setError(null);
          return;
        }

        // 2. Try Remote API
        const res = await fetch(`/api/projects?id=${projectIdStr}`);
        if (!res.ok) throw new Error('Failed to fetch project from server');

        const data = await res.json();
        loadProject(data);
        setError(null);
      } catch (err) {
        console.error('Error loading project:', err);
        setError(err instanceof Error ? err.message : 'Failed to load project');

        // 3. Fallback to Demo Project
        loadProject(createDemoProject(projectIdStr));
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, loadProject]);

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-base-200 text-base-content items-center justify-center">
        <div className="text-base text-base-content/60">Loading project...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-base-200 text-base-content">
      <TopBar projectId={String(projectId || '')} />
      {error && <div className="px-5 py-3 bg-red-500/10 text-red-600 text-xs border-b border-red-500/30">Warning: {error}</div>}
      <div className="flex flex-1 overflow-hidden">
        <Toolbar />
        <div className="flex-1 flex justify-center items-center bg-base-100 p-4">
          <Canvas projectId={String(projectId || '')} />
        </div>
        <PropertiesPanel />
      </div>
    </div>
  );
};

export default EditorPage;
