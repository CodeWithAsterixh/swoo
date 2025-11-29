import React from 'react';
import { IElement } from '../../models/Element';

type Props = {
  element: IElement;
  selected?: boolean;
  onPointerDown?: (e: React.PointerEvent) => void;
  onClick?: (e: React.MouseEvent) => void;
};

const ElementRenderer: React.FC<Props> = ({ element, selected = false, onPointerDown, onClick }) => {
  const { position, size, rotation, style } = element;
  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    left: position?.x ?? 0,
    top: position?.y ?? 0,
    width: size?.width ?? 100,
    height: size?.height ?? 40,
    transform: `rotate(${rotation ?? 0}deg)`,
    boxSizing: 'border-box',
    zIndex: element.zIndex ?? 0,
    cursor: 'move',
    userSelect: 'none',
    outline: selected ? '2px solid #0b76ff' : undefined,
    background: element.type === 'shape' ? (style?.border ? undefined : '#eee') : undefined,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...((style || {}) as React.CSSProperties),
  };

  // root wrapper handles pointer events so image/text rendering remains decoupled
  return (
    <div style={baseStyle} onPointerDown={onPointerDown} onClick={onClick}>
      {element.type === 'text' && <div style={{ pointerEvents: 'none' }}>{element.content ?? ''}</div>}
      {element.type === 'image' && (
        // avoid next/image complexity here; use native img for editor canvas
        // eslint-disable-next-line @next/next/no-img-element
        <img src={element.src ?? ''} alt={String(element.content ?? 'image')} style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} />
      )}
      {element.type === 'shape' && <div style={{ width: '100%', height: '100%', pointerEvents: 'none' }} />}
    </div>
  );
};

export default ElementRenderer;
