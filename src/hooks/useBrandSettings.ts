'use client';

import { useState, useEffect, useCallback } from 'react';
import { BrandSettings, CompanySlug } from '@/types';
import { getData, setData } from '@/lib/storage';

export function useBrandSettings(companySlug: CompanySlug) {
  const [settings, setSettings] = useState<BrandSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = getData();
    if (data?.brandSettings?.[companySlug]) {
      setSettings(data.brandSettings[companySlug]);
    }
    setLoading(false);
  }, [companySlug]);

  const updateSettings = useCallback(
    (updated: Partial<BrandSettings>) => {
      const data = getData();
      if (!data) return;

      const current = data.brandSettings[companySlug];
      const merged = {
        ...current,
        ...updated,
        updatedAt: new Date().toISOString(),
      };

      data.brandSettings[companySlug] = merged;
      setData(data);
      setSettings(merged);
    },
    [companySlug]
  );

  return { settings, loading, updateSettings };
}
