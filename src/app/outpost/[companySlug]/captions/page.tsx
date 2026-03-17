'use client';

import { use } from 'react';
import { getCompany } from '@/lib/companies';

export default function CaptionsPage({
  params,
}: {
  params: Promise<{ companySlug: string }>;
}) {
  const { companySlug } = use(params);
  const company = getCompany(companySlug);
  if (!company) return null;

  return (
    <div>
      <h1
        className="font-display text-2xl font-bold tracking-wider uppercase mb-2"
        style={{ color: company.colors.accent }}
      >
        Caption Library
      </h1>
      <p className="text-white/35 text-sm font-sans tracking-wide">
        Coming in Phase 3
      </p>
    </div>
  );
}
