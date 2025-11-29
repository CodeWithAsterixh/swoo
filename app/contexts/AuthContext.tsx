"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Verify token with backend and attach user if valid
  const verifyToken = async (token: string) => {
    try {
      // Make a request to verify token validity
      const res = await fetch('/api/auth/verify', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        // keep a cached copy of the user for quick access
        try {
          localStorage.setItem('auth_user', JSON.stringify(data.user));
        } catch {
          // ignore storage errors
        }
      } else {
        // Token invalid, clear it
        setTokenState(null);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    } catch (error) {
      console.error('Token verification failed:', error);
    }
  };

  // Load token from localStorage on mount
  useEffect(() => {
    const init = async () => {
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken) {
        setTokenState(storedToken);
        // Verify token with backend and wait for result before clearing loading
        await verifyToken(storedToken);
      }
      setIsLoading(false);
    };

    void init();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }

      setTokenState(data.token);
      setUser(data.user);
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));

      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Login failed' };
    }
  };

  const register = async (email: string, password: string, name?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed' };
      }

      setTokenState(data.token);
      setUser(data.user);
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));

      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Registration failed' };
    }
  };

  const logout = () => {
    setTokenState(null);
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  const setToken = (newToken: string | null) => {
    setTokenState(newToken);
    if (newToken) {
      localStorage.setItem('auth_token', newToken);
    } else {
      localStorage.removeItem('auth_token');
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
    setToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
