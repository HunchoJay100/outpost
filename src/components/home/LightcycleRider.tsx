'use client';

import { motion } from 'framer-motion';

const TRON = '#ff5028';

export default function LightcycleRider() {
  return (
    <div
      className="fixed pointer-events-none z-[1]"
      style={{
        bottom: '38vh',
        right: '12%',
        transform: 'perspective(300px) rotateX(25deg) rotateY(-5deg)',
      }}
    >
      {/* Light trail behind the rider */}
      <motion.div
        className="absolute"
        style={{
          right: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '350px',
          height: '3px',
          background: `linear-gradient(90deg, transparent, ${TRON}40, ${TRON}90, ${TRON})`,
          boxShadow: `0 0 15px ${TRON}80, 0 0 40px ${TRON}40, 0 0 80px ${TRON}20`,
          borderRadius: '2px',
        }}
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: 350, opacity: 1 }}
        transition={{ duration: 2, delay: 2, ease: 'easeOut' }}
      />

      {/* Secondary trail glow — wider, softer */}
      <motion.div
        className="absolute"
        style={{
          right: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '300px',
          height: '20px',
          background: `linear-gradient(90deg, transparent, ${TRON}08, ${TRON}15, ${TRON}08)`,
          borderRadius: '10px',
          filter: 'blur(8px)',
        }}
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: 300, opacity: 1 }}
        transition={{ duration: 2, delay: 2.2, ease: 'easeOut' }}
      />

      {/* Lightcycle + Rider SVG silhouette */}
      <motion.svg
        width="120"
        height="60"
        viewBox="0 0 120 60"
        fill="none"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.5, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          filter: `drop-shadow(0 0 15px ${TRON}) drop-shadow(0 0 35px ${TRON}80) drop-shadow(0 0 60px ${TRON}40)`,
        }}
      >
        {/* Rear wheel */}
        <circle cx="25" cy="45" r="12" stroke={TRON} strokeWidth="2.5" fill="none" opacity="0.9" />
        <circle cx="25" cy="45" r="6" stroke={TRON} strokeWidth="1" fill="none" opacity="0.4" />

        {/* Front wheel */}
        <circle cx="95" cy="45" r="12" stroke={TRON} strokeWidth="2.5" fill="none" opacity="0.9" />
        <circle cx="95" cy="45" r="6" stroke={TRON} strokeWidth="1" fill="none" opacity="0.4" />

        {/* Frame — aggressive angular bike body */}
        <path
          d="M25 45 L40 30 L75 28 L95 45"
          stroke={TRON}
          strokeWidth="2.5"
          fill="none"
          opacity="0.9"
        />
        <path
          d="M37 33 L50 20 L70 18 L80 25"
          stroke={TRON}
          strokeWidth="2"
          fill="none"
          opacity="0.7"
        />

        {/* Rider body silhouette */}
        <path
          d="M55 18 L52 8 L54 3 L58 3 L60 8 L57 18"
          fill={TRON}
          opacity="0.8"
        />
        {/* Torso leaning forward */}
        <path
          d="M50 20 L55 10 L65 8 L70 14 L62 20 Z"
          fill={TRON}
          opacity="0.6"
        />
        {/* Arms reaching to handlebars */}
        <path
          d="M65 12 L78 22"
          stroke={TRON}
          strokeWidth="2"
          opacity="0.7"
        />

        {/* Engine glow */}
        <ellipse cx="60" cy="38" rx="12" ry="4" fill={TRON} opacity="0.15" />

        {/* Wheel hub glow */}
        <circle cx="25" cy="45" r="3" fill={TRON} opacity="0.3" />
        <circle cx="95" cy="45" r="3" fill={TRON} opacity="0.3" />
      </motion.svg>

      {/* Ground reflection of the rider */}
      <div
        className="absolute"
        style={{
          top: '100%',
          left: 0,
          right: 0,
          height: '40px',
          background: `linear-gradient(180deg, ${TRON}15, transparent)`,
          filter: 'blur(6px)',
        }}
      />
    </div>
  );
}
