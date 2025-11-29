"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email || !password || !name) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    const result = await register(email, password, name);

    if (result.success) {
      router.push('/templates');
    } else {
      setError(result.error || 'Registration failed');
    }

    setIsLoading(false);
  };

  return (
    <main style={{
      background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(11, 118, 255, 0.2)',
        borderRadius: '16px',
        padding: '40px',
        backdropFilter: 'blur(10px)',
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 700,
          margin: '0 0 8px',
          background: 'linear-gradient(135deg, #ffffff 0%, #ccc 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Create Account
        </h1>

        <p style={{
          fontSize: '14px',
          color: '#aaa',
          margin: '0 0 32px',
        }}>
          Join Swoo and start designing beautiful business cards
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              color: '#ddd',
              marginBottom: '8px',
            }}>
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(11, 118, 255, 0.2)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'all 0.3s ease',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(11, 118, 255, 0.5)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(11, 118, 255, 0.2)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              color: '#ddd',
              marginBottom: '8px',
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(11, 118, 255, 0.2)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'all 0.3s ease',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(11, 118, 255, 0.5)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(11, 118, 255, 0.2)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              color: '#ddd',
              marginBottom: '8px',
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(11, 118, 255, 0.2)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'all 0.3s ease',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(11, 118, 255, 0.5)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(11, 118, 255, 0.2)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              color: '#ddd',
              marginBottom: '8px',
            }}>
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(11, 118, 255, 0.2)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'all 0.3s ease',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(11, 118, 255, 0.5)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(11, 118, 255, 0.2)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
            />
          </div>

          {error && (
            <div style={{
              padding: '12px 16px',
              background: 'rgba(255, 107, 107, 0.1)',
              border: '1px solid rgba(255, 107, 107, 0.3)',
              borderRadius: '8px',
              color: '#ff6b6b',
              fontSize: '13px',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: '12px 20px',
              background: isLoading ? 'rgba(11, 118, 255, 0.5)' : 'linear-gradient(135deg, #0b76ff 0%, #00d4ff 100%)',
              border: 'none',
              color: '#fff',
              borderRadius: '8px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 600,
              transition: 'all 0.3s ease',
              boxShadow: isLoading ? 'none' : '0 8px 24px rgba(11, 118, 255, 0.3)',
              marginTop: '8px',
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 32px rgba(11, 118, 255, 0.5)';
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 24px rgba(11, 118, 255, 0.3)';
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
              }
            }}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={{
          marginTop: '24px',
          paddingTop: '24px',
          borderTop: '1px solid rgba(11, 118, 255, 0.1)',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '13px', color: '#aaa', margin: '0' }}>
            Already have an account?{' '}
            <Link
              href="/auth/login"
              style={{
                color: '#0b76ff',
                textDecoration: 'none',
                fontWeight: 600,
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#00d4ff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#0b76ff')}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
