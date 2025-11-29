"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

const Navigation: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Templates', href: '/templates' },
    { label: 'Create', href: '/editor/create' },
  ];

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    router.push('/');
  };

  return (
    <nav className="app-nav">
      <Link href="/" style={{ textDecoration: 'none' }}>
        <div className="nav-brand" aria-label="Swoo home">Swoo</div>
      </Link>

      <div style={{ flex: 1 }} />

      <div className="nav-links" role="navigation" aria-label="Main navigation">
        {isAuthenticated && navItems.map(item => (
          <Link key={item.href} href={item.href} className={isActive(item.href) ? 'active' : ''}>
            {item.label}
          </Link>
        ))}
      </div>

      <button className="nav-toggle" aria-label="Toggle menu" onClick={() => setMobileOpen(!mobileOpen)}>☰</button>

      <div className="nav-actions">
        {isAuthenticated ? (
          <div className="nav-user-menu">
            <button onClick={() => setShowUserMenu(!showUserMenu)} className="btn btn-ghost">{user?.name || user?.email} ▼</button>
            {showUserMenu && (
              <div className="nav-user-dropdown">
                <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(11,118,255,0.06)', fontSize: 12, color: '#aaa' }}>{user?.email}</div>
                <button onClick={handleLogout} style={{ width: '100%', padding: '12px 16px', background: 'transparent', border: 'none', color: '#ff6b6b', textAlign: 'left', cursor: 'pointer' }}>Sign Out</button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link href="/auth/login" style={{ textDecoration: 'none', color: 'inherit' }}>Sign In</Link>
            <Link href="/auth/register" className="btn btn-primary" style={{ textDecoration: 'none' }}>Sign Up</Link>
          </>
        )}
      </div>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div style={{ position: 'absolute', top: '64px', left: 0, right: 0, background: 'linear-gradient(135deg,#0a0e27, #13172b)', padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {navItems.map(item => (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} style={{ padding: '10px 12px', color: isActive(item.href) ? '#0b76ff' : '#ddd' }}>{item.label}</Link>
          ))}
          {!isAuthenticated && (
            <div style={{ display: 'flex', gap: 8 }}>
              <Link href="/auth/login" onClick={() => setMobileOpen(false)} style={{ padding: '8px 12px' }}>Sign In</Link>
              <Link href="/auth/register" onClick={() => setMobileOpen(false)} className="btn btn-primary">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navigation;
