'use client';

import { useState, useEffect, useCallback } from 'react';
import { Caption, CompanySlug, PostType } from '@/types';
import { getData, setData } from '@/lib/storage';

export function useCaptions(companySlug: CompanySlug) {
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [loading, setLoading] = useState(true);

  // Load captions for this company
  const reload = useCallback(() => {
    const data = getData();
    if (data) {
      setCaptions(data.captions.filter((c) => c.companySlug === companySlug));
    }
    setLoading(false);
  }, [companySlug]);

  useEffect(() => {
    reload();
  }, [reload]);

  const addCaption = useCallback(
    (text: string, postType: PostType, tags: string[]) => {
      const data = getData();
      if (!data) return;

      const newCaption: Caption = {
        id: crypto.randomUUID(),
        companySlug,
        text,
        postType,
        tags,
        archived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      data.captions.push(newCaption);
      setData(data);
      reload();
      return newCaption;
    },
    [companySlug, reload]
  );

  const updateCaption = useCallback(
    (id: string, updates: Partial<Pick<Caption, 'text' | 'postType' | 'tags'>>) => {
      const data = getData();
      if (!data) return;

      const idx = data.captions.findIndex((c) => c.id === id);
      if (idx === -1) return;

      data.captions[idx] = {
        ...data.captions[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      setData(data);
      reload();
    },
    [reload]
  );

  const deleteCaption = useCallback(
    (id: string) => {
      const data = getData();
      if (!data) return;

      data.captions = data.captions.filter((c) => c.id !== id);
      setData(data);
      reload();
    },
    [reload]
  );

  const toggleArchive = useCallback(
    (id: string) => {
      const data = getData();
      if (!data) return;

      const idx = data.captions.findIndex((c) => c.id === id);
      if (idx === -1) return;

      data.captions[idx].archived = !data.captions[idx].archived;
      data.captions[idx].updatedAt = new Date().toISOString();
      setData(data);
      reload();
    },
    [reload]
  );

  return { captions, loading, addCaption, updateCaption, deleteCaption, toggleArchive };
}
