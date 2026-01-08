"use client";

import React, { useState } from 'react';

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (mode: 'local' | 'remote' | 'both') => Promise<void>;
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
}: SaveModalProps) {
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = async (mode: 'local' | 'remote' | 'both') => {
    setError(null);
    try {
      await onSave(mode);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    }
  };

  return (
    <div
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          {/* Local Save Button */}
          <button
            onClick={() => handleSave('local')}
            disabled={isSaving}
            style={{
              padding: '12px 16px',
              background: 'rgba(11, 118, 255, 0.15)',
              border: '1px solid rgba(11, 118, 255, 0.3)',
              color: '#0b76ff',
              borderRadius: '8px',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              opacity: isSaving && status !== 'unsaved' ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isSaving) {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(11, 118, 255, 0.25)';
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(11, 118, 255, 0.15)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>💾 Save to Device</span>
              {status === 'saved' && (
                <span style={{ color: '#4ade80', marginLeft: '8px' }}>✓</span>
              )}
            </div>
            <div style={{ fontSize: '12px', color: '#0b76ff', opacity: 0.7, marginTop: '4px' }}>
              Saved locally on this device
            </div>
          </button>

          {/* Remote Save Button */}
          <button
            onClick={() => handleSave('remote')}
            disabled={isSaving}
            style={{
              padding: '12px 16px',
              background: 'rgba(59, 130, 246, 0.15)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              color: '#3b82f6',
              borderRadius: '8px',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              opacity: isSaving && status !== 'unsaved' ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isSaving) {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(59, 130, 246, 0.25)';
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(59, 130, 246, 0.15)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>☁️ Save to Cloud</span>
              {status === 'saved' && (
                <span style={{ color: '#4ade80', marginLeft: '8px' }}>✓</span>
              )}
            </div>
            <div style={{ fontSize: '12px', color: '#3b82f6', opacity: 0.7, marginTop: '4px' }}>
              Saved to your SWOOCards account
            </div>
          </button>

          {/* Both Save Button */}
          <button
            onClick={() => handleSave('both')}
            disabled={isSaving}
            style={{
              padding: '12px 16px',
              background: '#0b76ff',
              border: 'none',
              color: '#fff',
              borderRadius: '8px',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              opacity: isSaving && status !== 'unsaved' ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isSaving) {
                (e.currentTarget as HTMLButtonElement).style.background = '#0a5ed8';
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = '#0b76ff';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>🔄 Save Both</span>
              {status === 'saved' && (
                <span style={{ color: '#4ade80', marginLeft: '8px' }}>✓</span>
              )}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>
              Save to device and cloud
            </div>
          </button>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div
            style={{
              padding: '12px',
              background: status === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
              border: `1px solid ${status === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)'}`,
              borderRadius: '8px',
              fontSize: '12px',
              color: status === 'error' ? '#ef4444' : '#22c55e',
              marginBottom: '16px',
            }}
          >
            {statusMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div
            style={{
              padding: '12px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#ef4444',
              marginBottom: '16px',
            }}
          >
            {error}
          </div>
        )}

        {/* Status Indicator */}
        <div style={{ fontSize: '12px', color: '#999', textAlign: 'center' }}>
          {isSaving && 'Saving...'}
          {status === 'saved' && !isSaving && 'Saved successfully'}
          {status === 'unsaved' && !isSaving && 'Not saved yet'}
          {status === 'error' && !isSaving && 'Save failed'}
        </div>
      </div>
    </div>
  );
}
