"use client";
import React, { useRef, useState, useEffect, useCallback } from 'react';

type FloatingBoxProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  initialPosition?: { x: number; y: number };
  width?: number;
  height?: number;
};

const FloatingBox: React.FC<FloatingBoxProps> = ({
  isOpen,
  onClose,
  title,
  children,
  initialPosition = { x: 100, y: 100 },
  width = 280,
  height = 320,
}) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Constrain position to stay within viewport
  const constrainPosition = useCallback((x: number, y: number) => {
    const maxX = window.innerWidth - width;
    const maxY = window.innerHeight - height;
    return {
      x: Math.max(0, Math.min(x, maxX)),
      y: Math.max(0, Math.min(y, maxY)),
    };
  }, [width, height]);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag from header, not from content
    if ((e.target as HTMLElement).closest('[data-floating-content]')) {
      return;
    }
    e.preventDefault();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  useEffect(() => {
    if (!isDragging) return;

    function onMouseMove(e: MouseEvent) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      const constrained = constrainPosition(newX, newY);
      setPosition(constrained);
    }

    function onMouseUp() {
      setIsDragging(false);
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, dragOffset, constrainPosition]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop / overlay to prevent interaction with elements behind */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 999,
          background: 'transparent',
        }}
      />

      {/* Floating box */}
      <div
        ref={boxRef}
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: `${width}px`,
          height: `${height}px`,
          background: '#1a1a1a',
          border: '1px solid #3a3a3a',
          borderRadius: '8px',
          boxShadow: '0 12px 48px rgba(0,0,0,0.6)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
      >
        {/* Header (draggable) */}
        {title && (
          <div
            onMouseDown={handleMouseDown}
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid #3a3a3a',
              fontSize: '12px',
              fontWeight: '600',
              textTransform: 'uppercase',
              color: '#aaa',
              cursor: 'grab',
              userSelect: 'none',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>{title}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#666',
                cursor: 'pointer',
                fontSize: '18px',
                padding: '0',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = '#aaa')}
              onMouseOut={(e) => (e.currentTarget.style.color = '#666')}
            >
              ✕
            </button>
          </div>
        )}

        {/* Content */}
        <div
          data-floating-content
          style={{
            flex: 1,
            padding: '16px',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
};

export default FloatingBox;
