"use client";
import React, { useEffect, useRef } from 'react';

export default function Hero() {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const card = cardRef.current;
    if (!root || !card) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!card) return;
        if (e.intersectionRatio < 0.6) {
          card.style.transform = 'translateX(-30%) scale(0.98)';
        } else {
          card.style.transform = 'translateX(0) scale(1)';
        }
      });
    }, { threshold: [0, 0.25, 0.6, 1] });

    obs.observe(root);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-24 md:py-32 lg:py-40 relative overflow-visible" ref={rootRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-base-content opacity-0 translate-y-6 transition-all duration-700 ease-out" style={{animation: 'fadeUp 0.7s ease-out forwards'}}>
            Work Smarter, Design Faster
          </h1>
          <p className="text-lg md:text-xl text-base-content/70 mb-8 leading-relaxed opacity-0 translate-y-6 transition-all duration-700 ease-out" style={{animation: 'fadeUp 0.7s ease-out 0.1s forwards'}}>
            Build beautiful, print-ready business cards and templates with a powerful, privacy-first canvas editor.
          </p>
          <div className="flex gap-4 flex-wrap items-center">
            <button 
              className="inline-flex items-center justify-center px-6 py-3 font-semibold rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap bg-primary text-primary-content hover:shadow-lg hover:scale-105 active:scale-95"
              onClick={() => window.location.assign('/editor/create')}
            >
              Create New Design
            </button>
            <a href="/templates" className="inline-flex items-center justify-center px-6 py-3 font-semibold rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap bg-transparent border-2 border-base-300 text-base-content hover:bg-base-200 active:bg-base-300">
              Browse Templates
            </a>
          </div>
        </div>

        <div className="h-96 md:h-full rounded-2xl bg-gradient-to-br from-base-100 to-base-200 shadow-xl flex items-center justify-center p-6 relative overflow-hidden transition-transform duration-700 ease-out" ref={cardRef}>
          <div className="w-72 h-80 rounded-xl bg-gradient-to-br from-base-200 to-base-300 shadow-lg" />
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
