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
    <main className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-base-200 border border-base-300 rounded-2xl p-8">
        <h1 className="text-4xl font-bold mb-4 text-base-content">
          Create New Design
        </h1>

        <p className="text-base text-base-content/70 mb-8 leading-relaxed">
          Choose how you want to save your new business card design. You can always change it later.
        </p>

        {!saveMode && (
          <div className="flex flex-col gap-3 mb-6">
            <button
              onClick={() => handleCreate('remote')}
              className="w-full px-6 py-3 font-semibold rounded-lg transition-all duration-200 cursor-pointer bg-primary text-primary-content hover:shadow-lg hover:scale-105 active:scale-95"
            >
              🌐 Save to Cloud
            </button>

            <button
              onClick={() => handleCreate('local')}
              className="w-full px-6 py-3 font-semibold rounded-lg transition-all duration-200 cursor-pointer bg-transparent border-2 border-primary text-primary hover:bg-primary/10 active:bg-primary/20"
            >
              💾 Save Locally Only
            </button>

            <button
              onClick={() => handleCreate('both')}
              className="w-full px-6 py-3 font-semibold rounded-lg transition-all duration-200 cursor-pointer bg-transparent border-2 border-accent text-accent hover:bg-accent/10 active:bg-accent/20"
            >
              ☁️ Save Both (Recommended)
            </button>
          </div>
        )}

        {loading && (
          <div className="p-4 bg-primary/10 rounded-lg border-l-4 border-primary mb-5">
            <div className="text-primary text-sm font-semibold mb-2">
              Creating your design...
            </div>
            <div className="text-xs text-base-content/60">This may take a moment</div>
          </div>
        )}

        {steps && steps.length > 0 && (
          <div className="bg-base-100 border border-base-300 rounded-lg p-4 mb-5">
            <div className="text-xs font-semibold text-primary mb-3">
              Progress
            </div>
            <div className="flex flex-col gap-2">
              {steps.map((s) => (
                <div key={s.id} className={`flex items-start gap-3 ${s.status === 'pending' ? 'opacity-50' : ''}`}>
                  <div className="w-5 h-5 min-w-5 rounded-full flex items-center justify-center text-xs" style={{
                    background: s.status === 'running' ? 'oklch(80% 0.114 19.571 / 0.2)' : s.status === 'success' ? 'rgba(76, 175, 80, 0.2)' : s.status === 'error' ? 'rgba(255, 107, 107, 0.2)' : 'oklch(88.272% 0.011 223.975)',
                  }}>
                    {s.status === 'running' && '⏳'}
                    {s.status === 'success' && '✓'}
                    {s.status === 'error' && '✕'}
                    {s.status === 'pending' && '○'}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-base-content mb-1">
                      {s.title}
                    </div>
                    {s.message && (
                      <div className="text-xs text-base-content/60">
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
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm mb-5">
            {error}
          </div>
        )}

        {!saveMode && !loading && (
          <div className="p-4 bg-accent/10 border border-accent/30 rounded-lg text-accent text-xs leading-relaxed">
            <strong>💡 Tip:</strong> Save Both keeps your design synced between cloud and offline storage. You'll always have a backup.
          </div>
        )}
      </div>
    </main>
  );
};

export default CreatePage;

