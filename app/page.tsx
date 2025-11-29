"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Home: React.FC = () => {
  const router = useRouter();
  const demoId = 'demo-project';

  return (
    <main style={{
      background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px 24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated gradient background */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-20%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(11, 118, 255, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 20s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-30%',
        left: '-10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 15s ease-in-out infinite reverse',
      }} />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(30px); }
        }
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div style={{
        position: 'relative',
        zIndex: 1,
        textAlign: 'center',
        maxWidth: '800px',
      }}>
        <h1 style={{
          fontSize: '56px',
          fontWeight: 700,
          margin: '0 0 20px',
          background: 'linear-gradient(135deg, #ffffff 0%, #ccc 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: 'slideInDown 0.8s ease-out',
        }}>
          Design Professional Business Cards
        </h1>

        <p style={{
          fontSize: '18px',
          color: '#bbb',
          margin: '0 0 32px',
          lineHeight: '1.6',
          animation: 'slideInUp 0.8s ease-out 0.1s both',
        }}>
          Create stunning business cards with our intuitive canvas-based designer. No design experience needed. Work online or offline. Your designs stay encrypted.
        </p>

        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          animation: 'slideInUp 0.8s ease-out 0.2s both',
          marginBottom: '64px',
        }}>
          <button
            onClick={() => router.push('/editor/create')}
            style={{
              padding: '14px 28px',
              fontSize: '16px',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #0b76ff 0%, #00d4ff 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(11, 118, 255, 0.3)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.boxShadow = '0 12px 32px rgba(11, 118, 255, 0.5)';
              (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.boxShadow = '0 8px 24px rgba(11, 118, 255, 0.3)';
              (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
            }}
          >
            Create New Design
          </button>

          <Link
            href="/templates"
            style={{
              padding: '14px 28px',
              fontSize: '16px',
              fontWeight: 600,
              background: 'rgba(11, 118, 255, 0.1)',
              color: '#0b76ff',
              border: '2px solid rgba(11, 118, 255, 0.3)',
              borderRadius: '8px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(11, 118, 255, 0.2)';
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(11, 118, 255, 0.5)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(11, 118, 255, 0.1)';
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(11, 118, 255, 0.3)';
            }}
          >
            Browse Templates
          </Link>

          <button
            onClick={() => router.push(`/editor/${demoId}`)}
            style={{
              padding: '14px 28px',
              fontSize: '16px',
              fontWeight: 600,
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#ccc',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.1)';
              (e.target as HTMLButtonElement).style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.05)';
              (e.target as HTMLButtonElement).style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            Try Demo
          </button>
        </div>

        {/* Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginTop: '80px',
        }}>
          {[
            { icon: '⚡', title: 'Fast & Responsive', desc: 'Real-time canvas editing with smooth interactions' },
            { icon: '🔒', title: 'Privacy First', desc: 'All designs encrypted locally in your browser' },
            { icon: '🎨', title: 'Intuitive Design', desc: 'Drag, resize, rotate with visual feedback' },
            { icon: '📱', title: 'Export Ready', desc: 'Download high-quality images for print' },
          ].map((feature, idx) => (
            <div
              key={idx}
              style={{
                padding: '24px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(11, 118, 255, 0.2)',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                textAlign: 'center',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = 'rgba(11, 118, 255, 0.1)';
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(11, 118, 255, 0.4)';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = 'rgba(255, 255, 255, 0.05)';
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(11, 118, 255, 0.2)';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{feature.icon}</div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 8px', color: '#fff' }}>
                {feature.title}
              </h3>
              <p style={{ fontSize: '13px', color: '#aaa', margin: 0 }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Home;

