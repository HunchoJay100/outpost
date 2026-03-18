'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getCompany } from '@/lib/companies';
import { getData } from '@/lib/storage';
import { getAllMedia } from '@/lib/media-db';
import type { CompanySlug } from '@/types';

const sectionDefs = [
  { href: '/captions', label: 'Caption Library', desc: 'Browse, create, and manage captions', countLabel: 'Loaded', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
  { href: '/media', label: 'Media Vault', desc: 'Upload and organize photos and videos', countLabel: 'Assets', icon: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z' },
  { href: '/builder', label: 'Post Builder', desc: 'Pair media with captions and queue posts', countLabel: 'In Queue', icon: 'M11.42 15.17l-5.3-5.3a1 1 0 010-1.41l.71-.71a1 1 0 011.41 0l3.88 3.88 7.88-7.88a1 1 0 011.41 0l.71.71a1 1 0 010 1.41l-9.18 9.18a1 1 0 01-1.42.02zM3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z' },
  { href: '/settings', label: 'Brand Settings', desc: 'Voice profile, rules, and AI configuration', countLabel: 'Configured', icon: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z' },
];

export default function CompanyOverview({
  params,
}: {
  params: Promise<{ companySlug: string }>;
}) {
  const { companySlug } = use(params);
  const company = getCompany(companySlug);
  const [counts, setCounts] = useState({ captions: 0, media: 0, posts: 0 });

  useEffect(() => {
    const data = getData();
    const slug = companySlug as CompanySlug;
    const captionCount = data?.captions.filter((c) => c.companySlug === slug && !c.archived).length ?? 0;
    const postCount = data?.posts.filter((p) => p.companySlug === slug).length ?? 0;
    getAllMedia(slug).then((media) => {
      setCounts({ captions: captionCount, media: media.length, posts: postCount });
    }).catch(() => {
      setCounts({ captions: captionCount, media: 0, posts: postCount });
    });
  }, [companySlug]);

  if (!company) return null;

  const basePath = `/outpost/${companySlug}`;

  const sections = sectionDefs.map((s) => {
    let count = '';
    if (s.href === '/captions') count = String(counts.captions);
    else if (s.href === '/media') count = String(counts.media);
    else if (s.href === '/builder') count = String(counts.posts);
    return { ...s, count };
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <motion.div
          className="flex items-center gap-4 mb-3"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div
            className="h-px w-10"
            style={{ backgroundColor: company.colors.accent, opacity: 0.5 }}
          />
          <span className="font-sans text-xs tracking-[0.3em] text-[var(--color-muted)] uppercase">
            Workspace
          </span>
        </motion.div>
        <motion.h1
          className="font-sans text-4xl font-semibold tracking-[0.08em] uppercase"
          style={{ color: company.colors.accent }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          {company.name}
        </motion.h1>
        <motion.p
          className="text-[var(--color-muted)] font-body text-base mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {company.tagline}
        </motion.p>
      </div>

      {/* Section cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section, i) => (
          <motion.div
            key={section.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
          >
            <Link href={`${basePath}${section.href}`}>
              <motion.div
                className="group relative p-6 border border-[var(--color-border)] hover:border-white/[0.1] bg-white/[0.01] overflow-hidden cursor-pointer transition-all duration-300"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                {/* Left accent */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: company.colors.accent }}
                />

                <div className="relative z-10 flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-9 h-9 flex items-center justify-center border border-[var(--color-border)] group-hover:border-white/[0.12] transition-colors mt-0.5"
                    >
                      <svg
                        className="w-[18px] h-[18px]"
                        style={{ color: company.colors.accent }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d={section.icon} />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-[var(--color-foreground)] font-sans text-base font-medium tracking-[0.06em] uppercase group-hover:text-white transition-colors">
                        {section.label}
                      </h3>
                      <p className="text-[var(--color-muted)] font-body text-xs mt-1 group-hover:text-white/40 transition-colors">
                        {section.desc}
                      </p>
                    </div>
                  </div>

                  {/* Count badge */}
                  {section.count && (
                    <div className="text-right flex-shrink-0 ml-4">
                      <span
                        className="font-sans text-2xl font-extralight"
                        style={{ color: company.colors.accent }}
                      >
                        {section.count}
                      </span>
                      <p className="font-sans text-xs tracking-[0.15em] text-[var(--color-muted)] uppercase">
                        {section.countLabel}
                      </p>
                    </div>
                  )}
                  {!section.count && (
                    <div className="flex items-center gap-1.5 flex-shrink-0 ml-4 mt-2">
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: company.colors.accent, opacity: 0.6 }}
                      />
                      <span className="font-sans text-xs tracking-[0.15em] text-[var(--color-muted)] uppercase">
                        {section.countLabel}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom enter indicator */}
                <div className="relative z-10 mt-5 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div
                    className="h-px w-8"
                    style={{ backgroundColor: company.colors.accent, opacity: 0.4 }}
                  />
                  <span
                    className="font-sans text-xs tracking-[0.2em] uppercase"
                    style={{ color: company.colors.accent, opacity: 0.6 }}
                  >
                    Enter
                  </span>
                  <span style={{ color: company.colors.accent, opacity: 0.5 }} className="text-sm">→</span>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
