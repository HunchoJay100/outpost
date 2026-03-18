'use client';

import { use, useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCompany } from '@/lib/companies';
import { getAllMedia, addMedia, deleteMedia, deleteMultipleMedia, getMediaBlobURL } from '@/lib/media-db';
import { CompanySlug, MediaItem } from '@/types';

// ─── Upload Modal ───────────────────────────────────────────
function UploadModal({
  accent,
  companySlug,
  onUploaded,
  onClose,
}: {
  accent: string;
  companySlug: CompanySlug;
  onUploaded: () => void;
  onClose: () => void;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [projectName, setProjectName] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files).filter(
      (f) => f.type.startsWith('image/') || f.type.startsWith('video/')
    );
    setFiles((prev) => [...prev, ...dropped]);
  }, []);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files).filter(
      (f) => f.type.startsWith('image/') || f.type.startsWith('video/')
    );
    setFiles((prev) => [...prev, ...selected]);
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    const tags = tagInput.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);

    for (let i = 0; i < files.length; i++) {
      await addMedia(files[i], companySlug, projectName, tags);
      setProgress(Math.round(((i + 1) / files.length) * 100));
    }

    setUploading(false);
    onUploaded();
    onClose();
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
        className="relative w-full max-w-2xl mx-4 bg-[#0c0c0c] border border-[var(--color-border)] max-h-[85vh] flex flex-col"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <div className="w-[3px] h-5" style={{ backgroundColor: accent }} />
            <h3 className="font-sans text-base font-medium tracking-[0.1em] uppercase">
              Upload Media
            </h3>
          </div>
          <button
            onClick={onClose}
            className="font-sans text-xs tracking-[0.1em] text-[var(--color-muted)] hover:text-white/60 transition-colors cursor-pointer uppercase"
          >
            Close
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Drop zone */}
          <div
            className="border-2 border-dashed border-[var(--color-border)] hover:border-white/[0.12] transition-colors py-10 text-center cursor-pointer"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              className="hidden"
              onChange={handleSelect}
            />
            <svg className="w-8 h-8 mx-auto mb-3 text-[var(--color-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <p className="font-sans text-xs tracking-[0.15em] text-[var(--color-muted)] uppercase">
              Drop files here or click to browse
            </p>
            <p className="font-body text-xs text-white/15 mt-1">Images and videos only</p>
          </div>

          {/* File list */}
          {files.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs tracking-[0.2em] text-[var(--color-muted)] uppercase">
                  {files.length} file{files.length !== 1 ? 's' : ''} selected
                </span>
                <button
                  onClick={() => setFiles([])}
                  className="font-sans text-xs tracking-[0.1em] text-[var(--color-muted)] hover:text-white/60 uppercase cursor-pointer"
                >
                  Clear all
                </button>
              </div>
              {files.map((file, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-2.5 border border-[var(--color-border)] bg-white/[0.01]">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-sans text-xs uppercase px-2 py-0.5 border border-[var(--color-border)]" style={{ color: accent }}>
                      {file.type.startsWith('video/') ? 'VID' : 'IMG'}
                    </span>
                    <span className="font-sans text-xs text-white/60 truncate">{file.name}</span>
                    <span className="font-sans text-xs text-white/20 flex-shrink-0">{formatSize(file.size)}</span>
                  </div>
                  <button
                    onClick={() => removeFile(i)}
                    className="font-sans text-xs text-[var(--color-muted)] hover:text-red-400/70 cursor-pointer ml-3"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Project name */}
          <div>
            <label className="block font-sans text-xs tracking-[0.25em] text-[var(--color-muted)] uppercase mb-2.5">
              Project Name
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full bg-white/[0.02] border border-[var(--color-border)] px-4 py-3 text-white/85 font-sans text-sm tracking-wide focus:outline-none focus:border-white/[0.12] transition-all placeholder:text-white/15"
              placeholder="e.g. Brycen Residence, Spring Campaign"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block font-sans text-xs tracking-[0.25em] text-[var(--color-muted)] uppercase mb-2.5">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="w-full bg-white/[0.02] border border-[var(--color-border)] px-4 py-3 text-white/85 font-sans text-sm tracking-wide focus:outline-none focus:border-white/[0.12] transition-all placeholder:text-white/15"
              placeholder="e.g. exterior, progress-shot, drone"
            />
          </div>

          {/* Upload progress */}
          {uploading && (
            <div>
              <div className="h-1 bg-[var(--color-border)] overflow-hidden">
                <motion.div
                  className="h-full"
                  style={{ backgroundColor: accent }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="font-sans text-xs tracking-wide text-[var(--color-muted)] mt-2">
                Uploading... {progress}%
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--color-border)]">
          <button
            onClick={onClose}
            className="font-sans text-xs tracking-[0.15em] uppercase text-[var(--color-muted)] px-5 py-2.5 border border-[var(--color-border)] hover:bg-white/[0.02] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={files.length === 0 || uploading}
            className="font-sans text-xs tracking-[0.15em] uppercase px-5 py-2.5 border transition-all cursor-pointer disabled:opacity-30"
            style={{
              color: '#0a0a0a',
              backgroundColor: accent,
              borderColor: accent,
            }}
          >
            {uploading ? 'Uploading...' : `Upload ${files.length} File${files.length !== 1 ? 's' : ''}`}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Media Thumbnail ────────────────────────────────────────
function MediaThumb({
  item,
  accent,
  selected,
  onToggle,
  onClick,
}: {
  item: MediaItem;
  accent: string;
  selected: boolean;
  onToggle: () => void;
  onClick: () => void;
}) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let revoke: string | null = null;
    getMediaBlobURL(item.id, item.mimeType).then((u) => {
      if (u) {
        setUrl(u);
        revoke = u;
      }
    });
    return () => {
      if (revoke) URL.revokeObjectURL(revoke);
    };
  }, [item.id, item.mimeType]);

  return (
    <motion.div
      className={`relative group cursor-pointer border transition-all duration-200 ${
        selected ? 'border-white/30' : 'border-[var(--color-border)] hover:border-white/[0.1]'
      }`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      layout
    >
      {/* Select checkbox */}
      <button
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        className="absolute top-2 left-2 z-10 w-5 h-5 border flex items-center justify-center transition-all cursor-pointer"
        style={{
          borderColor: selected ? accent : 'rgba(255,255,255,0.15)',
          backgroundColor: selected ? accent : 'rgba(0,0,0,0.5)',
        }}
      >
        {selected && <span className="text-xs text-black font-bold">✓</span>}
      </button>

      {/* Type badge */}
      <div className="absolute top-2 right-2 z-10">
        <span
          className="font-sans text-xs uppercase px-1.5 py-0.5 bg-black/60 backdrop-blur-sm"
          style={{ color: accent }}
        >
          {item.fileType === 'video' ? 'VID' : 'IMG'}
        </span>
      </div>

      {/* Thumbnail */}
      <div className="aspect-square bg-[var(--color-subtle)] overflow-hidden" onClick={onClick}>
        {url && item.fileType === 'image' && (
          <img src={url} alt={item.fileName} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
        )}
        {url && item.fileType === 'video' && (
          <video src={url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" muted />
        )}
        {!url && (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-sans text-xs text-white/15">Loading...</span>
          </div>
        )}
      </div>

      {/* Info bar */}
      <div className="px-3 py-2.5 border-t border-[var(--color-border)]">
        <p className="font-sans text-xs text-white/50 truncate">{item.fileName}</p>
        {item.projectName && (
          <p className="font-body text-xs text-white/25 mt-0.5 truncate">{item.projectName}</p>
        )}
      </div>
    </motion.div>
  );
}

// ─── Preview Modal ──────────────────────────────────────────
function PreviewModal({
  item,
  accent,
  onDelete,
  onClose,
}: {
  item: MediaItem;
  accent: string;
  onDelete: () => void;
  onClose: () => void;
}) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let revoke: string | null = null;
    getMediaBlobURL(item.id, item.mimeType).then((u) => {
      if (u) {
        setUrl(u);
        revoke = u;
      }
    });
    return () => {
      if (revoke) URL.revokeObjectURL(revoke);
    };
  }, [item.id, item.mimeType]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        className="relative max-w-4xl w-full mx-4 bg-[#0c0c0c] border border-[var(--color-border)] max-h-[90vh] flex flex-col"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <span className="font-sans text-xs uppercase px-2 py-0.5 border" style={{ color: accent, borderColor: `${accent}40` }}>
              {item.fileType}
            </span>
            <span className="font-sans text-xs text-white/60">{item.fileName}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onDelete}
              className="font-sans text-xs tracking-[0.1em] uppercase text-[var(--color-muted)] hover:text-red-400/70 transition-colors cursor-pointer"
            >
              Delete
            </button>
            <button
              onClick={onClose}
              className="font-sans text-xs tracking-[0.1em] text-[var(--color-muted)] hover:text-white/60 transition-colors cursor-pointer uppercase"
            >
              Close
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-black/30">
          {url && item.fileType === 'image' && (
            <img src={url} alt={item.fileName} className="max-w-full max-h-[65vh] object-contain" />
          )}
          {url && item.fileType === 'video' && (
            <video src={url} controls className="max-w-full max-h-[65vh]" />
          )}
        </div>

        {/* Meta */}
        <div className="px-6 py-3 border-t border-[var(--color-border)] flex items-center gap-6">
          {item.projectName && (
            <div>
              <span className="font-sans text-xs tracking-[0.15em] text-white/20 uppercase">Project</span>
              <p className="font-sans text-xs text-white/50">{item.projectName}</p>
            </div>
          )}
          {item.tags.length > 0 && (
            <div>
              <span className="font-sans text-xs tracking-[0.15em] text-white/20 uppercase">Tags</span>
              <div className="flex gap-2 mt-0.5">
                {item.tags.map((t) => (
                  <span key={t} className="font-sans text-xs text-[var(--color-muted)]">#{t}</span>
                ))}
              </div>
            </div>
          )}
          <div>
            <span className="font-sans text-xs tracking-[0.15em] text-white/20 uppercase">Added</span>
            <p className="font-sans text-xs text-white/50">
              {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ──────────────────────────────────────────────
export default function MediaVaultPage({
  params,
}: {
  params: Promise<{ companySlug: string }>;
}) {
  const { companySlug } = use(params);
  const company = getCompany(companySlug);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [preview, setPreview] = useState<MediaItem | null>(null);
  const [search, setSearch] = useState('');
  const [filterProject, setFilterProject] = useState<string>('All');

  const reload = useCallback(async () => {
    const media = await getAllMedia(companySlug as CompanySlug);
    setItems(media.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    setLoading(false);
  }, [companySlug]);

  useEffect(() => {
    reload();
  }, [reload]);

  if (!company) return null;
  const accent = company.colors.accent;

  const projects = Array.from(new Set(items.map((i) => i.projectName).filter(Boolean)));

  const filtered = items.filter((item) => {
    if (filterProject !== 'All' && item.projectName !== filterProject) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !item.fileName.toLowerCase().includes(q) &&
        !item.projectName.toLowerCase().includes(q) &&
        !item.tags.some((t) => t.includes(q))
      )
        return false;
    }
    return true;
  });

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDeleteSelected = async () => {
    await deleteMultipleMedia(Array.from(selected));
    setSelected(new Set());
    reload();
  };

  const handleDeleteSingle = async (id: string) => {
    await deleteMedia(id);
    setPreview(null);
    reload();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: accent }} />
          <span className="text-[var(--color-muted)] font-sans text-xs tracking-wide">Loading media...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <motion.div
            className="flex items-center gap-3 mb-3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="h-px w-8" style={{ backgroundColor: accent, opacity: 0.5 }} />
            <span className="font-sans text-xs tracking-[0.3em] text-[var(--color-muted)] uppercase">
              Vault
            </span>
          </motion.div>
          <motion.h1
            className="font-sans text-3xl font-semibold tracking-[0.08em] uppercase"
            style={{ color: accent }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            Media
          </motion.h1>
          <motion.p
            className="text-[var(--color-muted)] font-body text-sm mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {items.length} asset{items.length !== 1 ? 's' : ''}
          </motion.p>
        </div>
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          {selected.size > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="font-sans text-xs tracking-[0.15em] uppercase px-5 py-2.5 border border-red-500/40 text-red-400/80 hover:bg-red-500/10 transition-all cursor-pointer"
            >
              Delete {selected.size}
            </button>
          )}
          <button
            onClick={() => setShowUpload(true)}
            className="font-sans text-xs tracking-[0.15em] uppercase px-5 py-2.5 border transition-all cursor-pointer"
            style={{ color: '#0a0a0a', backgroundColor: accent, borderColor: accent }}
          >
            + Upload
          </button>
        </motion.div>
      </div>

      {/* Search + Filters */}
      <motion.div
        className="mb-6 space-y-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/[0.02] border border-[var(--color-border)] pl-10 pr-4 py-2.5 text-white/85 font-sans text-xs tracking-wide focus:outline-none focus:border-white/[0.12] transition-all placeholder:text-white/15"
            placeholder="Search files, projects, or tags..."
          />
        </div>

        {projects.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {['All', ...projects].map((project) => {
              const active = filterProject === project;
              return (
                <button
                  key={project}
                  onClick={() => setFilterProject(project)}
                  className="font-sans text-xs tracking-[0.1em] uppercase px-3 py-1.5 border transition-all duration-200 cursor-pointer"
                  style={{
                    color: active ? '#0a0a0a' : 'var(--color-muted)',
                    backgroundColor: active ? accent : 'transparent',
                    borderColor: active ? accent : 'var(--color-border)',
                  }}
                >
                  {project}
                </button>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <motion.div
          className="py-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <svg className="w-10 h-10 mx-auto mb-4 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
          </svg>
          <p className="font-body text-sm text-[var(--color-muted)]">
            {search || filterProject !== 'All'
              ? 'No media matches your filters.'
              : 'No media uploaded yet. Click Upload to add photos and videos.'}
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <MediaThumb
                key={item.id}
                item={item}
                accent={accent}
                selected={selected.has(item.id)}
                onToggle={() => toggleSelect(item.id)}
                onClick={() => setPreview(item)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showUpload && (
          <UploadModal
            accent={accent}
            companySlug={companySlug as CompanySlug}
            onUploaded={reload}
            onClose={() => setShowUpload(false)}
          />
        )}
        {preview && (
          <PreviewModal
            item={preview}
            accent={accent}
            onDelete={() => handleDeleteSingle(preview.id)}
            onClose={() => setPreview(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
