"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { decryptData } from '../../business-card-editor/lib/encryption';

type Template = {
  id: string;
  name: string;
  thumbnail?: string;
  project?: any;
};

const builtIn: Template[] = [
  { id: 'tpl_minimal', name: 'Minimal Clean', thumbnail: undefined, project: { name: 'Minimal', canvas: { width: 350, height: 200, backgroundColor: '#ffffff' }, pages: [{ id: 'p1', elements: [] }] } },
  { id: 'tpl_modern', name: 'Modern Accent', thumbnail: undefined, project: { name: 'Modern', canvas: { width: 350, height: 200, backgroundColor: '#0b76ff' }, pages: [{ id: 'p1', elements: [] }] } },
  { id: 'tpl_photo', name: 'Photo Card', thumbnail: undefined, project: { name: 'Photo', canvas: { width: 350, height: 200, backgroundColor: '#ffffff' }, pages: [{ id: 'p1', elements: [] }] } },
];

const TemplatesPage: React.FC = () => {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    const load = () => {
      const list: Template[] = [...builtIn];

      // templates stored explicitly under 'swoocards_templates'
      try {
        const raw = localStorage.getItem('swoocards_templates');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            parsed.forEach((t: any, i: number) => list.push({ id: `local_tpl_${i}`, name: t.name ?? `Template ${i+1}`, project: t }));
          }
        }
      } catch (err) {
        console.warn('Could not parse swoocards_templates', err);
      }

      // include any local projects stored in encrypted 'swoocards'
      try {
        const stored = localStorage.getItem('swoocards');
        if (stored) {
          const decrypted = decryptData(stored);
          if (decrypted && typeof decrypted === 'object') {
            Object.keys(decrypted).forEach((k, idx) => {
              const proj = decrypted[k];
              list.push({ id: `proj_${k}`, name: proj.name ?? `Project ${k}`, project: proj });
            });
          }
        }
      } catch (err) {
        console.warn('Could not read projects from swoocards', err);
      }

      setTemplates(list);
    };

    load();
  }, []);

  const useTemplate = (tpl: Template) => {
    // store template in sessionStorage and redirect to project creation
    try {
      sessionStorage.setItem('swoocards_selected_template', JSON.stringify(tpl.project ?? tpl));
    } catch (err) {
      console.warn('Could not set session template', err);
    }
    router.push('/editor/create');
  };

  return (
    <main style={{ padding: 24, color: '#fff' }}>
      <h1 style={{ marginTop: 0 }}>Templates</h1>
      <p style={{ color: '#bbb' }}>Start from a template or use one of your local projects as a base.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginTop: 18 }}>
        {templates.map(t => (
          <div key={t.id} style={{ background: '#151515', border: '1px solid #2a2a2a', borderRadius: 8, padding: 12 }}>
            <div style={{ height: 120, borderRadius: 6, background: t.project?.canvas?.backgroundColor ?? '#2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: 10 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{t.name}</div>
                <div style={{ fontSize: 12, color: '#ddd' }}>{(t.project?.pages?.[0]?.elements?.length ?? 0)} elements</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => useTemplate(t)} style={{ flex: 1, background: '#0b76ff', color: '#fff', border: 'none', padding: '8px', borderRadius: 6, cursor: 'pointer' }}>Use Template</button>
              <button onClick={() => { navigator.clipboard?.writeText(JSON.stringify(t.project ?? t)); }} style={{ background: '#2a2a2a', color: '#fff', border: '1px solid #3a3a3a', padding: '8px', borderRadius: 6, cursor: 'pointer' }}>Copy</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default TemplatesPage;
