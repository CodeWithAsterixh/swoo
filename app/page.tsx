"use client";
import React, { useEffect } from 'react';
import Hero from './components/Hero';
import FeatureCard from './components/FeatureCard';
import Footer from './components/Footer';

export default function Home() {
  useEffect(() => {
    const observeFadeUps = () => {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('opacity-100', 'translate-y-0');
          }
        });
      }, { threshold: 0.18 });

      document.querySelectorAll('[data-animate-fade-up]').forEach(el => {
        obs.observe(el);
      });

      return () => obs.disconnect();
    };

    observeFadeUps();
  }, []);

  const features = [
    {
      title: 'Canvas Designer',
      desc: 'Intuitive drag-and-drop interface with real-time preview and pixel-perfect control.',
    },
    {
      title: 'Print Ready',
      desc: 'Export high-resolution PDFs, PNGs, and SVGs optimized for professional printing.',
    },
    {
      title: 'Cloud & Local',
      desc: 'Save to the cloud or keep designs offline. Full privacy control in your hands.',
    },
    {
      title: 'Templates',
      desc: 'Start with professionally designed templates and customize them in minutes.',
    },
    {
      title: 'Collaborate',
      desc: 'Share your designs with teammates and get feedback directly on your canvas.',
    },
    {
      title: 'Version Control',
      desc: 'Save and revert to any previous version of your design with full history.',
    },
  ];

  return (
    <main className="bg-base-100">
      <Hero />
      
      {/* Features Section */}
      <section className="py-20 md:py-32 bg-base-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
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
      </section>

      {/* Showcase Section */}
      <section className="py-20 md:py-32 bg-base-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 
              className="text-3xl md:text-4xl font-bold mb-6 text-base-content opacity-0 translate-y-6 transition-all duration-700 ease-out"
              data-animate-fade-up
            >
              Design with Confidence
            </h3>
            <p 
              className="text-lg text-base-content/70 mb-8 leading-relaxed opacity-0 translate-y-6 transition-all duration-700 ease-out"
              data-animate-fade-up
            >
              Our canvas editor provides all the tools professionals need. From basic shapes to advanced text effects, create exactly what you envision.
            </p>
            <ul className="space-y-3 opacity-0 translate-y-6 transition-all duration-700 ease-out" data-animate-fade-up>
              {['Unlimited layers', 'Vector and raster support', 'Smart guides and snapping', 'Live collaboration'].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                  <span className="text-base-content">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="h-96 rounded-2xl bg-gradient-to-br from-base-100 to-base-300 shadow-xl flex items-center justify-center p-6 opacity-0 translate-y-6 transition-all duration-700 ease-out" data-animate-fade-up>
            <div className="w-72 h-80 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 shadow-lg" />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
