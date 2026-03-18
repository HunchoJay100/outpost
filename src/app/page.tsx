'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { companies } from '@/lib/companies';
import { getData } from '@/lib/storage';
import SeedInitializer from '@/components/home/SeedInitializer';

export default function CommandView() {
  const [captionCount, setCaptionCount] = useState(0);
  const [postCount, setPostCount] = useState(0);

  useEffect(() => {
    const data = getData();
    if (data) {
      setCaptionCount(data.captions.filter((c) => !c.archived).length);
      setPostCount(data.posts.length);
    }
  }, []);

  return (
    <>
      <SeedInitializer />

      {/* Side markers */}
      <div className="side-marker side-marker-l">Content Operations</div>
      <div className="side-marker side-marker-r">Five Brands — One System</div>

      {/* Nav */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-100 px-[50px] py-7 flex items-center justify-between border-b border-white/[0.04]"
        style={{ background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="font-oswald font-bold text-lg tracking-[0.35em] uppercase text-[var(--color-foreground)]">
          The <span className="text-[var(--color-accent)]">Medium</span>
        </div>
        <div className="flex items-center gap-9">
          <a href="#brands" className="font-oswald text-xs tracking-[0.12em] uppercase text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors relative group">
            Brands
            <span className="absolute bottom-[-4px] left-0 w-0 h-px bg-[var(--color-accent)] group-hover:w-full transition-all duration-300" />
          </a>
          <a href="#overview" className="font-oswald text-xs tracking-[0.12em] uppercase text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors relative group">
            Overview
            <span className="absolute bottom-[-4px] left-0 w-0 h-px bg-[var(--color-accent)] group-hover:w-full transition-all duration-300" />
          </a>
          <a href="#brands" className="font-oswald text-xs tracking-[0.12em] uppercase text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors relative group">
            Settings
            <span className="absolute bottom-[-4px] left-0 w-0 h-px bg-[var(--color-accent)] group-hover:w-full transition-all duration-300" />
          </a>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" style={{ boxShadow: '0 0 8px rgba(246,70,43,0.5)' }} />
          <span className="font-oswald text-xs tracking-[0.1em] text-[var(--color-muted)]" suppressHydrationWarning>
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="min-h-screen flex flex-col justify-end px-[50px] pb-20 relative">
        {/* Ambient gradient */}
        <div className="absolute top-0 right-0 w-[60%] h-[70%] pointer-events-none" style={{ background: 'radial-gradient(ellipse at 80% 20%, rgba(246,70,43,0.06), transparent 60%)' }} />

        <motion.div
          className="font-oswald text-xs tracking-[0.4em] uppercase text-[var(--color-muted)] mb-7"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          Content Command Center — 2026
        </motion.div>

        <motion.h1
          className="font-oswald font-bold uppercase text-[var(--color-foreground)] leading-[0.9] tracking-[0.04em]"
          style={{ fontSize: 'clamp(70px, 11vw, 160px)' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <span className="font-extralight text-[var(--color-muted)]">The</span><br />
          Med<span className="text-[var(--color-accent)]">i</span>um
        </motion.h1>

        <motion.div
          className="flex items-end justify-between mt-[50px] pt-7 border-t border-[var(--color-border)]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <p className="max-w-[420px] font-body text-base leading-[1.7] text-[var(--color-muted)]">
            A unified content operations system for five brands.
            Create, store, and deploy at the speed of your vision.
          </p>
          <div className="flex flex-col items-center gap-2.5">
            <span className="font-oswald text-xs tracking-[0.2em] uppercase text-[var(--color-muted)]">Scroll</span>
            <div className="w-px h-[50px]" style={{ background: 'linear-gradient(180deg, var(--color-muted), transparent)', animation: 'scrollPulse 2s ease-in-out infinite' }} />
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <motion.section
        className="px-[50px] py-[60px] flex border-t border-b border-[var(--color-border)]"
        id="overview"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        {[
          { number: '5', accent: true, label: 'Active Brands' },
          { number: String(captionCount), accent: false, label: 'Captions Loaded' },
          { number: String(postCount), accent: false, label: 'Posts Queued' },
          { number: '∞', accent: false, label: 'Potential' },
        ].map((stat, i) => (
          <div key={stat.label} className={`flex-1 px-7 py-5 ${i < 3 ? 'border-r border-[var(--color-border)]' : ''}`}>
            <div className={`font-oswald font-extralight text-7xl tracking-[0.02em] leading-none ${stat.accent ? 'text-[var(--color-accent)] font-normal' : 'text-[var(--color-foreground)]'}`}>
              {stat.number}
            </div>
            <div className="font-oswald text-xs tracking-[0.2em] uppercase text-[var(--color-muted)] mt-2.5">
              {stat.label}
            </div>
          </div>
        ))}
      </motion.section>

      {/* Brands */}
      <section className="px-[50px] pt-20" id="brands">
        <motion.div
          className="flex items-center justify-between mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
        >
          <div className="font-body text-sm tracking-[0.4em] uppercase text-[var(--color-muted)] flex items-center gap-4">
            <div className="w-10 h-px bg-[var(--color-accent)]" />
            Select Brand
          </div>
          <div className="font-oswald text-xs tracking-[0.1em] text-[var(--color-muted)]">
            5 Active
          </div>
        </motion.div>

        <div className="flex flex-col">
          {companies.map((company, i) => (
            <motion.div
              key={company.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 + i * 0.08 }}
            >
              <Link
                href={`/outpost/${company.slug}`}
                className="grid items-center py-10 border-t border-[var(--color-border)] cursor-pointer relative overflow-hidden transition-all duration-400 text-inherit no-underline group hover:pl-5"
                style={{ gridTemplateColumns: '80px 1fr 300px 50px' }}
              >
                {/* Hover gradient */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400" style={{ background: 'linear-gradient(90deg, rgba(246,70,43,0.04), transparent 40%)' }} />

                <div className="font-oswald font-extralight text-[32px] text-[var(--color-muted)] group-hover:text-[var(--color-accent)] transition-colors duration-300 relative z-10">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="font-oswald font-semibold text-4xl tracking-[0.03em] uppercase group-hover:tracking-[0.06em] transition-all duration-400 relative z-10">
                  {company.name}
                </div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="font-oswald text-xs tracking-[0.1em] uppercase text-[var(--color-muted)] px-3.5 py-1.5 border border-[var(--color-border)] group-hover:bg-[var(--color-accent)] group-hover:text-white group-hover:border-[var(--color-accent)] transition-all duration-300">
                    {i === 0 ? 'Flagship' : 'Active'}
                  </div>
                  <div className="font-body text-sm text-[var(--color-muted)]">
                    {company.tagline}
                  </div>
                </div>
                <div className="font-oswald text-[22px] text-[var(--color-muted)] group-hover:translate-x-1.5 group-hover:text-[var(--color-accent)] transition-all duration-300 relative z-10 text-right">
                  →
                </div>
              </Link>
            </motion.div>
          ))}
          {/* Bottom border for last card */}
          <div className="border-t border-[var(--color-border)]" />
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-30 px-[50px] text-center relative">
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(246,70,43,0.04), transparent 60%)' }} />
        <div className="font-oswald text-xs tracking-[0.4em] uppercase text-[var(--color-muted)] mb-6">
          Five Brands — One Operator — Zero Friction
        </div>
        <h2 className="font-oswald font-bold uppercase leading-none tracking-[0.05em] mb-7" style={{ fontSize: 'clamp(40px, 6vw, 80px)' }}>
          Content <span className="text-[var(--color-accent)]">moves</span><br />at the speed<br />of the operator<span className="text-[var(--color-accent)]">.</span>
        </h2>
        <p className="font-body text-base text-[var(--color-muted)] max-w-[500px] mx-auto leading-[1.7]">
          The Medium was built because scattered folders and context-less tools
          are not systems. This is.
        </p>
      </section>

      {/* Footer */}
      <footer className="px-[50px] py-7 border-t border-[var(--color-border)] flex items-center justify-between">
        <div className="font-oswald text-xs tracking-[0.2em] uppercase text-[var(--color-muted)]">
          The Medium — Built by Chief © 2026
        </div>
        <div className="flex items-center gap-5">
          <a href="#overview" className="font-oswald text-xs tracking-[0.1em] uppercase text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors">Dashboard</a>
          <a href="#brands" className="font-oswald text-xs tracking-[0.1em] uppercase text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors">Settings</a>
          <span className="font-oswald text-xs tracking-[0.1em] uppercase text-[var(--color-muted)]">v1.0</span>
        </div>
      </footer>
    </>
  );
}
