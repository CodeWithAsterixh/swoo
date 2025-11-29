/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import useEditorStore from '../../store/editorStore';
import FloatingBox from '../FloatingBox/FloatingBox';

type InputFieldProps = {
  label: string;
  value: number | string;
  onChange: (v: any) => void;
};

const InputField: React.FC<InputFieldProps> = ({ label, value, onChange: onChangeField }) => (
  <div style={{ marginBottom: '12px' }}>
    <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: '4px', fontWeight: '600' }}>
      {label}
    </label>
    <input
      type={typeof value === 'number' ? 'number' : 'text'}
      value={value}
      onChange={e => onChangeField(typeof value === 'number' ? Number(e.target.value) : e.target.value)}
      style={{
        width: '100%',
        padding: '6px 8px',
        background: '#3a3a3a',
        border: '1px solid #4a4a4a',
        color: '#fff',
        borderRadius: '4px',
        fontSize: '13px',
        boxSizing: 'border-box',
      }}
    />
  </div>
);

type ColorPickerFieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
};

const ColorPickerField: React.FC<ColorPickerFieldProps> = ({ label, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const validColor = value && /^#[0-9A-Fa-f]{6}$/.test(value) ? value : '#000000';
  return (
    <div style={{ marginBottom: '12px' }}>
      <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: '4px', fontWeight: '600' }}>
        {label}
      </label>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <div
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: '40px',
            height: '40px',
            background: validColor,
            borderRadius: '4px',
            cursor: 'pointer',
            border: '1px solid #4a4a4a',
          }}
        />
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="#ffffff"
          style={{
            flex: 1,
            padding: '6px 8px',
            background: '#3a3a3a',
            border: '1px solid #4a4a4a',
            color: '#fff',
            borderRadius: '4px',
            fontSize: '12px',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Floating color picker box */}
      <FloatingBox
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={`Pick ${label}`}
        width={260}
        height={300}
        initialPosition={{ x: window.innerWidth - 300, y: 100 }}
      >
        <HexColorPicker color={validColor} onChange={onChange} />
      </FloatingBox>
    </div>
  );
};

const PropertiesPanel: React.FC = () => {
  const project = useEditorStore(state => state.project);
  const selectedElements = useEditorStore(state => state.selectedElements);
  const updateElement = useEditorStore(state => state.updateElement);
  const updateElements = useEditorStore(state => state.updateElements);
  const updateCanvas = useEditorStore(state => state.updateCanvas);

  if (!project) {
    return (
      <aside style={{
        width: '320px',
        background: '#252525',
        borderLeft: '1px solid #3a3a3a',
        padding: '20px',
        overflowY: 'auto',
      }}>
        <h3 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#888', marginBottom: '16px', fontWeight: '600' }}>Properties</h3>
        <div style={{ fontSize: '13px', color: '#666' }}>No project loaded.</div>
      </aside>
    );
  }

  const onCanvasChange = (patch: Partial<typeof project.canvas>) => {
    updateCanvas(patch as any);
  };

  // Handle multiple selections
  if (selectedElements.length > 1) {
    // Get all pages and elements for the selected items
    const elementObjs = selectedElements
      .map(sel => {
        const page = project.pages.find(p => p.id === sel.pageId);
        const el = page?.elements.find(e => e.id === sel.elementId);
        return el;
      })
      .filter(Boolean) as any[];

    // Find common properties
    const allSameType = elementObjs.every(el => el.type === elementObjs[0].type);
    const commonPosition = elementObjs.every(el => el.position.x === elementObjs[0].position.x && el.position.y === elementObjs[0].position.y) ? elementObjs[0].position : null;
    const commonSize = elementObjs.every(el => el.size.width === elementObjs[0].size.width && el.size.height === elementObjs[0].size.height) ? elementObjs[0].size : null;
    const commonRotation = elementObjs.every(el => el.rotation === elementObjs[0].rotation) ? elementObjs[0].rotation : null;

    const onBatchChange = (patch: Partial<any>) => {
      const updates = selectedElements.map(sel => ({
        pageId: sel.pageId,
        elementId: sel.elementId,
        patch,
      }));
      updateElements(updates);
    };

    return (
      <aside style={{
        width: '320px',
        background: '#252525',
        borderLeft: '1px solid #3a3a3a',
        padding: '20px',
        overflowY: 'auto',
      }}>
        <h3 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#888', marginBottom: '16px', fontWeight: '600', margin: 0 }}>Properties</h3>
        <div style={{ marginBottom: '12px', padding: '8px', background: '#1a1a1a', borderRadius: '4px', fontSize: '12px', color: '#0b76ff' }}>
          {selectedElements.length} elements selected
        </div>

        {commonPosition && (
          <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #3a3a3a' }}>
            <h4 style={{ fontSize: '11px', textTransform: 'uppercase', color: '#aaa', marginBottom: '8px', fontWeight: '600', margin: 0 }}>Position</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <InputField label="X" value={commonPosition.x} onChange={x => onBatchChange({ position: { ...commonPosition, x } })} />
              <InputField label="Y" value={commonPosition.y} onChange={y => onBatchChange({ position: { ...commonPosition, y } })} />
            </div>
          </div>
        )}

        {commonSize && (
          <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #3a3a3a' }}>
            <h4 style={{ fontSize: '11px', textTransform: 'uppercase', color: '#aaa', marginBottom: '8px', fontWeight: '600', margin: 0 }}>Size</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <InputField label="Width" value={commonSize.width} onChange={w => onBatchChange({ size: { ...commonSize, width: w } })} />
              <InputField label="Height" value={commonSize.height} onChange={h => onBatchChange({ size: { ...commonSize, height: h } })} />
            </div>
          </div>
        )}

        {commonRotation !== null && (
          <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #3a3a3a' }}>
            <h4 style={{ fontSize: '11px', textTransform: 'uppercase', color: '#aaa', marginBottom: '8px', fontWeight: '600', margin: 0 }}>Transform</h4>
            <InputField label="Rotation" value={commonRotation} onChange={r => onBatchChange({ rotation: r })} />
          </div>
        )}

        {allSameType && elementObjs[0].type === 'text' && (
          <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #3a3a3a' }}>
            <h4 style={{ fontSize: '11px', textTransform: 'uppercase', color: '#aaa', marginBottom: '8px', fontWeight: '600', margin: 0 }}>Text</h4>
            <InputField label="Font Size" value={(elementObjs[0]?.style as any)?.fontSize ?? ''} onChange={fs => onBatchChange({ style: { ...(elementObjs[0]?.style as any), fontSize: fs } })} />
            <ColorPickerField label="Color" value={(elementObjs[0]?.style as any)?.color ?? '#000000'} onChange={c => onBatchChange({ style: { ...(elementObjs[0]?.style as any), color: c } })} />
          </div>
        )}
      </aside>
    );
  }

  // Single selection or no selection
  const pageId = selectedElements[0]?.pageId ?? project.pages[0]?.id;
  const page = project.pages.find(p => p.id === pageId);
  const isCardSelected = selectedElements[0]?.elementId === '__card__';
  const el = !isCardSelected && selectedElements[0] ? page?.elements.find(e => e.id === selectedElements[0].elementId) : null;

  return (
    <aside style={{
      width: '320px',
      background: '#252525',
      borderLeft: '1px solid #3a3a3a',
      padding: '20px',
      overflowY: 'auto',
    }}>
      <h3 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#888', marginBottom: '16px', fontWeight: '600', margin: 0 }}>Properties</h3>

      {/* Card / Canvas style */}
      <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #3a3a3a' }}>
        <h4 style={{ fontSize: '11px', textTransform: 'uppercase', color: '#aaa', marginBottom: '8px', fontWeight: '600', margin: 0 }}>Card Style</h4>
        <InputField label="Width" value={project.canvas?.width ?? 350} onChange={w => onCanvasChange({ width: w as number })} />
        <InputField label="Height" value={project.canvas?.height ?? 200} onChange={h => onCanvasChange({ height: h as number })} />
        <ColorPickerField label="Background" value={project.canvas?.backgroundColor ?? '#ffffff'} onChange={bg => onCanvasChange({ backgroundColor: bg })} />
      </div>

      {!isCardSelected && !el && (
        <div style={{ fontSize: '13px', color: '#666' }}>Select an element to edit its properties</div>
      )}

      {el && (
        <>
          <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #3a3a3a' }}>
            <h4 style={{ fontSize: '11px', textTransform: 'uppercase', color: '#aaa', marginBottom: '8px', fontWeight: '600', margin: 0 }}>Position</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <InputField label="X" value={el.position.x} onChange={x => updateElement(selectedElements[0].pageId, el.id, { position: { ...el.position, x } })} />
              <InputField label="Y" value={el.position.y} onChange={y => updateElement(selectedElements[0].pageId, el.id, { position: { ...el.position, y } })} />
            </div>
          </div>

          <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #3a3a3a' }}>
            <h4 style={{ fontSize: '11px', textTransform: 'uppercase', color: '#aaa', marginBottom: '8px', fontWeight: '600', margin: 0 }}>Size</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <InputField label="Width" value={el.size.width} onChange={w => updateElement(selectedElements[0].pageId, el.id, { size: { ...el.size, width: w } })} />
              <InputField label="Height" value={el.size.height} onChange={h => updateElement(selectedElements[0].pageId, el.id, { size: { ...el.size, height: h } })} />
            </div>
          </div>

          <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #3a3a3a' }}>
            <h4 style={{ fontSize: '11px', textTransform: 'uppercase', color: '#aaa', marginBottom: '8px', fontWeight: '600', margin: 0 }}>Transform</h4>
            <InputField label="Rotation" value={el.rotation} onChange={r => updateElement(selectedElements[0].pageId, el.id, { rotation: r })} />
          </div>

          {el.type === 'text' && (
            <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #3a3a3a' }}>
              <h4 style={{ fontSize: '11px', textTransform: 'uppercase', color: '#aaa', marginBottom: '8px', fontWeight: '600', margin: 0 }}>Text</h4>
              <InputField label="Content" value={el.content ?? ''} onChange={c => updateElement(selectedElements[0].pageId, el.id, { content: c })} />
              <InputField label="Font Size" value={(el.style as any)?.fontSize ?? ''} onChange={fs => updateElement(selectedElements[0].pageId, el.id, { style: { ...(el.style as any), fontSize: fs } })} />
              <ColorPickerField label="Color" value={(el.style as any)?.color ?? '#000000'} onChange={c => updateElement(selectedElements[0].pageId, el.id, { style: { ...(el.style as any), color: c } })} />
            </div>
          )}

          {el.type === 'image' && (
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '11px', textTransform: 'uppercase', color: '#aaa', marginBottom: '8px', fontWeight: '600', margin: 0 }}>Image</h4>
              <InputField label="Image URL" value={(el as any).src ?? ''} onChange={s => updateElement(selectedElements[0].pageId, el.id, { src: s })} />
            </div>
          )}
        </>
      )}
    </aside>
  );
};

export default PropertiesPanel;
