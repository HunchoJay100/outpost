'use client';

import { useState, useEffect, useCallback } from 'react';
import { Post, CompanySlug, PostType, PostStatus } from '@/types';
import { getData, setData } from '@/lib/storage';

export function usePosts(companySlug: CompanySlug) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    const data = getData();
    if (data) {
      setPosts(data.posts.filter((p) => p.companySlug === companySlug));
    }
    setLoading(false);
  }, [companySlug]);

  useEffect(() => {
    reload();
  }, [reload]);

  const addPost = useCallback(
    (fields: {
      captionId: string | null;
      captionText: string;
      mediaIds: string[];
      postType: PostType;
      notes: string;
      status: PostStatus;
    }) => {
      const data = getData();
      if (!data) return;

      const post: Post = {
        id: crypto.randomUUID(),
        companySlug,
        ...fields,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      data.posts.push(post);
      setData(data);
      reload();
      return post;
    },
    [companySlug, reload]
  );

  const updatePost = useCallback(
    (id: string, updates: Partial<Pick<Post, 'captionId' | 'captionText' | 'mediaIds' | 'postType' | 'notes' | 'status'>>) => {
      const data = getData();
      if (!data) return;

      const idx = data.posts.findIndex((p) => p.id === id);
      if (idx === -1) return;

      data.posts[idx] = {
        ...data.posts[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      setData(data);
      reload();
    },
    [reload]
  );

  const deletePost = useCallback(
    (id: string) => {
      const data = getData();
      if (!data) return;

      data.posts = data.posts.filter((p) => p.id !== id);
      setData(data);
      reload();
    },
    [reload]
  );

  return { posts, loading, addPost, updatePost, deletePost };
}
