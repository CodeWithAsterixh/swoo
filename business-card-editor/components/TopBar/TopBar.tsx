"use client";
import React from 'react';
import useEditorStore from '../../store/editorStore';

type TopBarProps = {
  projectId: string;
};

const TopBar: React.FC<TopBarProps> = ({ projectId }) => {
  const project = useEditorStore(state => state.project);
  const undo = useEditorStore(state => state.undo);
  const redo = useEditorStore(state => state.redo);
  const saveToServer = useEditorStore(state => state.saveToServer);
  const updateProjectName = useEditorStore(state => state.updateProjectName);

  const [editing, setEditing] = React.useState(false);
  const ref = React.useRef<HTMLHeadingElement | null>(null);

  const onFocus = () => {
    setEditing(true);
    // select text
    requestAnimationFrame(() => {
      const el = ref.current as HTMLElement | null;
      if (!el) return;
      const range = document.createRange();
      range.selectNodeContents(el);
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
    });
  };

  const commit = async (newName: string) => {
    const nameTrim = newName.trim() || 'Untitled';
    if (nameTrim === (project?.name || '')) return;
    updateProjectName(nameTrim);
    await saveToServer();
  };

  return (
    <div style={{
      height: '56px',
      background: '#1e1e1e',
      borderBottom: '1px solid #3a3a3a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: '20px',
      paddingRight: '20px',
      gap: '24px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <h1
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          onFocus={onFocus}
          onBlur={async (e) => {
            setEditing(false);
            const text = e.currentTarget.textContent || '';
            await commit(text);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              (e.target as HTMLElement).blur();
            }
            if (e.key === 'Escape') {
              e.preventDefault();
              // revert
              const el = ref.current;
              if (el) el.textContent = project?.name || 'Editor';
              (e.target as HTMLElement).blur();
            }
          }}
          style={{ fontSize: '18px', fontWeight: 600, margin: 0, outline: editing ? '2px solid rgba(11,118,255,0.15)' : 'none', padding: '2px 6px', borderRadius: 4 }}
        >
          {project?.name || 'Editor'}
        </h1>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={() => undo()} style={{
          padding: '6px 12px',
          background: '#3a3a3a',
          border: 'none',
          color: '#fff',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px',
        }} title="Undo (Ctrl+Z)">↶</button>

        <button onClick={() => redo()} style={{
          padding: '6px 12px',
          background: '#3a3a3a',
          border: 'none',
          color: '#fff',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px',
        }} title="Redo (Ctrl+Y)">↷</button>

        <div style={{ width: '1px', background: '#3a3a3a', margin: '0 8px' }}></div>

        <button onClick={() => saveToServer()} style={{
          padding: '6px 12px',
          background: '#0b76ff',
          border: 'none',
          color: '#fff',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: '500',
        }}>Save</button>
      </div>
    </div>
  );
};

export default TopBar;
