"use client";

import React, { useState } from 'react';

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (mode: 'local' | 'cloud' | 'both') => Promise<void>;
  isSaving: boolean;
  status: 'unsaved' | 'saving' | 'saved' | 'error';
  statusMessage?: string;
  projectId?: string;
}

export default function SaveModal({
  isOpen,
  onClose,
  onSave,
  isSaving,
  status,
  statusMessage,
  projectId,
}: Readonly<SaveModalProps>) {
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = async (mode: 'local' | 'cloud' | 'both') => {
    setError(null);
    try {
      await onSave(mode);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="save-design-title"
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
          border: '1px solid rgba(11, 118, 255, 0.2)',
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '400px',
          width: '90%',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          style={{
            fontSize: '24px',
            fontWeight: 700,
            margin: '0 0 12px',
            background: 'linear-gradient(135deg, #ffffff 0%, #ccc 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Save Design
        </h2>

        <p style={{ fontSize: '14px', color: '#aaa', margin: '0 0 24px' }}>
          Choose where to save your design
        </p>

        {projectId && (
          <div
            style={{
              padding: '12px',
              background: 'rgba(11, 118, 255, 0.08)',
              border: '1px solid rgba(11, 118, 255, 0.2)',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#0b76ff',
              marginBottom: '16px',
              wordBreak: 'break-all',
            }}
          >
            ID: {projectId}
          </div>
        )}

        {/* Status message */}
        {status === 'saved' && (
          <div
            style={{
              padding: '12px',
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '8px',
              fontSize: '13px',
              color: '#22c55e',
              marginBottom: '16px',
            }}
          >
            ✓ {statusMessage || 'Saved successfully'}
          </div>
        )}

        {status === 'saving' && (
          <div
            style={{
              padding: '12px',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '8px',
              fontSize: '13px',
              color: '#3b82f6',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: '2px solid rgba(59, 130, 246, 0.3)',
                borderTopColor: '#3b82f6',
                animation: 'spin 0.6s linear infinite',
              }}
            />
            Saving...
          </div>
        )}

        {(error || (status === 'error' && statusMessage)) && (
          <div
            style={{
              padding: '12px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              fontSize: '13px',
              color: '#ef4444',
              marginBottom: '16px',
            }}
          >
            ✗ {error || statusMessage || 'Save failed'}
          </div>
        )}

        {/* Save buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={() => handleSave('local')}
            disabled={isSaving}
            style={{
              padding: '12px 16px',
              background: 'rgba(11, 118, 255, 0.15)',
              border: '1px solid rgba(11, 118, 255, 0.3)',
              color: '#0b76ff',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: isSaving ? 'not-allowed' : 'pointer',
              opacity: isSaving ? 0.6 : 1,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (!isSaving) {
                e.currentTarget.style.background = 'rgba(11, 118, 255, 0.25)';
                e.currentTarget.style.borderColor = 'rgba(11, 118, 255, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSaving) {
                e.currentTarget.style.background = 'rgba(11, 118, 255, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(11, 118, 255, 0.3)';
              }
            }}
          >
            💾 Save to Device
          </button>

          <button
            onClick={() => handleSave('cloud')}
            disabled={isSaving}
            style={{
              padding: '12px 16px',
              background: 'linear-gradient(135deg, #0b76ff 0%, #00d4ff 100%)',
              border: 'none',
              color: '#fff',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: isSaving ? 'not-allowed' : 'pointer',
              opacity: isSaving ? 0.6 : 1,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (!isSaving) {
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(11, 118, 255, 0.4)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSaving) {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(11, 118, 255, 0.3)';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            ☁️ Save to Cloud
          </button>

          <button
            onClick={() => handleSave('both')}
            disabled={isSaving}
            style={{
              padding: '12px 16px',
              background: 'rgba(100, 200, 255, 0.15)',
              border: '1px solid rgba(100, 200, 255, 0.3)',
              color: '#64c8ff',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: isSaving ? 'not-allowed' : 'pointer',
              opacity: isSaving ? 0.6 : 1,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (!isSaving) {
                e.currentTarget.style.background = 'rgba(100, 200, 255, 0.25)';
                e.currentTarget.style.borderColor = 'rgba(100, 200, 255, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSaving) {
                e.currentTarget.style.background = 'rgba(100, 200, 255, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(100, 200, 255, 0.3)';
              }
            }}
          >
            🔄 Save Both
          </button>

          <button
            onClick={onClose}
            disabled={isSaving}
            style={{
              padding: '12px 16px',
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#ccc',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: isSaving ? 'not-allowed' : 'pointer',
              opacity: isSaving ? 0.6 : 1,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (!isSaving) {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.color = '#fff';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSaving) {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.color = '#ccc';
              }
            }}
          >
            Close
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
