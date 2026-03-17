'use client';

import { use, useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCompany } from '@/lib/companies';
import { usePosts } from '@/hooks/usePosts';
import { useCaptions } from '@/hooks/useCaptions';
import { getAllMedia, getMediaBlobURL } from '@/lib/media-db';
import { CompanySlug, PostType, PostStatus, Post, Caption, MediaItem } from '@/types';

const POST_TYPES: PostType[] = [
  'Lead Gen', 'Brand Awareness', 'Recruitment', 'Project Spotlight',
  'Before & After', 'Educational', 'Team/BTS', 'Client Story',
];

const STATUSES: PostStatus[] = ['Draft', 'Ready', 'Scheduled'];

const statusColor: Record<PostStatus, string> = {
  Draft: '#5a5a5a',
  Ready: '#4ead6a',
  Scheduled: '#5b8bd4',
};

// ─── Media Picker Thumbnail ─────────────────────────────────
function MiniThumb({ item, selected, onToggle }: { item: MediaItem; selected: boolean; onToggle: () => void }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let revoke: string | null = null;
    getMediaBlobURL(item.id, item.mimeType).then((u) => {
      if (u) { setUrl(u); revoke = u; }
    });
    return () => { if (revoke) URL.revokeObjectURL(revoke); };
  }, [item.id, item.mimeType]);

  return (
    <button
      onClick={onToggle}
      className={`relative aspect-square border transition-all cursor-pointer overflow-hidden ${
        selected ? 'border-white/40 ring-1 ring-white/20' : 'border-[var(--color-border)] hover:border-white/[0.1]'
      }`}
    >
      {url && item.fileType === 'image' && (
        <img src={url} alt="" className="w-full h-full object-cover" />
      )}
      {url && item.fileType === 'video' && (
        <video src={url} className="w-full h-full object-cover" muted />
      )}
      {selected && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <span className="text-white text-sm font-bold">✓</span>
        </div>
      )}
    </button>
  );
}

// ─── Create/Edit Post Modal ─────────────────────────────────
function PostModal({
  accent,
  companySlug,
  captions,
  initial,
  onSave,
  onClose,
}: {
  accent: string;
  companySlug: CompanySlug;
  captions: Caption[];
  initial?: Post;
  onSave: (fields: {
    captionId: string | null;
    captionText: string;
    mediaIds: string[];
    postType: PostType;
    notes: string;
    status: PostStatus;
  }) => void;
  onClose: () => void;
}) {
  const [captionId, setCaptionId] = useState<string | null>(initial?.captionId ?? null);
  const [captionText, setCaptionText] = useState(initial?.captionText ?? '');
  const [mediaIds, setMediaIds] = useState<string[]>(initial?.mediaIds ?? []);
  const [postType, setPostType] = useState<PostType>(initial?.postType ?? 'Lead Gen');
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [status, setStatus] = useState<PostStatus>(initial?.status ?? 'Draft');
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [showCaptionPicker, setShowCaptionPicker] = useState(false);

  useEffect(() => {
    getAllMedia(companySlug).then(setMedia);
  }, [companySlug]);

  const activeCaptions = captions.filter((c) => !c.archived);

  const selectCaption = (c: Caption) => {
    setCaptionId(c.id);
    setCaptionText(c.text);
    setPostType(c.postType);
    setShowCaptionPicker(false);
  };

  const toggleMedia = (id: string) => {
    setMediaIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    onSave({ captionId, captionText, mediaIds, postType, notes, status });
  };

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        className="relative w-full max-w-3xl mx-4 bg-[#0c0c0c] border border-[var(--color-border)] max-h-[90vh] flex flex-col"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <div className="w-[3px] h-5" style={{ backgroundColor: accent }} />
            <h3 className="font-sans text-base font-medium tracking-[0.1em] uppercase">
              {initial ? 'Edit Post' : 'New Post'}
            </h3>
          </div>
          <button onClick={onClose} className="font-mono text-[10px] tracking-[0.1em] text-[var(--color-muted)] hover:text-white/60 transition-colors cursor-pointer uppercase">
            Close
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Post Type + Status */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block font-mono text-[10px] tracking-[0.25em] text-[var(--color-muted)] uppercase mb-2.5">Post Type</label>
              <div className="flex flex-wrap gap-2">
                {POST_TYPES.map((pt) => (
                  <button
                    key={pt}
                    onClick={() => setPostType(pt)}
                    className="font-mono text-[9px] tracking-[0.1em] uppercase px-3 py-1.5 border transition-all cursor-pointer"
                    style={{
                      color: postType === pt ? '#0a0a0a' : 'var(--color-muted)',
                      backgroundColor: postType === pt ? accent : 'transparent',
                      borderColor: postType === pt ? accent : 'var(--color-border)',
                    }}
                  >
                    {pt}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block font-mono text-[10px] tracking-[0.25em] text-[var(--color-muted)] uppercase mb-2.5">Status</label>
              <div className="flex gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className="font-mono text-[9px] tracking-[0.1em] uppercase px-3 py-1.5 border transition-all cursor-pointer"
                    style={{
                      color: status === s ? '#0a0a0a' : statusColor[s],
                      backgroundColor: status === s ? statusColor[s] : 'transparent',
                      borderColor: status === s ? statusColor[s] : 'var(--color-border)',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Caption */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="font-mono text-[10px] tracking-[0.25em] text-[var(--color-muted)] uppercase">Caption</label>
              <button
                onClick={() => setShowCaptionPicker(!showCaptionPicker)}
                className="font-mono text-[9px] tracking-[0.1em] uppercase cursor-pointer transition-colors"
                style={{ color: accent }}
              >
                {showCaptionPicker ? 'Write custom' : 'Pick from library'}
              </button>
            </div>

            {showCaptionPicker ? (
              <div className="border border-[var(--color-border)] max-h-[250px] overflow-y-auto">
                {activeCaptions.length === 0 ? (
                  <p className="p-4 font-serif text-xs italic text-[var(--color-muted)]">No captions in library.</p>
                ) : (
                  activeCaptions.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => selectCaption(c)}
                      className={`w-full text-left px-4 py-3 border-b border-[var(--color-border)] hover:bg-white/[0.02] transition-colors cursor-pointer ${
                        captionId === c.id ? 'bg-white/[0.03]' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-[8px] uppercase px-1.5 py-0.5 border" style={{ color: accent, borderColor: `${accent}40` }}>
                          {c.postType}
                        </span>
                        {captionId === c.id && <span className="font-mono text-[8px]" style={{ color: accent }}>✓ Selected</span>}
                      </div>
                      <p className="font-serif text-xs text-white/50 line-clamp-2">{c.text}</p>
                    </button>
                  ))
                )}
              </div>
            ) : (
              <textarea
                value={captionText}
                onChange={(e) => { setCaptionText(e.target.value); setCaptionId(null); }}
                className="w-full bg-white/[0.02] border border-[var(--color-border)] px-4 py-3 text-white/85 font-serif text-sm leading-[1.8] focus:outline-none focus:border-white/[0.12] transition-all resize-vertical min-h-[120px] placeholder:text-white/15"
                placeholder="Write or paste your caption..."
              />
            )}
          </div>

          {/* Media picker */}
          <div>
            <label className="block font-mono text-[10px] tracking-[0.25em] text-[var(--color-muted)] uppercase mb-2.5">
              Attach Media {mediaIds.length > 0 && `(${mediaIds.length} selected)`}
            </label>
            {media.length === 0 ? (
              <p className="font-serif text-xs italic text-[var(--color-muted)]">No media uploaded for this brand yet.</p>
            ) : (
              <div className="grid grid-cols-6 gap-2 max-h-[200px] overflow-y-auto">
                {media.map((item) => (
                  <MiniThumb
                    key={item.id}
                    item={item}
                    selected={mediaIds.includes(item.id)}
                    onToggle={() => toggleMedia(item.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block font-mono text-[10px] tracking-[0.25em] text-[var(--color-muted)] uppercase mb-2.5">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-white/[0.02] border border-[var(--color-border)] px-4 py-3 text-white/85 font-mono text-sm tracking-wide focus:outline-none focus:border-white/[0.12] transition-all resize-vertical min-h-[60px] placeholder:text-white/15"
              rows={2}
              placeholder="Internal notes, scheduling details..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--color-border)]">
          <button onClick={onClose} className="font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--color-muted)] px-5 py-2.5 border border-[var(--color-border)] hover:bg-white/[0.02] transition-colors cursor-pointer">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!captionText.trim()}
            className="font-mono text-[10px] tracking-[0.15em] uppercase px-5 py-2.5 border transition-all cursor-pointer disabled:opacity-30"
            style={{ color: '#0a0a0a', backgroundColor: accent, borderColor: accent }}
          >
            {initial ? 'Save Changes' : 'Create Post'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Post Card ──────────────────────────────────────────────
function PostCard({
  post,
  accent,
  onEdit,
  onStatusChange,
  onDelete,
}: {
  post: Post;
  accent: string;
  onEdit: () => void;
  onStatusChange: (status: PostStatus) => void;
  onDelete: () => void;
}) {
  return (
    <motion.div
      className="border border-[var(--color-border)] hover:border-white/[0.1] transition-all duration-300"
      layout
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-3">
          <span
            className="font-mono text-[9px] tracking-[0.12em] uppercase px-2.5 py-1 border"
            style={{ color: accent, borderColor: `${accent}40` }}
          >
            {post.postType}
          </span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColor[post.status] }} />
            <span className="font-mono text-[9px] tracking-[0.1em] uppercase" style={{ color: statusColor[post.status] }}>
              {post.status}
            </span>
          </div>
        </div>
        <span className="font-mono text-[9px] tracking-[0.1em] text-white/15">
          {new Date(post.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>

      {/* Caption preview */}
      <div className="px-5 py-4">
        <p className="font-serif text-sm leading-[1.8] text-white/70 line-clamp-3 whitespace-pre-line">
          {post.captionText}
        </p>
        {post.mediaIds.length > 0 && (
          <div className="mt-3 flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-[var(--color-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
            <span className="font-mono text-[9px] text-[var(--color-muted)]">
              {post.mediaIds.length} media attached
            </span>
          </div>
        )}
        {post.notes && (
          <p className="mt-2 font-mono text-[10px] text-white/25 italic">{post.notes}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 px-5 py-3 border-t border-[var(--color-border)]">
        <button onClick={onEdit} className="font-mono text-[9px] tracking-[0.12em] uppercase text-[var(--color-muted)] px-3 py-1.5 hover:bg-white/[0.03] hover:text-white/60 transition-colors cursor-pointer">
          Edit
        </button>
        <div className="w-px h-3 bg-[var(--color-border)]" />
        {STATUSES.filter((s) => s !== post.status).map((s) => (
          <button
            key={s}
            onClick={() => onStatusChange(s)}
            className="font-mono text-[9px] tracking-[0.12em] uppercase px-3 py-1.5 hover:bg-white/[0.03] transition-colors cursor-pointer"
            style={{ color: statusColor[s] }}
          >
            → {s}
          </button>
        ))}
        <div className="w-px h-3 bg-[var(--color-border)]" />
        <button onClick={onDelete} className="font-mono text-[9px] tracking-[0.12em] uppercase text-[var(--color-muted)] px-3 py-1.5 hover:bg-white/[0.03] hover:text-red-400/70 transition-colors cursor-pointer">
          Delete
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Page ──────────────────────────────────────────────
export default function BuilderPage({
  params,
}: {
  params: Promise<{ companySlug: string }>;
}) {
  const { companySlug } = use(params);
  const company = getCompany(companySlug);
  const { posts, loading, addPost, updatePost, deletePost } = usePosts(companySlug as CompanySlug);
  const { captions } = useCaptions(companySlug as CompanySlug);

  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [filterStatus, setFilterStatus] = useState<PostStatus | 'All'>('All');

  if (!company) return null;
  const accent = company.colors.accent;

  const filtered = filterStatus === 'All' ? posts : posts.filter((p) => p.status === filterStatus);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { All: posts.length };
    for (const p of posts) {
      counts[p.status] = (counts[p.status] || 0) + 1;
    }
    return counts;
  }, [posts]);

  const handleSaveNew = (fields: Parameters<typeof addPost>[0]) => {
    addPost(fields);
    setModal(null);
  };

  const handleSaveEdit = (fields: Parameters<typeof addPost>[0]) => {
    if (!editingPost) return;
    updatePost(editingPost.id, fields);
    setEditingPost(null);
    setModal(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: accent }} />
          <span className="text-[var(--color-muted)] font-mono text-xs tracking-wide">Loading posts...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <motion.div className="flex items-center gap-3 mb-3" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
            <div className="h-px w-8" style={{ backgroundColor: accent, opacity: 0.5 }} />
            <span className="font-mono text-[10px] tracking-[0.3em] text-[var(--color-muted)] uppercase">Builder</span>
          </motion.div>
          <motion.h1
            className="font-sans text-3xl font-semibold tracking-[0.08em] uppercase"
            style={{ color: accent }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            Posts
          </motion.h1>
          <motion.p className="text-[var(--color-muted)] font-serif text-sm italic mt-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            {posts.length} post{posts.length !== 1 ? 's' : ''} in queue
          </motion.p>
        </div>
        <motion.button
          onClick={() => setModal('add')}
          className="font-mono text-[10px] tracking-[0.15em] uppercase px-5 py-2.5 border transition-all cursor-pointer"
          style={{ color: '#0a0a0a', backgroundColor: accent, borderColor: accent }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          + New Post
        </motion.button>
      </div>

      {/* Status filters */}
      <motion.div className="flex items-center gap-2 mb-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        {(['All', ...STATUSES] as const).map((s) => {
          const count = statusCounts[s] || 0;
          const active = filterStatus === s;
          const color = s === 'All' ? accent : statusColor[s as PostStatus];
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className="font-mono text-[9px] tracking-[0.1em] uppercase px-3 py-1.5 border transition-all duration-200 cursor-pointer"
              style={{
                color: active ? '#0a0a0a' : color,
                backgroundColor: active ? color : 'transparent',
                borderColor: active ? color : 'var(--color-border)',
              }}
            >
              {s} {count > 0 && `(${count})`}
            </button>
          );
        })}
      </motion.div>

      {/* Post list */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div className="py-16 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="font-serif text-sm italic text-[var(--color-muted)]">
                {filterStatus !== 'All' ? `No ${filterStatus.toLowerCase()} posts.` : 'No posts yet. Create one to get started.'}
              </p>
            </motion.div>
          ) : (
            filtered.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                accent={accent}
                onEdit={() => { setEditingPost(post); setModal('edit'); }}
                onStatusChange={(status) => updatePost(post.id, { status })}
                onDelete={() => deletePost(post.id)}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {modal === 'add' && (
          <PostModal
            accent={accent}
            companySlug={companySlug as CompanySlug}
            captions={captions}
            onSave={handleSaveNew}
            onClose={() => setModal(null)}
          />
        )}
        {modal === 'edit' && editingPost && (
          <PostModal
            accent={accent}
            companySlug={companySlug as CompanySlug}
            captions={captions}
            initial={editingPost}
            onSave={handleSaveEdit}
            onClose={() => { setEditingPost(null); setModal(null); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
