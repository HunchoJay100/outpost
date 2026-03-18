'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getCompany } from '@/lib/companies';
import { getThemeVars } from '@/lib/theme';
import { CompanySlug } from '@/types';

const sidebarLinks = [
  { href: '', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { href: '/captions', label: 'Caption Library', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
  { href: '/media', label: 'Media Vault', icon: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z' },
  { href: '/builder', label: 'Post Builder', icon: 'M11.42 15.17l-5.3-5.3a1 1 0 010-1.41l.71-.71a1 1 0 011.41 0l3.88 3.88 7.88-7.88a1 1 0 011.41 0l.71.71a1 1 0 010 1.41l-9.18 9.18a1 1 0 01-1.42.02zM3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z' },
  { href: '/settings', label: 'Brand Settings', icon: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z' },
];

export default function CompanyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ companySlug: string }>;
}) {
  const { companySlug } = use(params);
  const company = getCompany(companySlug);
  const pathname = usePathname();
  const themeVars = getThemeVars(companySlug as CompanySlug);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--color-muted)] font-sans text-lg">Brand not found</p>
      </div>
    );
  }

  const basePath = `/outpost/${companySlug}`;

  return (
    <div className="min-h-screen flex" style={themeVars as React.CSSProperties}>
      {/* Sidebar */}
      <motion.aside
        className="w-72 min-h-screen border-r border-[var(--color-border)] bg-[#0a0a0a] flex flex-col"
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Sidebar header */}
        <div className="p-6 border-b border-[var(--color-border)]">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-sans text-xs tracking-[0.15em] text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors uppercase mb-5 group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
            </svg>
            The Medium
          </Link>

          {/* Company identity block */}
          <div
            className="p-4 border-l-[3px] bg-white/[0.02]"
            style={{ borderLeftColor: company.colors.accent }}
          >
            <div className="flex items-center gap-2.5 mb-1">
              <div className="relative">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: company.colors.accent }}
                />
                <div
                  className="absolute inset-0 w-2 h-2 rounded-full animate-ping"
                  style={{ backgroundColor: company.colors.accent, opacity: 0.3 }}
                />
              </div>
              <h2
                className="font-sans text-sm font-semibold tracking-[0.15em] uppercase"
                style={{ color: company.colors.accent }}
              >
                {company.name}
              </h2>
            </div>
            <p className="text-[var(--color-muted)] font-body text-xs ml-4.5">
              {company.tagline}
            </p>
          </div>
        </div>

        {/* Section label */}
        <div className="px-6 pt-5 pb-2">
          <span className="font-sans text-xs tracking-[0.3em] text-white/20 uppercase">
            Operations
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-4">
          {sidebarLinks.map((link) => {
            const fullPath = `${basePath}${link.href}`;
            const isActive = pathname === fullPath;
            const isHovered = hoveredLink === link.label;

            return (
              <Link
                key={link.label}
                href={fullPath}
                onMouseEnter={() => setHoveredLink(link.label)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <motion.div
                  className={`relative flex items-center gap-4 px-4 py-3.5 mb-0.5 transition-all duration-200 overflow-hidden ${
                    isActive ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]'
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-[2px]"
                      style={{ backgroundColor: company.colors.accent }}
                      layoutId="activeTab"
                      transition={{ duration: 0.25 }}
                    />
                  )}

                  {/* Hover glow */}
                  <AnimatePresence>
                    {(isHovered && !isActive) && (
                      <motion.div
                        className="absolute inset-0"
                        style={{
                          background: `radial-gradient(ellipse at 0% 50%, ${company.colors.glow}, transparent 70%)`,
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.08 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </AnimatePresence>

                  <svg
                    className="w-[18px] h-[18px] flex-shrink-0 relative z-10"
                    style={{ color: isActive ? company.colors.accent : 'var(--color-muted)' }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
                  </svg>
                  <span
                    className={`font-sans text-sm tracking-[0.08em] uppercase font-medium relative z-10 ${
                      isActive ? 'text-[var(--color-foreground)]' : 'text-[var(--color-muted)]'
                    } transition-colors duration-200`}
                  >
                    {link.label}
                  </span>
                  {isActive && (
                    <div className="ml-auto relative z-10">
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: company.colors.accent }}
                      />
                    </div>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="p-5 border-t border-[var(--color-border)]">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs tracking-[0.2em] text-white/15 uppercase">
              The Medium v1.0
            </span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/50" />
              <span className="font-sans text-xs tracking-[0.1em] text-white/20">
                OK
              </span>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <main className="flex-1 min-h-screen bg-[#0a0a0a]">
        {/* Top bar */}
        <div className="px-8 py-4 border-b border-[var(--color-border)] flex items-center justify-between bg-[#0c0c0c]">
          <div className="flex items-center gap-3">
            <span className="font-sans text-xs tracking-[0.25em] text-[var(--color-muted)] uppercase font-light">
              The Medium
            </span>
            <svg className="w-3 h-3 text-white/15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
            <span
              className="font-sans text-xs tracking-[0.2em] font-semibold uppercase"
              style={{ color: company.colors.accent }}
            >
              {company.name}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span
              className="font-sans text-xs tracking-[0.1em] text-[var(--color-muted)]"
              suppressHydrationWarning
            >
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
            <div className="flex items-center gap-2">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: company.colors.accent, opacity: 0.6 }}
              />
              <span className="font-sans text-xs tracking-[0.1em] text-[var(--color-muted)] uppercase">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <motion.div
          className="p-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
