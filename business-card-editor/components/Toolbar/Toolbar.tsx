"use client";
import React, { useState } from 'react';
import useEditorStore from '../../store/editorStore';
import FloatingBox from '../FloatingBox/FloatingBox';

const Toolbar: React.FC = () => {
  const project = useEditorStore(state => state.project);
  const currentPage = useEditorStore(state => state.currentPage);
  const setCurrentPage = useEditorStore(state => state.setCurrentPage);
  const selectElement = useEditorStore(state => state.selectElement);
  const selectedElements = useEditorStore(state => state.selectedElements);
  const startPlacement = useEditorStore(state => state.startPlacement);

  // Image picker sub-component
  const ImagePickerButton: React.FC = () => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        startPlacement({ type: 'image', src: dataUrl, size: { width: 120, height: 80 } });
      };
      reader.readAsDataURL(file);
      if (inputRef.current) inputRef.current.value = '';
    };

    return (
      <>
        <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onFileChange} />
        <button onClick={() => inputRef.current?.click()} style={{
          padding: '10px 12px',
          background: '#3a3a3a',
          border: 'none',
          color: '#fff',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          transition: 'background 0.2s',
        }} onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.background = '#454545')} onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.background = '#3a3a3a')}>
          🖼️ Image
        </button>
      </>
    );
  };

  // Shape picker sub-component
  const ShapeButton: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const pickShape = (shape: 'rect' | 'oval' | 'line') => {
      // start placement with a shape pending element; store shape type in style.shape
      const defaultSize = shape === 'line' ? { width: 120, height: 2 } : { width: 120, height: 80 };
      startPlacement({ type: 'shape', size: defaultSize, style: { shape } });
      setIsOpen(false);
    };

    return (
      <>
        <button onClick={() => setIsOpen(true)} style={{
          padding: '10px 12px',
          background: '#3a3a3a',
          border: 'none',
          color: '#fff',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          transition: 'background 0.2s',
        }} onMouseOver={e => (e.currentTarget.style.background = '#454545')} onMouseOut={e => (e.currentTarget.style.background = '#3a3a3a')}>
          ▭ Shape
        </button>

        <FloatingBox isOpen={isOpen} onClose={() => setIsOpen(false)} title="Pick Shape" width={220} height={160} initialPosition={{ x: 140, y: 140 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button onClick={() => pickShape('rect')} style={{ padding: '8px', background: '#2a2a2a', color: '#fff', border: '1px solid #3a3a3a', borderRadius: 6, cursor: 'pointer' }}>▭ Rectangle</button>
            <button onClick={() => pickShape('oval')} style={{ padding: '8px', background: '#2a2a2a', color: '#fff', border: '1px solid #3a3a3a', borderRadius: 6, cursor: 'pointer' }}>◯ Oval</button>
            <button onClick={() => pickShape('line')} style={{ padding: '8px', background: '#2a2a2a', color: '#fff', border: '1px solid #3a3a3a', borderRadius: 6, cursor: 'pointer' }}>─ Line</button>
          </div>
        </FloatingBox>
      </>
    );
  };

  const page = project?.pages?.[currentPage];

  return (
    <aside style={{
      width: '280px',
      background: '#252525',
      borderRight: '1px solid #3a3a3a',
      padding: '20px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
    }}>
      <div>
        <h3 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#888', marginBottom: '12px', fontWeight: '600', margin: 0 }}>Insert</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button onClick={() => {
            startPlacement({ type: 'text', content: 'New text', size: { width: 120, height: 30 } });
          }} style={{
            padding: '10px 12px',
            background: '#3a3a3a',
            border: 'none',
            color: '#fff',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'background 0.2s',
          }} onMouseOver={e => (e.currentTarget.style.background = '#454545')} onMouseOut={e => (e.currentTarget.style.background = '#3a3a3a')}>
            📝 Text
          </button>

          <ImagePickerButton />

          <ShapeButton />
        </div>
      </div>

      <div style={{ borderTop: '1px solid #3a3a3a', paddingTop: '16px' }}>
        <h3 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#888', marginBottom: '12px', fontWeight: '600', margin: 0 }}>Pages</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setCurrentPage(0)} style={{
            flex: 1,
            padding: '8px',
            background: currentPage > 0 ? '#3a3a3a' : '#2a2a2a',
            border: 'none',
            color: '#fff',
            borderRadius: '4px',
            cursor: currentPage > 0 ? 'pointer' : 'default',
            fontSize: '12px',
            opacity: currentPage > 0 ? 1 : 0.5,
          }}>← Front</button>
          <button onClick={() => setCurrentPage(1)} style={{
            flex: 1,
            padding: '8px',
            background: currentPage < (project?.pages?.length ?? 2) - 1 ? '#3a3a3a' : '#2a2a2a',
            border: 'none',
            color: '#fff',
            borderRadius: '4px',
            cursor: (project?.pages?.length ?? 2) > 1 ? 'pointer' : 'default',
            fontSize: '12px',
            opacity: (project?.pages?.length ?? 2) > 1 ? 1 : 0.5,
          }}>Back →</button>
        </div>
        <div style={{ fontSize: '11px', color: '#666', marginTop: '8px' }}>Page {currentPage + 1}</div>
      </div>

      <div style={{ borderTop: '1px solid #3a3a3a', paddingTop: '16px' }}>
        <h3 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#888', marginBottom: '12px', fontWeight: '600', margin: 0 }}>Elements</h3>
        {page && page.elements.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '300px', overflowY: 'auto' }}>
            {page.elements.map((el, idx) => {
              const isSelected = selectedElements.some(s => s.elementId === el.id);
              return (
                <button
                  key={el.id}
                  onClick={() => selectElement(page?.id ?? '', el.id, false)}
                  style={{
                    padding: '8px 10px',
                    background: isSelected ? '#0b76ff' : '#3a3a3a',
                    border: 'none',
                    color: '#fff',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    textAlign: 'left',
                    transition: 'background 0.2s',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
                    if (!isSelected) e.currentTarget.style.background = '#454545';
                  }}
                  onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
                    if (!isSelected) e.currentTarget.style.background = '#3a3a3a';
                  }}
                >
                  {el.type === 'text' ? '📝' : el.type === 'image' ? '🖼️' : '▭'} {el.content || el.src?.slice(0, 20) || `${el.type} ${idx + 1}`}
                </button>
              );
            })}
          </div>
        ) : (
          <div style={{ fontSize: '12px', color: '#666' }}>No elements on this page</div>
        )}
      </div>
    </aside>
  );
};

export default Toolbar;
