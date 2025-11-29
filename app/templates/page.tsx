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
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(11, 118, 255, 0.2)',
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = 'rgba(11, 118, 255, 0.08)';
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(11, 118, 255, 0.4)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = 'rgba(255, 255, 255, 0.05)';
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(11, 118, 255, 0.2)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
      }}
    >
      <div
        style={{
          height: '140px',
          background: item.project?.canvas?.backgroundColor ?? '#2a2a2a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: item.project?.canvas?.backgroundColor?.includes('fff') || item.project?.canvas?.backgroundColor?.includes('f5f') ? '#333' : '#fff',
          padding: '16px',
          fontSize: '13px',
          fontWeight: 600,
          textAlign: 'center',
          borderBottom: '1px solid rgba(11, 118, 255, 0.1)',
        }}
      >
        <div>
          <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>
            {item.name}
          </div>
          <div style={{ fontSize: '12px', opacity: 0.7 }}>
            {item.project?.pages?.[0]?.elements?.length ?? 0} elements
          </div>
        </div>
      </div>

      <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {item.category === 'local' ? (
          <>
            <button
              onClick={onOpen}
              style={{
                flex: 1,
                background: 'linear-gradient(135deg, #0b76ff 0%, #00d4ff 100%)',
                color: '#fff',
                border: 'none',
                padding: '8px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(11, 118, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
              }}
            >
              Open Project
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onUse}
              style={{
                flex: 1,
                background: 'linear-gradient(135deg, #0b76ff 0%, #00d4ff 100%)',
                color: '#fff',
                border: 'none',
                padding: '8px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(11, 118, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
              }}
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
      <div style={{ marginBottom: '60px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px', color: '#fff', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '4px',
            height: '24px',
            background: 'linear-gradient(135deg, #0b76ff 0%, #00d4ff 100%)',
            borderRadius: '2px',
          }} />
          {title}
          <span style={{ fontSize: '13px', color: '#666', fontWeight: 500 }}>({items.length})</span>
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '16px',
        }}>
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
    <main style={{
      background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
      minHeight: 'calc(100vh - 64px)',
      padding: '48px 24px',
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '48px' }}>
          <h1 style={{
            fontSize: '40px',
            fontWeight: 700,
            margin: '0 0 12px',
            background: 'linear-gradient(135deg, #ffffff 0%, #ccc 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Templates & Projects
          </h1>
          <p style={{ fontSize: '16px', color: '#aaa', margin: 0 }}>
            Start from a template or continue working on your saved projects. Create a new design to get started.
          </p>
          <button
            onClick={() => router.push('/editor/create')}
            style={{
              marginTop: '16px',
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #0b76ff 0%, #00d4ff 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600,
              boxShadow: '0 8px 24px rgba(11, 118, 255, 0.3)',
              transition: 'all 0.3s ease',
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

