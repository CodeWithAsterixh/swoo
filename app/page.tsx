"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Home: React.FC = () => {
  const router = useRouter();
  const demoId = 'demo-project';

  return (
    <main style={{ padding: 28, maxWidth: 1100, margin: '0 auto', color: '#fff' }}>
      <section style={{ display: 'flex', gap: 24, alignItems: 'center', marginBottom: 28 }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 40, margin: '0 0 12px', color: '#fff' }}>Swoo — Fast Business Card Designer</h1>
          <p style={{ color: '#ccc', fontSize: 16, marginBottom: 18 }}>Create, style and export beautiful business cards in minutes. Intuitive canvas, templates, and offline autosave.</p>

          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => router.push('/editor/create')} style={{ padding: '12px 18px', background: '#0b76ff', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 15 }}>Create New</button>
            <Link href="/templates" style={{ display: 'inline-block', padding: '12px 18px', background: '#2a2a2a', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 15 }}>Browse Templates</Link>
            <button onClick={() => router.push(`/editor/${demoId}`)} style={{ padding: '12px 18px', background: '#3a3a3a', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 15 }}>Open Demo</button>
          </div>
        </div>

        <div style={{ width: 360, background: '#111', border: '1px solid #2d2d2d', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 13, color: '#aaa', marginBottom: 8 }}>Quick Tips</div>
          <ul style={{ margin: 0, paddingLeft: 18, color: '#ddd' }}>
            <li>Click &quot;Create New&quot; to start a new design (auto-saved locally).</li>
            <li>Use the Insert panel to add text, images and shapes.</li>
            <li>Select elements (Shift+Click) for batch edits.</li>
            <li>Open Templates to start from a ready-made layout.</li>
          </ul>
        </div>
      </section>

      <section style={{ marginTop: 6 }}>
        <h2 style={{ fontSize: 18, color: '#fff', marginBottom: 10 }}>Why Swoo?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          <div style={{ background: '#121212', padding: 16, borderRadius: 8, border: '1px solid #2a2a2a' }}>
            <h3 style={{ margin: '0 0 8px', color: '#fff' }}>Fast Start</h3>
            <p style={{ color: '#bbb', margin: 0 }}>Pick a template and go — no signup required.</p>
          </div>
          <div style={{ background: '#121212', padding: 16, borderRadius: 8, border: '1px solid #2a2a2a' }}>
            <h3 style={{ margin: '0 0 8px', color: '#fff' }}>Offline & Safe</h3>
            <p style={{ color: '#bbb', margin: 0 }}>Work locally — your designs are encrypted in your browser.</p>
          </div>
          <div style={{ background: '#121212', padding: 16, borderRadius: 8, border: '1px solid #2a2a2a' }}>
            <h3 style={{ margin: '0 0 8px', color: '#fff' }}>Export Ready</h3>
            <p style={{ color: '#bbb', margin: 0 }}>Download high-quality prints and digital assets.</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
