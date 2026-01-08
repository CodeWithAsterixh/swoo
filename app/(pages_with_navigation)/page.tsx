"use client";
import React, { useEffect } from 'react';
import FeatureCard from '../components/FeatureCard';
import Footer from '../components/Footer';
import Hero from '../components/Hero';

export default function Home() {
  useEffect(() => {
    const handleIntersection: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, { threshold: 0.18 });

    const animatedElements = document.querySelectorAll('[data-animate-fade-up]');
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const features = [
    { title: 'Canvas Designer', desc: 'Intuitive drag-and-drop interface with real-time preview and pixel-perfect control.' },
    { title: 'Print Ready', desc: 'Export high-resolution PDFs, PNGs, and SVGs optimized for professional printing.' },
    { title: 'Cloud & Local', desc: 'Save to the cloud or keep designs offline. Full privacy control in your hands.' },
    { title: 'Templates', desc: 'Start with professionally designed templates and customize them in minutes.' },
    { title: 'Collaborate', desc: 'Share your designs with teammates and get feedback directly on your canvas.' },
    { title: 'Version Control', desc: 'Save and revert to any previous version of your design with full history.' },
  ];

  return (
    <main className="bg-base-300 relative isolate">
      <Hero />

      {/* Features Section */}
      <section className="py-10 md:py-22 bg-base-300 isolate relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 isolate relative">
          <div className="text-center mb-12 isolate relative">
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-base-content opacity-0 translate-y-6 transition-all duration-700 ease-out"
              data-animate-fade-up
            >
              Powerful Features
            </h2>
            <p
              className="text-lg text-base-content/70 max-w-2xl mx-auto opacity-0 translate-y-6 transition-all duration-700 ease-out"
              data-animate-fade-up
            >
              Everything you need to create stunning designs, efficiently.
            </p>
          </div>

          <div className="isolate relative rounded-2xl overflow-hidden p-6 md:p-8">
            {/* Animated gradient border */}
            <div className="absolute isolate inset-0 rounded-2xl pointer-events-none">
              <div
                className="absolute inset-0 rounded-2xl border-0 bg-[linear-gradient(90deg,var(--color-primary)/0.12,var(--color-accent)/0.08,var(--color-primary)/0.12)] animate-border-bg"
              />
              <div className="absolute inset-0.5 rounded-[calc(1rem-2px)] bg-base-300" />
            </div>

            {/* Gradient blob using theme colors */}
            <div
              className="absolute isolate -left-16 -top-10 w-64 h-64 rounded-full filter blur-3xl opacity-40 pointer-events-none z-0"
              style={{
                background: `
                  radial-gradient(circle at 20% 30%, var(--color-primary)/0.45, transparent 45%),
                  radial-gradient(circle at 80% 70%, var(--color-accent)/0.35, transparent 45%)
                `
              }}
            />

            {/* Gridlines */}
            <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
  <div className="gridlines w-full h-full" />
</div>


            <div className="relative z-10 pb-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, i) => (
                  <div
                    key={i}
                    className="opacity-0 translate-y-6 transition-all duration-700 ease-out"
                    data-animate-fade-up
                  >
                    <FeatureCard title={feature.title} desc={feature.desc} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <style>{`
          .animate-border-bg {
            background-size: 300% 300%;
            animation: borderShift 8s linear infinite;
            mix-blend-mode: screen;
            opacity: 0.9;
          }

          @keyframes borderShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          .gridlines {
  width: 100%;
  height: 100%;
  background-image:
    repeating-linear-gradient(
      0deg,
      color-mix(in srgb, var(--color-primary) 12%, transparent) 0px,
      color-mix(in srgb, var(--color-primary) 12%, transparent) 1px,
      transparent 1px,
      transparent 40px
    ),
    repeating-linear-gradient(
      90deg,
      color-mix(in srgb, var(--color-secondary) 8%, transparent) 0px,
      color-mix(in srgb, var(--color-secondary) 8%, transparent) 1px,
      transparent 1px,
      transparent 40px
    );

  background-size: 100% 100%;
  animation: matrixFlow 18s linear infinite;
  opacity: 0.9; /* optional */
  filter: drop-shadow(0 0 4px var(--color-primary));
}

@keyframes matrixFlow {
  0%   { background-position: 0 0, 0 0; }
  50%  { background-position: 0 -60px, 60px 0; }
  100% { background-position: 0 0, 0 0; }
}

        `}</style>
      </section>

      {/* Showcase Section */}
      <section className="py-20 md:py-32 bg-base-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3
                className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 text-base-content leading-tight"
                data-animate-fade-up
              >
                Design with confidence — deliver with delight
              </h3>
              <p
                className="text-lg text-base-content/70 mb-8 max-w-xl"
                data-animate-fade-up
              >
                A powerful canvas editor built for speed and precision. From print-ready exports to real-time collaboration, everything is crafted so you can focus on design.
              </p>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {['Unlimited layers', 'Vector + raster', 'Smart guides', 'Print-ready PDFs'].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 bg-base-100/60 border border-base-300/30 rounded-xl px-4 py-3 shadow-sm"
                  >
                    <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      ✓
                    </div>
                    <span className="text-sm text-base-content">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="flex gap-4 flex-wrap">
                <button
                  className="inline-flex items-center justify-center px-6 py-3 font-semibold rounded-lg bg-primary text-primary-content hover:shadow-xl transition-shadow transform-gpu hover:-translate-y-0.5"
                  onClick={() => globalThis.location.assign('/editor/create')}
                >
                  Try the Editor
                </button>

                <a
                  href="/templates"
                  className="inline-flex items-center justify-center px-6 py-3 font-medium rounded-lg bg-transparent border border-base-300 text-base-content hover:bg-base-100 transition"
                >
                  Browse Templates
                </a>
              </div>
            </div>

            {/* Visual */}
            <div className="relative flex items-center justify-center">
              <div className="relative w-[360px] h-[420px]">
                <div
                  className="absolute -left-6 -top-6 w-64 h-40 rounded-2xl bg-base-100/40 border border-base-300/30 transform-gpu rotate-6 shadow-md"
                  style={{ filter: 'blur(6px)' }}
                />
                <div
                  className="absolute -right-6 -bottom-6 w-72 h-44 rounded-2xl bg-base-100/30 border border-base-300/20 transform-gpu -rotate-3 shadow-lg"
                  style={{ mixBlendMode: 'multiply' }}
                />

                <div className="relative w-full h-full rounded-3xl bg-linear-to-br from-primary/10 to-accent/10 border border-base-300 p-4 shadow-2xl transform-gpu transition-transform hover:-translate-y-2">
                  <div className="w-full h-full rounded-2xl bg-linear-to-br from-base-100 to-base-200 overflow-hidden flex items-center justify-center">
                    <div className="w-60 h-72 rounded-xl bg-linear-to-br from-primary/20 to-accent/20 shadow-inner" />
                  </div>

                  {/* Floating badge */}
                  <div className="absolute -top-6 right-6 w-14 h-14 rounded-full bg-accent flex items-center justify-center text-accent-content shadow-md animate-bounce-slow">
                    ✨
                  </div>
                </div>
              </div>

              {/* Device outline */}
              <svg className="absolute w-96 h-56 -z-10 opacity-30" viewBox="0 0 600 360" fill="none" aria-hidden="true">
                <defs>
                  <linearGradient id="g1" x1="0" x2="1">
                    <stop offset="0%" stopColor="oklch(58% 0.233 277.117)" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="oklch(77% 0.152 181.912)" stopOpacity="0.15" />
                  </linearGradient>
                </defs>
                <rect x="20" y="20" width="560" height="320" rx="24" stroke="url(#g1)" strokeWidth="2" />
              </svg>

              {/* Blob (theme-based) */}
              <div
                className="absolute -bottom-12 left-8 w-48 h-48 rounded-full blur-2xl opacity-40"
                style={{
                  background: `
                    radial-gradient(circle at 30% 30%, var(--color-primary)/0.45, transparent 40%),
                    radial-gradient(circle at 80% 80%, var(--color-accent)/0.28, transparent 50%)
                  `
                }}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        <style>{`
          .animate-bounce-slow { animation: bounceSlow 3.8s infinite ease-in-out; }
          @keyframes bounceSlow { 0%,100%{ transform: translateY(0); } 50%{ transform: translateY(-8px); } }

          @media (prefers-reduced-motion: reduce) {
            .animate-bounce-slow { animation: none; }
            * { transition: none !important; }
          }
        `}</style>
      </section>

      <Footer />
    </main>
  );
}
