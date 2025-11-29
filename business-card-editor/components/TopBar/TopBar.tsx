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
        <h1 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>{project?.name || 'Editor'}</h1>
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
