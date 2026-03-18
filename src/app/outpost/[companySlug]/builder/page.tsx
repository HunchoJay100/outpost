'use client';

import { use, useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCompany } from '@/lib/companies';
import { usePosts } from '@/hooks/usePosts';
import { useCaptions } from '@/hooks/useCaptions';
import { getAllMedia, getMediaBlobURL, getMediaBlob } from '@/lib/media-db';
import { CompanySlug, PostType, PostStatus, Post, Caption, MediaItem, ExportedPost } from '@/types';
import { getData, setData } from '@/lib/storage';
import JSZip from 'jszip';

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
          <button onClick={onClose} className="font-sans text-xs tracking-[0.1em] text-[var(--color-muted)] hover:text-white/60 transition-colors cursor-pointer uppercase">
            Close
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Post Type + Status */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block font-sans text-xs tracking-[0.25em] text-[var(--color-muted)] uppercase mb-2.5">Post Type</label>
              <div className="flex flex-wrap gap-2">
                {POST_TYPES.map((pt) => (
                  <button
                    key={pt}
                    onClick={() => setPostType(pt)}
                    className="font-sans text-xs tracking-[0.1em] uppercase px-3 py-1.5 border transition-all cursor-pointer"
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
              <label className="block font-sans text-xs tracking-[0.25em] text-[var(--color-muted)] uppercase mb-2.5">Status</label>
              <div className="flex gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className="font-sans text-xs tracking-[0.1em] uppercase px-3 py-1.5 border transition-all cursor-pointer"
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
              <label className="font-sans text-xs tracking-[0.25em] text-[var(--color-muted)] uppercase">Caption</label>
              <button
                onClick={() => setShowCaptionPicker(!showCaptionPicker)}
                className="font-sans text-xs tracking-[0.1em] uppercase cursor-pointer transition-colors"
                style={{ color: accent }}
              >
                {showCaptionPicker ? 'Write custom' : 'Pick from library'}
              </button>
            </div>

            {showCaptionPicker ? (
              <div className="border border-[var(--color-border)] max-h-[250px] overflow-y-auto">
                {activeCaptions.length === 0 ? (
                  <p className="p-4 font-body text-xs text-[var(--color-muted)]">No captions in library.</p>
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
                        <span className="font-sans text-xs uppercase px-1.5 py-0.5 border" style={{ color: accent, borderColor: `${accent}40` }}>
                          {c.postType}
                        </span>
                        {captionId === c.id && <span className="font-sans text-xs" style={{ color: accent }}>✓ Selected</span>}
                      </div>
                      <p className="font-body text-xs text-white/50 line-clamp-2">{c.text}</p>
                    </button>
                  ))
                )}
              </div>
            ) : (
              <textarea
                value={captionText}
                onChange={(e) => { setCaptionText(e.target.value); setCaptionId(null); }}
                className="w-full bg-white/[0.02] border border-[var(--color-border)] px-4 py-3 text-white/85 font-body text-sm leading-[1.8] focus:outline-none focus:border-white/[0.12] transition-all resize-vertical min-h-[120px] placeholder:text-white/15"
                placeholder="Write or paste your caption..."
              />
            )}
          </div>

          {/* Media picker */}
          <div>
            <label className="block font-sans text-xs tracking-[0.25em] text-[var(--color-muted)] uppercase mb-2.5">
              Attach Media {mediaIds.length > 0 && `(${mediaIds.length} selected)`}
            </label>
            {media.length === 0 ? (
              <p className="font-body text-xs text-[var(--color-muted)]">No media uploaded for this brand yet.</p>
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
            <label className="block font-sans text-xs tracking-[0.25em] text-[var(--color-muted)] uppercase mb-2.5">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-white/[0.02] border border-[var(--color-border)] px-4 py-3 text-white/85 font-sans text-sm tracking-wide focus:outline-none focus:border-white/[0.12] transition-all resize-vertical min-h-[60px] placeholder:text-white/15"
              rows={2}
              placeholder="Internal notes, scheduling details..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--color-border)]">
          <button onClick={onClose} className="font-sans text-xs tracking-[0.15em] uppercase text-[var(--color-muted)] px-5 py-2.5 border border-[var(--color-border)] hover:bg-white/[0.02] transition-colors cursor-pointer">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!captionText.trim()}
            className="font-sans text-xs tracking-[0.15em] uppercase px-5 py-2.5 border transition-all cursor-pointer disabled:opacity-30"
            style={{ color: '#0a0a0a', backgroundColor: accent, borderColor: accent }}
          >
            {initial ? 'Save Changes' : 'Create Post'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Build Zip (shared helper) ──────────────────────────────
async function buildPostZip(post: Post, folderName: string, mediaItems: MediaItem[], zip?: JSZip): Promise<JSZip> {
  const z = zip ?? new JSZip();
  const folder = z.folder(folderName)!;

  let captionContent = post.captionText;
  if (post.notes) captionContent += `\n\n---\nInternal Notes: ${post.notes}`;
  captionContent += `\n\n---\nPost Type: ${post.postType}\nStatus: ${post.status}\nCreated: ${new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
  folder.file('caption.txt', captionContent);

  const attachedMedia = mediaItems.filter((m) => post.mediaIds.includes(m.id));
  for (const item of attachedMedia) {
    const blob = await getMediaBlob(item.id);
    if (blob) folder.file(item.fileName, blob);
  }

  return z;
}

async function saveZipToFile(zip: JSZip, fileName: string) {
  const content = await zip.generateAsync({ type: 'blob' });

  // Try File System Access API (lets user pick save location)
  if ('showSaveFilePicker' in window) {
    try {
      const handle = await (window as unknown as { showSaveFilePicker: (opts: unknown) => Promise<FileSystemFileHandle> }).showSaveFilePicker({
        suggestedName: fileName,
        types: [{ description: 'ZIP Archive', accept: { 'application/zip': ['.zip'] } }],
      });
      const writable = await handle.createWritable();
      await writable.write(content);
      await writable.close();
      return;
    } catch (e) {
      if ((e as Error).name === 'AbortError') return; // user cancelled
    }
  }

  // Fallback
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function saveToPostLibrary(posts: Post[], exportName: string) {
  const data = getData();
  if (!data) return;

  for (const post of posts) {
    // Don't duplicate if already saved with same id
    if (data.exportedPosts.some((e) => e.id === post.id)) continue;

    const exported: ExportedPost = {
      id: post.id,
      companySlug: post.companySlug,
      captionText: post.captionText,
      mediaIds: post.mediaIds,
      postType: post.postType,
      notes: post.notes,
      exportedAt: new Date().toISOString(),
      exportName,
    };
    data.exportedPosts.push(exported);
  }

  setData(data);
}

// ─── Export Name Modal ───────────────────────────────────────
function ExportModal({
  accent,
  defaultName,
  postCount,
  onExport,
  onClose,
}: {
  accent: string;
  defaultName: string;
  postCount: number;
  onExport: (name: string) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(defaultName);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative bg-[#0c0c0c] border border-[var(--color-border)] p-6 w-full max-w-md mx-4"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-[3px] h-5" style={{ backgroundColor: accent }} />
          <h3 className="font-sans text-base font-medium tracking-[0.1em] uppercase">
            Export {postCount > 1 ? `${postCount} Posts` : 'Post'}
          </h3>
        </div>

        <div className="mb-5">
          <label className="block font-sans text-xs tracking-[0.25em] text-[var(--color-muted)] uppercase mb-2.5">
            File Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white/[0.02] border border-[var(--color-border)] px-4 py-3 text-white/85 font-body text-sm focus:outline-none focus:border-white/[0.12] transition-all placeholder:text-white/15"
            autoFocus
            onKeyDown={(e) => { if (e.key === 'Enter' && name.trim()) onExport(name.trim()); }}
          />
          <p className="font-sans text-xs text-white/20 mt-2">.zip will be added automatically</p>
        </div>

        <p className="font-body text-sm text-[var(--color-muted)] mb-5">
          {postCount > 1 ? 'These posts' : 'This post'} will be saved to your Post Library for future use.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="font-sans text-xs tracking-[0.15em] uppercase text-[var(--color-muted)] px-5 py-2.5 border border-[var(--color-border)] hover:bg-white/[0.02] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => name.trim() && onExport(name.trim())}
            disabled={!name.trim()}
            className="font-sans text-xs tracking-[0.15em] uppercase px-5 py-2.5 border transition-all cursor-pointer disabled:opacity-30"
            style={{ color: '#0a0a0a', backgroundColor: accent, borderColor: accent }}
          >
            Export
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Platform Preview Modal ─────────────────────────────────
function PreviewModal({
  post,
  accent,
  companyName,
  mediaItems,
  onClose,
}: {
  post: Post;
  accent: string;
  companyName: string;
  mediaItems: MediaItem[];
  onClose: () => void;
}) {
  const [platform, setPlatform] = useState<'instagram' | 'facebook'>('instagram');
  const [mediaUrls, setMediaUrls] = useState<{ url: string; type: string }[]>([]);
  const [currentMedia, setCurrentMedia] = useState(0);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const attached = mediaItems.filter((m) => post.mediaIds.includes(m.id));
    let cancelled = false;
    const loadedUrls: string[] = [];

    Promise.all(
      attached.map(async (item) => {
        const url = await getMediaBlobURL(item.id, item.mimeType);
        if (url) loadedUrls.push(url);
        return url ? { url, type: item.fileType } : null;
      })
    ).then((results) => {
      if (!cancelled) {
        setMediaUrls(results.filter(Boolean) as { url: string; type: string }[]);
      }
    });

    return () => {
      cancelled = true;
      loadedUrls.forEach(URL.revokeObjectURL);
    };
  }, [post.mediaIds, mediaItems]);

  const handleExport = async () => {
    setExporting(true);
    const slug = companyName.toLowerCase().replace(/\s+/g, '-');
    const name = `${slug}-${post.postType.toLowerCase().replace(/\s+/g, '-')}-${new Date(post.createdAt).toISOString().slice(0, 10)}`;
    const zip = await buildPostZip(post, name, mediaItems);
    await saveZipToFile(zip, `${name}.zip`);
    saveToPostLibrary([post], name);
    setExporting(false);
  };

  const handle = companyName.toLowerCase().replace(/\s+/g, '');
  const timeAgo = 'Just now';

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        className="relative w-full max-w-2xl mx-4 bg-[#0c0c0c] border border-[var(--color-border)] max-h-[90vh] flex flex-col"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <div className="w-[3px] h-5" style={{ backgroundColor: accent }} />
            <h3 className="font-sans text-base font-medium tracking-[0.1em] uppercase">Preview</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              disabled={exporting}
              className="font-sans text-xs tracking-[0.12em] uppercase px-4 py-2 border transition-all cursor-pointer"
              style={{ color: accent, borderColor: `${accent}50` }}
            >
              {exporting ? 'Exporting...' : 'Export Zip'}
            </button>
            <button onClick={onClose} className="font-sans text-xs tracking-[0.1em] text-[var(--color-muted)] hover:text-white/60 transition-colors cursor-pointer uppercase">
              Close
            </button>
          </div>
        </div>

        {/* Platform tabs */}
        <div className="flex border-b border-[var(--color-border)]">
          {(['instagram', 'facebook'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className="flex-1 py-3 font-sans text-xs tracking-[0.15em] uppercase transition-all cursor-pointer border-b-2"
              style={{
                color: platform === p ? accent : 'var(--color-muted)',
                borderBottomColor: platform === p ? accent : 'transparent',
                backgroundColor: platform === p ? 'rgba(255,255,255,0.02)' : 'transparent',
              }}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Preview body */}
        <div className="flex-1 overflow-y-auto p-6 flex justify-center">
          {platform === 'instagram' ? (
            /* ── Instagram Preview ── */
            <div className="w-full max-w-[380px] bg-black border border-white/10 rounded-sm overflow-hidden">
              {/* IG Header */}
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: accent, color: '#0a0a0a' }}>
                  {companyName.charAt(0)}
                </div>
                <div>
                  <p className="font-body text-[13px] text-white font-medium">{handle}</p>
                  <p className="font-body text-xs text-white/40">Sponsored</p>
                </div>
                <div className="ml-auto text-white/40 text-lg">···</div>
              </div>

              {/* IG Media */}
              <div className="aspect-square bg-[#1a1a1a] relative overflow-hidden">
                {mediaUrls.length > 0 ? (
                  <>
                    {mediaUrls[currentMedia]?.type === 'image' ? (
                      <img src={mediaUrls[currentMedia].url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <video src={mediaUrls[currentMedia]?.url} className="w-full h-full object-cover" muted autoPlay loop />
                    )}
                    {mediaUrls.length > 1 && (
                      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                        {mediaUrls.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentMedia(i)}
                            className="w-1.5 h-1.5 rounded-full cursor-pointer transition-all"
                            style={{ backgroundColor: i === currentMedia ? accent : 'rgba(255,255,255,0.3)' }}
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-body text-sm text-white/20">No media attached</span>
                  </div>
                )}
              </div>

              {/* IG Actions */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-4">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" /></svg>
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
                </div>
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" /></svg>
              </div>

              {/* IG Caption */}
              <div className="px-4 pb-4">
                <p className="font-body text-[13px] text-white/90 leading-[1.6] whitespace-pre-line">
                  <span className="font-medium text-white">{handle}</span>{' '}
                  {post.captionText.length > 150 ? post.captionText.slice(0, 150) + '... more' : post.captionText}
                </p>
                <p className="font-body text-xs text-white/30 mt-2 uppercase">{timeAgo}</p>
              </div>
            </div>
          ) : (
            /* ── Facebook Preview ── */
            <div className="w-full max-w-[420px] bg-[#242526] border border-white/5 rounded-lg overflow-hidden">
              {/* FB Header */}
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: accent, color: '#0a0a0a' }}>
                  {companyName.charAt(0)}
                </div>
                <div>
                  <p className="font-body text-[14px] text-white font-medium">{companyName}</p>
                  <div className="flex items-center gap-1">
                    <p className="font-body text-[12px] text-white/40">{timeAgo}</p>
                    <span className="text-white/40">·</span>
                    <svg className="w-3 h-3 text-white/40" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0a8 8 0 100 16A8 8 0 008 0zm3.669 11.538l-.468.354a.42.42 0 01-.253.085H5.052a.42.42 0 01-.253-.085l-.468-.354A.42.42 0 014.17 11.1l.455-4.55A.42.42 0 015.04 6.2h5.92a.42.42 0 01.416.35l.455 4.55a.42.42 0 01-.162.438z"/></svg>
                  </div>
                </div>
                <div className="ml-auto text-white/40 text-xl">···</div>
              </div>

              {/* FB Caption */}
              <div className="px-4 pb-3">
                <p className="font-body text-[14px] text-white/85 leading-[1.6] whitespace-pre-line">
                  {post.captionText.length > 300 ? post.captionText.slice(0, 300) + '... See more' : post.captionText}
                </p>
              </div>

              {/* FB Media */}
              {mediaUrls.length > 0 && (
                <div className="aspect-video bg-[#1a1a1a] relative overflow-hidden">
                  {mediaUrls[currentMedia]?.type === 'image' ? (
                    <img src={mediaUrls[currentMedia].url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <video src={mediaUrls[currentMedia]?.url} className="w-full h-full object-cover" muted autoPlay loop />
                  )}
                  {mediaUrls.length > 1 && (
                    <div className="absolute bottom-3 right-3 bg-black/60 px-2 py-1 rounded">
                      <span className="font-sans text-xs text-white">{currentMedia + 1}/{mediaUrls.length}</span>
                    </div>
                  )}
                </div>
              )}

              {/* FB Actions */}
              <div className="px-4 py-2 border-t border-white/5">
                <div className="flex items-center justify-around py-1">
                  {['Like', 'Comment', 'Share'].map((action) => (
                    <button key={action} className="flex items-center gap-2 px-4 py-2 rounded hover:bg-white/5 transition-colors">
                      <span className="font-body text-[13px] text-white/50">{action}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Media navigation */}
        {mediaUrls.length > 1 && (
          <div className="flex items-center justify-center gap-4 px-6 py-3 border-t border-[var(--color-border)]">
            <button
              onClick={() => setCurrentMedia((p) => Math.max(0, p - 1))}
              disabled={currentMedia === 0}
              className="font-sans text-xs tracking-[0.1em] uppercase px-3 py-1.5 border border-[var(--color-border)] text-[var(--color-muted)] hover:text-white/60 transition-colors cursor-pointer disabled:opacity-20"
            >
              Prev
            </button>
            <span className="font-sans text-xs text-[var(--color-muted)]">{currentMedia + 1} / {mediaUrls.length}</span>
            <button
              onClick={() => setCurrentMedia((p) => Math.min(mediaUrls.length - 1, p + 1))}
              disabled={currentMedia === mediaUrls.length - 1}
              className="font-sans text-xs tracking-[0.1em] uppercase px-3 py-1.5 border border-[var(--color-border)] text-[var(--color-muted)] hover:text-white/60 transition-colors cursor-pointer disabled:opacity-20"
            >
              Next
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Post Card ──────────────────────────────────────────────
function PostCard({
  post,
  accent,
  selected,
  onSelect,
  onEdit,
  onPreview,
  onExport,
  onStatusChange,
  onDelete,
}: {
  post: Post;
  accent: string;
  selected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onPreview: () => void;
  onExport: () => void;
  onStatusChange: (status: PostStatus) => void;
  onDelete: () => void;
}) {
  return (
    <motion.div
      className={`border transition-all duration-300 ${selected ? 'border-white/20' : 'border-[var(--color-border)] hover:border-white/[0.1]'}`}
      layout
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => { e.stopPropagation(); onSelect(); }}
            className="w-4 h-4 border flex items-center justify-center transition-all cursor-pointer flex-shrink-0"
            style={{
              borderColor: selected ? accent : 'rgba(255,255,255,0.15)',
              backgroundColor: selected ? accent : 'transparent',
            }}
          >
            {selected && <span className="text-xs text-black font-bold">✓</span>}
          </button>
          <span
            className="font-sans text-xs tracking-[0.12em] uppercase px-2.5 py-1 border"
            style={{ color: accent, borderColor: `${accent}40` }}
          >
            {post.postType}
          </span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColor[post.status] }} />
            <span className="font-sans text-xs tracking-[0.1em] uppercase" style={{ color: statusColor[post.status] }}>
              {post.status}
            </span>
          </div>
        </div>
        <span className="font-sans text-xs tracking-[0.1em] text-white/15">
          {new Date(post.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>

      {/* Caption preview */}
      <div className="px-5 py-4">
        <p className="font-body text-sm leading-[1.8] text-white/70 line-clamp-3 whitespace-pre-line">
          {post.captionText}
        </p>
        {post.mediaIds.length > 0 && (
          <div className="mt-3 flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-[var(--color-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
            <span className="font-sans text-xs text-[var(--color-muted)]">
              {post.mediaIds.length} media attached
            </span>
          </div>
        )}
        {post.notes && (
          <p className="mt-2 font-sans text-xs text-white/25 italic">{post.notes}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 px-5 py-3 border-t border-[var(--color-border)]">
        <button onClick={onPreview} className="font-sans text-xs tracking-[0.12em] uppercase px-3 py-1.5 hover:bg-white/[0.03] transition-colors cursor-pointer" style={{ color: accent }}>
          Preview
        </button>
        <div className="w-px h-3 bg-[var(--color-border)]" />
        <button onClick={onExport} className="font-sans text-xs tracking-[0.12em] uppercase px-3 py-1.5 hover:bg-white/[0.03] transition-colors cursor-pointer" style={{ color: accent }}>
          Export
        </button>
        <div className="w-px h-3 bg-[var(--color-border)]" />
        <button onClick={onEdit} className="font-sans text-xs tracking-[0.12em] uppercase text-[var(--color-muted)] px-3 py-1.5 hover:bg-white/[0.03] hover:text-white/60 transition-colors cursor-pointer">
          Edit
        </button>
        <div className="w-px h-3 bg-[var(--color-border)]" />
        {STATUSES.filter((s) => s !== post.status).map((s) => (
          <button
            key={s}
            onClick={() => onStatusChange(s)}
            className="font-sans text-xs tracking-[0.12em] uppercase px-3 py-1.5 hover:bg-white/[0.03] transition-colors cursor-pointer"
            style={{ color: statusColor[s] }}
          >
            → {s}
          </button>
        ))}
        <div className="w-px h-3 bg-[var(--color-border)]" />
        <button onClick={onDelete} className="font-sans text-xs tracking-[0.12em] uppercase text-[var(--color-muted)] px-3 py-1.5 hover:bg-white/[0.03] hover:text-red-400/70 transition-colors cursor-pointer">
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
  const [previewPost, setPreviewPost] = useState<Post | null>(null);
  const [filterStatus, setFilterStatus] = useState<PostStatus | 'All'>('All');
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  const [exportingPosts, setExportingPosts] = useState<Post[]>([]);
  const [exportDefaultName, setExportDefaultName] = useState('');

  const toggleSelect = (id: string) => {
    setSelectedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const startExport = (postsToExport: Post[]) => {
    const slug = company!.name.toLowerCase().replace(/\s+/g, '-');
    const date = new Date().toISOString().slice(0, 10);
    const name = postsToExport.length > 1
      ? `${slug}-batch-${date}`
      : `${slug}-${postsToExport[0].postType.toLowerCase().replace(/\s+/g, '-')}-${date}`;
    setExportDefaultName(name);
    setExportingPosts(postsToExport);
  };

  const handleExportConfirm = async (fileName: string) => {
    const postsToExport = exportingPosts;
    setExportingPosts([]);

    if (postsToExport.length === 1) {
      const zip = await buildPostZip(postsToExport[0], fileName, mediaItems);
      await saveZipToFile(zip, `${fileName}.zip`);
    } else {
      const zip = new JSZip();
      const root = zip.folder(fileName)!;
      for (let i = 0; i < postsToExport.length; i++) {
        const post = postsToExport[i];
        const num = String(i + 1).padStart(2, '0');
        const typeSlug = post.postType.toLowerCase().replace(/\s+/g, '-');
        await buildPostZip(post, `${num}-${typeSlug}`, mediaItems, root as unknown as JSZip);
      }
      await saveZipToFile(zip, `${fileName}.zip`);
    }

    saveToPostLibrary(postsToExport, fileName);
    setSelectedPosts(new Set());
  };

  useEffect(() => {
    getAllMedia(companySlug as CompanySlug).then(setMediaItems);
  }, [companySlug]);

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
          <span className="text-[var(--color-muted)] font-sans text-xs tracking-wide">Loading posts...</span>
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
            <span className="font-sans text-xs tracking-[0.3em] text-[var(--color-muted)] uppercase">Builder</span>
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
          <motion.p className="text-[var(--color-muted)] font-body text-sm mt-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            {posts.length} post{posts.length !== 1 ? 's' : ''} in queue
          </motion.p>
        </div>
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          {selectedPosts.size > 0 && (
            <button
              onClick={() => startExport(posts.filter((p) => selectedPosts.has(p.id)))}
              className="font-sans text-xs tracking-[0.15em] uppercase px-5 py-2.5 border transition-all cursor-pointer"
              style={{ color: accent, borderColor: `${accent}50` }}
            >
              Export {selectedPosts.size} Posts
            </button>
          )}
          <button
            onClick={() => setModal('add')}
            className="font-sans text-xs tracking-[0.15em] uppercase px-5 py-2.5 border transition-all cursor-pointer"
            style={{ color: '#0a0a0a', backgroundColor: accent, borderColor: accent }}
          >
            + New Post
          </button>
        </motion.div>
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
              className="font-sans text-xs tracking-[0.1em] uppercase px-3 py-1.5 border transition-all duration-200 cursor-pointer"
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
              <p className="font-body text-sm text-[var(--color-muted)]">
                {filterStatus !== 'All' ? `No ${filterStatus.toLowerCase()} posts.` : 'No posts yet. Create one to get started.'}
              </p>
            </motion.div>
          ) : (
            filtered.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                accent={accent}
                selected={selectedPosts.has(post.id)}
                onSelect={() => toggleSelect(post.id)}
                onEdit={() => { setEditingPost(post); setModal('edit'); }}
                onPreview={() => setPreviewPost(post)}
                onExport={() => startExport([post])}
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
        {previewPost && (
          <PreviewModal
            post={previewPost}
            accent={accent}
            companyName={company.name}
            mediaItems={mediaItems}
            onClose={() => setPreviewPost(null)}
          />
        )}
        {exportingPosts.length > 0 && (
          <ExportModal
            accent={accent}
            defaultName={exportDefaultName}
            postCount={exportingPosts.length}
            onExport={handleExportConfirm}
            onClose={() => setExportingPosts([])}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
