'use client';

import { motion } from 'framer-motion';
import { companies } from '@/lib/companies';
import CompanyTile from '@/components/home/CompanyTile';
import SeedInitializer from '@/components/home/SeedInitializer';

// Tron unified accent for the home screen
const TRON_ACCENT = '#ff5028';
const TRON_GLOW = 'rgba(255, 80, 40, 0.4)';

export default function CommandView() {
  return (
    <>
      <SeedInitializer />
      <div className="min-h-screen flex flex-col relative">
        <header className="pt-10 pb-6 px-8">
          <div className="max-w-6xl mx-auto">
            {/* Top bar */}
            <motion.div
              className="flex items-center justify-between mb-14"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.3 }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: TRON_ACCENT, boxShadow: `0 0 10px ${TRON_ACCENT}, 0 0 30px ${TRON_GLOW}, 0 0 60px rgba(255,80,40,0.2)` }}
                />
                <span
                  className="text-base font-sans tracking-[0.15em] uppercase font-bold"
                  style={{ color: `${TRON_ACCENT}cc`, textShadow: `0 0 15px ${TRON_GLOW}` }}
                >
                  Systems Online
                </span>
              </div>
              <span
                className="text-base font-sans tracking-wider text-white/25 font-semibold"
                suppressHydrationWarning
              >
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </motion.div>

            {/* OUTPOST — properly centered */}
            <motion.div
              className="flex justify-center mb-4 reflect"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            >
              <h1
                className="font-tron text-8xl md:text-[130px] font-normal text-white select-none uppercase leading-none text-center"
                style={{
                  letterSpacing: '0.3em',
                  marginRight: '-0.3em',
                  textShadow: '0 0 20px rgba(255,255,255,0.3), 0 0 50px rgba(255,255,255,0.15), 0 0 100px rgba(255,255,255,0.08), 0 0 180px rgba(255,80,40,0.06)',
                }}
              >
                Outpost
              </h1>
            </motion.div>

            {/* Neon divider */}
            <motion.div
              className="flex items-center justify-center mb-5"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <div
                className="h-[3px] w-[600px] max-w-full"
                style={{
                  background: `linear-gradient(90deg, transparent, ${TRON_ACCENT}80 25%, rgba(255,255,255,0.25) 50%, ${TRON_ACCENT}80 75%, transparent)`,
                  boxShadow: `0 0 20px ${TRON_GLOW}, 0 0 50px rgba(255,80,40,0.1)`,
                }}
              />
            </motion.div>

            {/* Subtitle */}
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
            >
              <span className="font-display text-lg tracking-[0.4em] text-white/40 uppercase"
                style={{ textShadow: '0 0 20px rgba(255,255,255,0.06)' }}
              >
                Content Command Center
              </span>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="flex items-center justify-center gap-8 mb-14"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.3 }}
            >
              {[
                { label: '5 Brands' },
                { label: '15 Captions' },
                { label: '0 Queued' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-4 px-7 py-3"
                  style={{
                    background: 'linear-gradient(160deg, rgba(255,255,255,0.03), rgba(255,255,255,0.008))',
                    border: `1px solid ${TRON_ACCENT}18`,
                    boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
                  }}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: TRON_ACCENT, boxShadow: `0 0 10px ${TRON_ACCENT}90, 0 0 25px ${TRON_GLOW}` }}
                  />
                  <span className="text-base font-sans tracking-[0.1em] text-white/55 font-bold uppercase">
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Section label */}
            <motion.div
              className="flex items-center gap-4 mb-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.5 }}
            >
              <div className="h-[3px] w-16" style={{ background: `linear-gradient(90deg, ${TRON_ACCENT}90, transparent)`, boxShadow: `0 0 12px ${TRON_GLOW}` }} />
              <span className="font-display text-base tracking-[0.25em] text-white/35 uppercase"
                style={{ textShadow: '0 0 12px rgba(255,255,255,0.05)' }}
              >
                Select Outpost
              </span>
            </motion.div>
          </div>
        </header>

        <main className="flex-1 px-8 pb-24">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {companies.slice(0, 3).map((company, index) => (
                <CompanyTile key={company.slug} company={company} index={index} flagship={company.slug === 'flynn-development'} />
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[66%] mx-auto">
              {companies.slice(3).map((company, index) => (
                <CompanyTile key={company.slug} company={company} index={index + 3} />
              ))}
            </div>
          </div>
        </main>

        <motion.footer className="px-8 py-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 2.2 }}>
          <div className="max-w-6xl mx-auto">
            <div className="h-[2px] w-full mb-6" style={{ background: `linear-gradient(90deg, transparent, ${TRON_ACCENT}25 25%, ${TRON_ACCENT}25 75%, transparent)`, boxShadow: `0 0 12px rgba(255,80,40,0.06)` }} />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {companies.map((c) => (
                  <div key={c.slug} className="w-3 h-3 rounded-full" style={{ backgroundColor: TRON_ACCENT, boxShadow: `0 0 10px ${TRON_ACCENT}70, 0 0 25px ${TRON_GLOW}`, opacity: 0.7 }} />
                ))}
              </div>
              <span className="font-display text-xs tracking-[0.3em] text-white/10 uppercase">Built by Chief</span>
            </div>
          </div>
        </motion.footer>
      </div>
    </>
  );
}
