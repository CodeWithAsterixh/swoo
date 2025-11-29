"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { encryptData, decryptData } from '../../../business-card-editor/lib/encryption';
import { useRequireAuth } from '../../contexts/useRequireAuth';

type Step = { id: string; title: string; status: 'pending' | 'running' | 'success' | 'error'; message?: string };

const CreatePage: React.FC = () => {
  const router = useRouter();
  useRequireAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [steps, setSteps] = useState<Step[] | null>(null);
  const [saveMode, setSaveMode] = useState<'remote' | 'local' | 'both' | null>(null);

  const defaultProject: any = {
    name: 'Untitled Design',
    userId: 'demo',
    canvas: { width: 350, height: 200, backgroundColor: '#ffffff' },
    pages: [{ id: 'page_1', elements: [] }],
  } as any;

  useEffect(() => {
    // No automatic creation — wait for user to choose save mode
  }, []);

  const saveLocal = (projectObj: any) => {
    try {
      const tempId = projectObj._id || `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const localProj = { _id: tempId, ...projectObj, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };

      let allProjects: Record<string, any> = {};
      const stored = localStorage.getItem('swoocards');
      if (stored) {
        const decrypted = decryptData(stored);
        if (decrypted && typeof decrypted === 'object') allProjects = decrypted;
      }

      allProjects[tempId] = localProj;
      localStorage.setItem('swoocards', encryptData(allProjects));
      return tempId;
    } catch (e) {
      console.error('Failed to save locally', e);
      return null;
    }
  };

  const handleCreate = async (mode: 'remote' | 'local' | 'both') => {
    setError(null);
    setLoading(true);
    setSaveMode(mode);
    setSteps([{ id: 'init', title: 'Starting', status: 'running' }]);

    try {
      const payload = { saveMode: mode, ...defaultProject };
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const body = await res.json();

      if (!res.ok) {
        // If server returned choices or an error, show steps if present
        if (body && body.steps) setSteps(body.steps);
        setError(body.error || `Server returned ${res.status}`);
        setLoading(false);
        return;
      }

      // Update steps if provided
      if (body.steps) setSteps(body.steps);

      const result = body.result || {};

      // If local result exists, save to localStorage
      let localId: string | null = null;
      if (result.local) {
        localId = saveLocal(result.local);
      }

      // If remote result exists and server recommends redirect, do it
      if (result.remote && body.recommended?.action === 'redirect' && body.recommended.url) {
        router.push(body.recommended.url);
        return;
      }

      // Otherwise if we have a local id, open editor with that
      if (localId) {
        router.push(`/editor/${localId}`);
        return;
      }

      // Fallback: if remote created but no redirect provided, try to open remote id
      if (result.remote && (result.remote._id || result.remote.id)) {
        const id = result.remote._id || result.remote.id;
        router.push(`/editor/${id}`);
        return;
      }

      setLoading(false);
    } catch (err: unknown) {
      console.error('Create failed', err);
      setError(err instanceof Error ? err.message : String(err));
      setLoading(false);
    }
  };

  return (
    <main style={{
      background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '600px',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(11, 118, 255, 0.2)',
        borderRadius: '16px',
        padding: '40px',
        backdropFilter: 'blur(10px)',
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 700,
          margin: '0 0 16px',
          background: 'linear-gradient(135deg, #ffffff 0%, #ccc 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Create New Design
        </h1>

        <p style={{
          fontSize: '14px',
          color: '#aaa',
          margin: '0 0 32px',
          lineHeight: '1.6',
        }}>
          Choose how you want to save your new business card design. You can always change it later.
        </p>

        {!saveMode && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            <button
              onClick={() => handleCreate('remote')}
              style={{
                padding: '14px 20px',
                background: 'linear-gradient(135deg, #0b76ff 0%, #00d4ff 100%)',
                border: 'none',
                color: '#fff',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: 600,
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 24px rgba(11, 118, 255, 0.3)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 32px rgba(11, 118, 255, 0.5)';
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 24px rgba(11, 118, 255, 0.3)';
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
              }}
            >
              🌐 Save to Cloud
            </button>

            <button
              onClick={() => handleCreate('local')}
              style={{
                padding: '14px 20px',
                background: 'rgba(11, 118, 255, 0.1)',
                border: '2px solid rgba(11, 118, 255, 0.3)',
                color: '#0b76ff',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: 600,
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(11, 118, 255, 0.2)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(11, 118, 255, 0.5)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(11, 118, 255, 0.1)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(11, 118, 255, 0.3)';
              }}
            >
              💾 Save Locally Only
            </button>

            <button
              onClick={() => handleCreate('both')}
              style={{
                padding: '14px 20px',
                background: 'rgba(0, 212, 255, 0.1)',
                border: '2px solid rgba(0, 212, 255, 0.3)',
                color: '#00d4ff',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: 600,
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0, 212, 255, 0.2)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0, 212, 255, 0.5)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0, 212, 255, 0.1)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0, 212, 255, 0.3)';
              }}
            >
              ☁️ Save Both (Recommended)
            </button>
          </div>
        )}

        {loading && (
          <div style={{
            padding: '16px',
            background: 'rgba(11, 118, 255, 0.1)',
            borderRadius: '8px',
            borderLeft: '4px solid #0b76ff',
            marginBottom: '20px',
          }}>
            <div style={{ color: '#0b76ff', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
              Creating your design...
            </div>
            <div style={{ fontSize: '12px', color: '#aaa' }}>This may take a moment</div>
          </div>
        )}

        {steps && steps.length > 0 && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(11, 118, 255, 0.1)',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px',
          }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#0b76ff', marginBottom: '12px' }}>
              Progress
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {steps.map((s) => (
                <div key={s.id} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  opacity: s.status === 'pending' ? 0.5 : 1,
                }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    minWidth: '20px',
                    borderRadius: '50%',
                    background: s.status === 'running' ? 'rgba(11, 118, 255, 0.3)' : s.status === 'success' ? 'rgba(76, 175, 80, 0.3)' : s.status === 'error' ? 'rgba(255, 107, 107, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                  }}>
                    {s.status === 'running' && '⏳'}
                    {s.status === 'success' && '✓'}
                    {s.status === 'error' && '✕'}
                    {s.status === 'pending' && '○'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: '#fff', marginBottom: '2px' }}>
                      {s.title}
                    </div>
                    {s.message && (
                      <div style={{ fontSize: '12px', color: '#888' }}>
                        {s.message}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div style={{
            padding: '16px',
            background: 'rgba(255, 107, 107, 0.1)',
            border: '1px solid rgba(255, 107, 107, 0.3)',
            borderRadius: '8px',
            color: '#ff6b6b',
            fontSize: '13px',
            marginBottom: '20px',
          }}>
            {error}
          </div>
        )}

        {!saveMode && !loading && (
          <div style={{
            padding: '16px',
            background: 'rgba(0, 212, 255, 0.05)',
            border: '1px solid rgba(0, 212, 255, 0.2)',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#00d4ff',
            lineHeight: '1.6',
          }}>
            <strong>💡 Tip:</strong> Save Both keeps your design synced between cloud and offline storage. You&apos;ll always have a backup.
          </div>
        )}
      </div>
    </main>
  );
};

export default CreatePage;

