"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { decryptData } from '../../business-card-editor/lib/encryption';
import { useRequireAuth } from '../contexts/useRequireAuth';

type Template = {
  id: string;
  name: string;
  thumbnail?: string;
  project?: any;
  category: 'template' | 'local' | 'draft';
  createdAt?: string;
};

const builtInTemplates: Template[] = [
  { id: 'tpl_minimal', name: 'Minimal Clean', category: 'template', project: { name: 'Minimal', canvas: { width: 350, height: 200, backgroundColor: '#ffffff' }, pages: [{ id: 'p1', elements: [] }] } },
  { id: 'tpl_modern', name: 'Modern Accent', category: 'template', project: { name: 'Modern', canvas: { width: 350, height: 200, backgroundColor: '#0b76ff' }, pages: [{ id: 'p1', elements: [] }] } },
  { id: 'tpl_photo', name: 'Photo Card', category: 'template', project: { name: 'Photo', canvas: { width: 350, height: 200, backgroundColor: '#f5f5f5' }, pages: [{ id: 'p1', elements: [] }] } },
  { id: 'tpl_dark', name: 'Dark & Bold', category: 'template', project: { name: 'Dark', canvas: { width: 350, height: 200, backgroundColor: '#1a1a1a' }, pages: [{ id: 'p1', elements: [] }] } },
];

const TemplatesPage: React.FC = () => {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useRequireAuth();
  const [templates, setTemplates] = useState<Template[]>([...builtInTemplates]);
  const [localProjects, setLocalProjects] = useState<Template[]>([]);
  const [drafts, setDrafts] = useState<Template[]>([]);

  useEffect(() => {
    const load = () => {
      const allItems = [...builtInTemplates];

      // Load local projects from encrypted storage
      try {
        const stored = localStorage.getItem('swoocards');
        if (stored) {
          const decrypted = decryptData(stored);
          if (decrypted && typeof decrypted === 'object') {
            Object.entries(decrypted).forEach(([k, proj]: any) => {
              allItems.push({
                id: `proj_${k}`,
                name: proj.name ?? `Project ${k.substring(0, 8)}`,
                category: 'local',
                project: proj,
                createdAt: proj.createdAt,
              });
            });
          }
        }
      } catch (err) {
        console.warn('Could not read projects from swoocards', err);
      }

      // Separate into categories
      setTemplates(allItems.filter(t => t.category === 'template'));
      setLocalProjects(allItems.filter(t => t.category === 'local'));
      setDrafts(allItems.filter(t => t.category === 'draft'));
    };

    load();
  }, []);

  const useTemplate = (item: Template) => {
    try {
      sessionStorage.setItem('swoocards_selected_template', JSON.stringify(item.project ?? item));
    } catch (err) {
      console.warn('Could not set session template', err);
    }
    router.push('/editor/create');
  };

  const openProject = (id: string) => {
    router.push(`/editor/${id}`);
  };

  const TemplateCard: React.FC<{ item: Template; onUse: () => void; onOpen?: () => void }> = ({ item, onUse, onOpen }) => (
    <div className="bg-base-200 border border-base-300 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer flex flex-col hover:shadow-lg hover:-translate-y-1">
      <div
        className="h-36 flex items-center justify-center p-4 text-sm font-semibold text-center border-b border-base-300"
        style={{
          background: item.project?.canvas?.backgroundColor ?? 'oklch(88.272% 0.011 223.975)',
          color: item.project?.canvas?.backgroundColor?.includes('fff') || item.project?.canvas?.backgroundColor?.includes('f5f') ? '#333' : 'oklch(26.71% 0.049 252.525)',
        }}
      >
        <div>
          <div className="text-base font-bold mb-1">
            {item.name}
          </div>
          <div className="text-xs opacity-70">
            {item.project?.pages?.[0]?.elements?.length ?? 0} elements
          </div>
        </div>
      </div>

      <div className="p-3 flex-1 flex flex-col gap-2">
        {item.category === 'local' ? (
          <>
            <button
              onClick={onOpen}
              className="flex-1 bg-primary text-primary-content font-semibold py-2 px-3 rounded-lg cursor-pointer text-sm transition-all duration-200 hover:shadow-md active:scale-95"
            >
              Open Project
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onUse}
              className="flex-1 bg-primary text-primary-content font-semibold py-2 px-3 rounded-lg cursor-pointer text-sm transition-all duration-200 hover:shadow-md active:scale-95"
            >
              Use Template
            </button>
          </>
        )}
      </div>
    </div>
  );

  const Section: React.FC<{ title: string; items: Template[]; onUse: (item: Template) => void; onOpen?: (item: Template) => void }> = ({ title, items, onUse, onOpen }) => {
    if (items.length === 0) return null;

    return (
      <div className="mb-20">
        <h2 className="text-2xl font-bold mb-6 text-base-content flex items-center gap-3">
          <div className="w-1 h-6 bg-primary rounded-full" />
          {title}
          <span className="text-sm text-base-content/50 font-normal">({items.length})</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map(item => (
            <TemplateCard
              key={item.id}
              item={item}
              onUse={() => onUse(item)}
              onOpen={() => onOpen?.(item)}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-base-100 pt-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-base-content">
            Templates & Projects
          </h1>
          <p className="text-lg text-base-content/70 mb-6">
            Start from a template or continue working on your saved projects. Create a new design to get started.
          </p>
          <button
            onClick={() => router.push('/editor/create')}
            className="inline-flex items-center justify-center px-6 py-3 font-semibold rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap bg-primary text-primary-content hover:shadow-lg hover:scale-105 active:scale-95"
          >
            + Create New Design
          </button>
        </div>

        {/* Sections */}
        {localProjects.length > 0 && (
          <Section
            title="Your Projects"
            items={localProjects}
            onUse={useTemplate}
            onOpen={(item) => openProject(item.id.replace('proj_', ''))}
          />
        )}

        {templates.length > 0 && (
          <Section
            title="Built-in Templates"
            items={templates}
            onUse={useTemplate}
          />
        )}
      </div>
    </main>
  );
};

export default TemplatesPage;

