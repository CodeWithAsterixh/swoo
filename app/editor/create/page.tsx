"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { encryptData, decryptData } from '../../../business-card-editor/lib/encryption';

const CreatePage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const createNewProject = async () => {
      try {
        setLoading(true);
        const newProject = {
          name: 'Untitled Design',
          userId: 'demo',
          canvas: { width: 350, height: 200, backgroundColor: '#fff' },
          pages: [
            { id: 'page_1', elements: [] },
            { id: 'page_2', elements: [] },
          ],
        };

        try {
          const response = await fetch('/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProject),
          });

          if (response.ok) {
            const createdProject = await response.json();
            const projectId = createdProject._id || createdProject.id;
            router.push(`/editor/${projectId}`);
            return;
          }
        } catch (dbErr) {
          console.warn('Database creation failed, using local project:', dbErr);
        }

        // Fallback: Create local project with temporary ID
        const tempProjectId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const localProject = {
          _id: tempProjectId,
          ...newProject,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Get existing projects from localStorage and add new one
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let allProjects: Record<string, any> = {};
        const stored = localStorage.getItem('swoocards');
        if (stored) {
          const decrypted = decryptData(stored);
          if (decrypted && typeof decrypted === 'object') {
            allProjects = decrypted;
          }
        }

        // Add the new project
        allProjects[tempProjectId] = localProject;

        // Encrypt and store in localStorage
        const encrypted = encryptData(allProjects);
        localStorage.setItem('swoocards', encrypted);

        // Redirect to the editor with the local project ID
        router.push(`/editor/${tempProjectId}`);
      } catch (err) {
        console.error('Error creating project:', err);
        setError(err instanceof Error ? err.message : 'Failed to create project');
        setLoading(false);
      }
    };

    createNewProject();
  }, [router]);

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', background: '#1e1e1e', color: '#fff', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '16px', color: '#888', marginBottom: '16px' }}>Creating new design...</div>
          <div style={{ width: '40px', height: '40px', border: '3px solid #3a3a3a', borderTop: '3px solid #0b76ff', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', height: '100vh', background: '#1e1e1e', color: '#fff', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ fontSize: '16px', color: '#ff6b6b', marginBottom: '16px' }}>Error creating project</div>
          <div style={{ fontSize: '14px', color: '#888', marginBottom: '24px' }}>{error}</div>
          <button
            onClick={() => window.history.back()}
            style={{
              padding: '8px 16px',
              background: '#0b76ff',
              border: 'none',
              color: '#fff',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default CreatePage;
