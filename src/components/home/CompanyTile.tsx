'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CompanyConfig } from '@/types';

const TRON = '#ff5028';

interface CompanyTileProps {
  company: CompanyConfig;
  index: number;
  flagship?: boolean;
}

export default function CompanyTile({ company, index, flagship }: CompanyTileProps) {
  const { slug, name, tagline } = company;
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.4 + index * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Link href={`/outpost/${slug}`}>
        <motion.div
          className="group relative overflow-hidden cursor-pointer reflect"
          style={{
            background: hovered
              ? `linear-gradient(160deg, #1c1a18, #12110f 30%, #0c0b0a 60%, #141312)`
              : `linear-gradient(160deg, #161514, #0f0e0d 40%, #0a0a09 70%, #121110)`,
            boxShadow: hovered
              ? `0 0 80px ${TRON}30, 0 0 160px ${TRON}12, 0 30px 80px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.08)`
              : '0 15px 50px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          whileHover={{ y: -10, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.3 }}
        >
          {/* Brushed metal texture overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 2px,
                  rgba(255,255,255,0.008) 2px,
                  rgba(255,255,255,0.008) 3px
                ),
                linear-gradient(
                  180deg,
                  rgba(255,255,255,0.04) 0%,
                  rgba(255,255,255,0.01) 30%,
                  transparent 50%,
                  rgba(255,255,255,0.015) 70%,
                  rgba(255,255,255,0.03) 100%
                )
              `,
              opacity: 0.8,
            }}
          />

          {/* Metal highlight — moves with hover */}
          <div
            className="absolute inset-0 transition-all duration-700 pointer-events-none"
            style={{
              background: hovered
                ? 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.03) 100%)'
                : 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%)',
            }}
          />

          {/* TOP NEON */}
          <div className="absolute top-0 left-0 right-0 transition-all duration-500"
            style={{
              height: '3px',
              background: `linear-gradient(90deg, transparent 2%, ${TRON} 20%, ${TRON} 80%, transparent 98%)`,
              opacity: hovered ? 1 : 0.5,
              boxShadow: hovered ? `0 0 20px ${TRON}, 0 0 50px ${TRON}70, 0 0 100px ${TRON}35, 0 10px 50px ${TRON}25` : `0 0 10px ${TRON}30`,
            }}
          />

          {/* LEFT NEON */}
          <div className="absolute left-0 top-0 bottom-0 transition-all duration-500"
            style={{
              width: '3px',
              background: `linear-gradient(180deg, ${TRON} 0%, ${TRON}80 40%, ${TRON}30 70%, transparent 95%)`,
              opacity: hovered ? 1 : 0.25,
              boxShadow: hovered ? `0 0 15px ${TRON}80, 0 0 40px ${TRON}35, 10px 0 40px ${TRON}18` : `0 0 5px ${TRON}15`,
            }}
          />

          {/* RIGHT NEON */}
          <div className="absolute right-0 top-0 bottom-0 transition-all duration-600"
            style={{
              width: '2px',
              background: `linear-gradient(180deg, transparent 10%, ${TRON}50 40%, ${TRON}70 70%, ${TRON}50 95%)`,
              opacity: hovered ? 0.8 : 0,
              boxShadow: hovered ? `0 0 12px ${TRON}40, -8px 0 25px ${TRON}12` : 'none',
            }}
          />

          {/* BOTTOM NEON */}
          <div className="absolute bottom-0 left-0 right-0 transition-all duration-500"
            style={{
              height: '2px',
              background: `linear-gradient(90deg, transparent 5%, ${TRON}80 25%, ${TRON}80 75%, transparent 95%)`,
              opacity: hovered ? 0.8 : 0,
              boxShadow: hovered ? `0 0 15px ${TRON}60, 0 0 40px ${TRON}25, 0 -8px 30px ${TRON}15` : 'none',
            }}
          />

          {/* LIGHT SPILL */}
          <div className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 50% -30%, ${TRON}20, transparent 50%), radial-gradient(ellipse at -20% 50%, ${TRON}0d, transparent 35%)`,
              opacity: hovered ? 1 : 0,
            }}
          />

          {/* Content */}
          <div className="relative z-10 p-8 min-h-[240px] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {flagship && (
                  <div className="px-4 py-1.5 font-display text-[10px] tracking-[0.3em] uppercase transition-all duration-500"
                    style={{
                      color: TRON,
                      border: `2px solid ${TRON}${hovered ? '90' : '35'}`,
                      boxShadow: hovered ? `0 0 25px ${TRON}40, inset 0 0 20px ${TRON}12` : 'none',
                      textShadow: hovered ? `0 0 12px ${TRON}80` : 'none',
                    }}
                  >
                    Flagship
                  </div>
                )}
                <div className="w-3 h-3 rounded-full transition-all duration-500"
                  style={{
                    backgroundColor: TRON,
                    boxShadow: hovered ? `0 0 10px ${TRON}, 0 0 25px ${TRON}90, 0 0 50px ${TRON}50` : `0 0 8px ${TRON}50`,
                  }}
                />
              </div>
              <motion.svg className="w-6 h-6 transition-all duration-500"
                style={{ color: TRON, opacity: hovered ? 1 : 0.2, filter: hovered ? `drop-shadow(0 0 10px ${TRON}) drop-shadow(0 0 25px ${TRON}70)` : 'none' }}
                animate={{ x: hovered ? 5 : 0 }} transition={{ duration: 0.3 }}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
              </motion.svg>
            </div>

            <div className="mt-4">
              <h2 className="font-display text-xl tracking-[0.18em] uppercase leading-relaxed transition-all duration-500"
                style={{
                  color: TRON,
                  textShadow: hovered ? `0 0 15px ${TRON}, 0 0 35px ${TRON}70, 0 0 70px ${TRON}35` : `0 0 10px ${TRON}30`,
                }}
              >
                {name}
              </h2>
              <p className="text-xl font-sans mt-3 tracking-wider font-semibold transition-all duration-500"
                style={{ color: hovered ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.5)' }}
              >
                {tagline}
              </p>
            </div>

            {/* Light trail */}
            <div className="mt-6 relative h-[3px]">
              <div className="absolute left-0 top-0 h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: hovered ? '100%' : '70px',
                  background: `linear-gradient(90deg, ${TRON}, ${TRON}80, ${TRON}40, transparent)`,
                  boxShadow: hovered ? `0 0 15px ${TRON}80, 0 0 35px ${TRON}40` : `0 0 8px ${TRON}35`,
                }}
              />
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
