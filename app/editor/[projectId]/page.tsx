"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Canvas from '../../../business-card-editor/components/Canvas/Canvas';
import Toolbar from '../../../business-card-editor/components/Toolbar/Toolbar';
import PropertiesPanel from '../../../business-card-editor/components/PropertiesPanel/PropertiesPanel';
import TopBar from '../../../business-card-editor/components/TopBar/TopBar';
import useEditorStore from '../../../business-card-editor/store/editorStore';
import { decryptData } from '../../../business-card-editor/lib/encryption';

const EditorPage: React.FC = () => {
  const params = useParams();
  const projectId = params?.projectId ?? '';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadProject = useEditorStore(state => state.loadProject);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const projectIdStr = Array.isArray(projectId) ? projectId[0] : projectId;

        // First, check localStorage with decryption
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('swoocards');
          if (stored) {
            try {
              const decrypted = decryptData(stored);
              if (decrypted && typeof decrypted === 'object' && decrypted[projectIdStr]) {
                loadProject(decrypted[projectIdStr]);
                setError(null);
                setLoading(false);
                return;
              }
            } catch (parseErr) {
              console.error('Error decrypting local project:', parseErr);
            }
          }
        }

        // Try to fetch from API if not in localStorage
        const res = await fetch(`/api/projects?id=${projectIdStr}`);
        if (!res.ok) throw new Error('Failed to fetch project from server');
        const data = await res.json();
        loadProject(data);
        setError(null);
      } catch (err) {
        console.error('Error loading project:', err);
        setError(err instanceof Error ? err.message : 'Failed to load project');
        // Create a demo project if loading fails
        const projectIdStr = Array.isArray(projectId) ? projectId[0] : projectId;
        const demoProject = {
          _id: projectIdStr,
          userId: 'demo',
          name: 'Untitled Project',
          canvas: { width: 350, height: 200, backgroundColor: '#fff' },
          pages: [
            {
              id: 'page_1',
              elements: [],
            },
            {
              id: 'page_2',
              elements: [],
            },
          ],
        };
        loadProject(demoProject);
      } finally {
        setLoading(false);
      }
    };

    if (projectId && projectId !== '') {
      fetchProject();
    }
  }, [projectId, loadProject]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#1e1e1e', color: '#fff', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '16px', color: '#888' }}>Loading project...</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#1e1e1e', color: '#fff' }}>
      <TopBar projectId={String(projectId || '')} />
      {error && <div style={{ padding: '12px 20px', background: '#3a2a2a', color: '#ff6b6b', fontSize: '12px', borderBottom: '1px solid #3a3a3a' }}>Warning: {error}</div>}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Toolbar />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#121212', padding: '16px' }}>
          <Canvas projectId={String(projectId || '')} />
        </div>
        <PropertiesPanel />
      </div>
    </div>
  );
};

export default EditorPage;
