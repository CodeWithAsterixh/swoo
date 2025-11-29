/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useRef, useState } from 'react';
import ElementRenderer from './ElementRenderer';
import useEditorStore from '../../store/editorStore';
import Image from 'next/image';
import { FiPlus, FiMove } from 'react-icons/fi';

type CanvasProps = {
  projectId?: string;
};

const Canvas: React.FC<CanvasProps> = () => {
  const project = useEditorStore(state => state.project);
  const currentPageIndex = useEditorStore(state => state.currentPage);
  const selectElement = useEditorStore(state => state.selectElement);
  const selectedElements = useEditorStore(state => state.selectedElements);
  const moveElement = useEditorStore(state => state.moveElement);
  const setCurrentPage = useEditorStore(state => state.setCurrentPage);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef<{ elementId: string; startX: number; startY: number; origX: number; origY: number } | null>(null);
  
  const pending = useEditorStore(state => state.pendingElement);
  const placePending = useEditorStore(state => state.placePending);
  const cancelPlacement = useEditorStore(state => state.cancelPlacement);
  
  const placingRef = useRef<{ startX: number; startY: number; dragging: boolean } | null>(null);
  const [preview, setPreview] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const page = project?.pages?.[currentPageIndex];

  useEffect(() => {
    if (project && page == null && project.pages.length > 0) {
      setCurrentPage(0);
    }
  }, [project, page, setCurrentPage]);

  useEffect(() => {
    function onPointerMove(e: PointerEvent) {
      const d = draggingRef.current;
      if (!d) return;
      const dx = e.clientX - d.startX;
      const dy = e.clientY - d.startY;
      moveElement(page?.id ?? '', d.elementId, d.origX + dx, d.origY + dy);
    }

    function onPointerUp() {
      draggingRef.current = null;
      setIsDragging(false);
    }

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [page, moveElement]);

  // handle global pointer move for placement preview and cursor thumbnail
  useEffect(() => {
    function onMove(e: PointerEvent) {
      if (!containerRef.current) return;
      // update cursor position (fixed, viewport coords)
      setCursorPos({ x: e.clientX, y: e.clientY });

      if (!pending) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (!placingRef.current || !placingRef.current.dragging) {
        // update preview position (centered at cursor)
        const w = pending.size?.width ?? 120;
        const h = pending.size?.height ?? 40;
        setPreview({ x: Math.max(0, Math.min(rect.width - w, Math.round(x - w / 2))), y: Math.max(0, Math.min(rect.height - h, Math.round(y - h / 2))), w, h });
      } else if (placingRef.current && placingRef.current.dragging) {
        const startX = placingRef.current.startX;
        const startY = placingRef.current.startY;
        const w = Math.max(1, Math.round(x - startX));
        const h = Math.max(1, Math.round(y - startY));
        setPreview({ x: Math.round(startX), y: Math.round(startY), w, h });
      }
    }

    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, [pending]);

  // set a custom cursor while placing (we render icon near cursor and hide native cursor)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // hide native cursor when showing our icon cursor or when dragging
    const styleId = 'swoo-hide-cursor-style';
    function addHideCursorStyle() {
      if (document.getElementById(styleId)) return;
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `* { cursor: none !important; }`;
      document.head.appendChild(style);
    }

    function removeHideCursorStyle() {
      const s = document.getElementById(styleId);
      if (s) s.remove();
    }

    if (pending || isDragging) {
      addHideCursorStyle();
    } else {
      removeHideCursorStyle();
    }

    return () => { removeHideCursorStyle(); };
  }, [pending, isDragging]);

  if (!project || !page) {
    return (
      <div style={{
        width: project?.canvas?.width ?? 600,
        height: project?.canvas?.height ?? 350,
        border: '1px solid #3a3a3a',
        background: '#2a2a2a',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '8px',
      }}>
        <div style={{ textAlign: 'center', color: '#666', fontSize: '14px' }}>No project or page loaded.</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onPointerDown={(ev) => {
        if (!pending) return;
        ev.stopPropagation();
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = ev.clientX - rect.left;
        const y = ev.clientY - rect.top;
        placingRef.current = { startX: x, startY: y, dragging: true };
        setPreview({ x: Math.round(x), y: Math.round(y), w: pending.size?.width ?? 120, h: pending.size?.height ?? 40 });
      }}
            onClick={(ev) => {
              // if clicking on canvas background (not an element), select the card
              if (!pending && ev.target === containerRef.current) {
                selectElement(page?.id ?? '', '__card__', false);
              }
            }}
      onPointerUp={(ev) => {
        if (!pending || !placingRef.current) return;
        ev.stopPropagation();
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = ev.clientX - rect.left;
        const y = ev.clientY - rect.top;
        // compute placement rect
        const startX = placingRef.current.startX;
        const startY = placingRef.current.startY;
        const dx = x - startX;
        const dy = y - startY;
        // if user clicked without dragging (small movement), use default size
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) {
          const w = pending.size?.width ?? 120;
          const h = pending.size?.height ?? 40;
          const px = Math.max(0, Math.min(rect.width - w, Math.round(startX - w / 2)));
          const py = Math.max(0, Math.min(rect.height - h, Math.round(startY - h / 2)));
          placePending(page?.id ?? '', px, py, w, h);
        } else {
          const rawW = Math.round(dx);
          const rawH = Math.round(dy);
          const px = rawW < 0 ? startX + rawW : startX;
          const py = rawH < 0 ? startY + rawH : startY;
          placePending(page?.id ?? '', Math.round(px), Math.round(py), Math.abs(rawW), Math.abs(rawH));
        }
        placingRef.current = null;
        setPreview(null);
      }}
      style={{
        width: project.canvas?.width ?? 600,
        height: project.canvas?.height ?? 350,
        border: '2px solid #0b76ff',
        background: project.canvas?.backgroundColor ?? '#fff',
        position: 'relative',
        borderRadius: '8px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
        cursor: pending ? 'none' : 'default',
      }}
    >
      {page.elements.map((el) => (
        <ElementRenderer
          key={el.id}
          element={el as any}
          selected={selectedElements.some(s => s.elementId === el.id)}
          onPointerDown={(ev) => {
            // if placing pending element, cancel placement instead of starting drag
            if (pending) {
              cancelPlacement();
              return;
            }
            ev.stopPropagation();
            // check if Shift key is pressed for multi-select
            const multiSelect = ev.shiftKey || ev.ctrlKey || ev.metaKey;
            selectElement(page?.id ?? '', el.id, multiSelect);
            
            const clientX = ev.clientX;
            const clientY = ev.clientY;
            draggingRef.current = {
              elementId: el.id,
              startX: clientX,
              startY: clientY,
              origX: el.position?.x ?? 0,
              origY: el.position?.y ?? 0,
            };
            setIsDragging(true);
          }}
          onClick={(ev) => { ev.stopPropagation(); }}
        />
      ))}

      {/* placement preview */}
      {pending && preview && (
        <div style={{ position: 'absolute', left: preview.x, top: preview.y, width: preview.w, height: preview.h, pointerEvents: 'none', opacity: 0.9, border: '1px dashed #0b76ff', background: pending.type === 'image' ? 'transparent' : 'rgba(11,118,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {pending.type === 'image' && (pending.src ? (<><Image src={pending.src} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></>) : <div style={{ color: '#888' }}>Image</div>)}
          {pending.type === 'text' && <div style={{ color: '#0b76ff', fontSize: '12px', pointerEvents: 'none' }}>{pending.content ?? 'Text'}</div>}
        </div>
      )}

      {/* floating thumbnail near cursor */}
      {pending && cursorPos && (
        <div style={{ position: 'fixed', left: cursorPos.x + 12, top: cursorPos.y + 12, pointerEvents: 'none', width: 80, height: 56, borderRadius: 6, overflow: 'hidden', boxShadow: '0 6px 18px rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.06)', zIndex: 9999 }}>
          {pending.type === 'image' && (pending.src ? <Image src={pending.src} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /> : <div style={{ width: '100%', height: '100%', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>Image</div>)}
          {pending.type === 'text' && <div style={{ width: '100%', height: '100%', background: 'rgba(11,118,255,0.06)', color: '#0b76ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>{pending.content ?? 'Text'}</div>}
        </div>
      )}

      {/* icon cursor for pending placement */}
      {pending && cursorPos && (
        <div style={{ position: 'fixed', left: cursorPos.x - 9, top: cursorPos.y - 9, pointerEvents: 'none', zIndex: 10000, color: '#0b76ff' }}>
          <FiPlus size={18} />
        </div>
      )}

      {/* icon cursor for dragging an existing element */}
      {isDragging && cursorPos && (
        <div style={{ position: 'fixed', left: cursorPos.x - 9, top: cursorPos.y - 9, pointerEvents: 'none', zIndex: 10000, color: '#fff' }}>
          <FiMove size={18} />
        </div>
      )}
    </div>
  );
};

export default Canvas;
