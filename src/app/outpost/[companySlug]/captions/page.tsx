'use client';

import { use, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCompany } from '@/lib/companies';
import { useCaptions } from '@/hooks/useCaptions';
import { CompanySlug, PostType, Caption } from '@/types';

const POST_TYPES: PostType[] = [
  'Lead Gen',
  'Brand Awareness',
  'Recruitment',
  'Project Spotlight',
  'Before & After',
  'Educational',
  'Team/BTS',
  'Client Story',
];

// ─── Caption Card ───────────────────────────────────────────
function CaptionCard({
  caption,
  accent,
  onEdit,
  onCopy,
  onArchive,
  onDelete,
}: {
  caption: Caption;
  accent: string;
  onEdit: () => void;
  onCopy: () => void;
  onArchive: () => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const isLong = caption.text.length > 220;
  const displayText = expanded || !isLong ? caption.text : caption.text.slice(0, 220) + '...';

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.div
      className={`border border-[var(--color-border)] hover:border-white/[0.1] transition-all duration-300 ${caption.archived ? 'opacity-40' : ''}`}
      layout
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-3">
          <span
            className="font-mono text-[9px] tracking-[0.12em] uppercase px-2.5 py-1 border transition-colors"
            style={{ color: accent, borderColor: `${accent}40` }}
          >
            {caption.postType}
          </span>
          {caption.tags.map((tag) => (
            <span key={tag} className="font-mono text-[9px] tracking-[0.08em] text-[var(--color-muted)] uppercase">
              #{tag}
            </span>
          ))}
        </div>
        <span className="font-mono text-[9px] tracking-[0.1em] text-white/15">
          {new Date(caption.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>

      {/* Caption text */}
      <div className="px-5 py-4">
        <p className="font-serif text-sm leading-[1.8] text-white/70 whitespace-pre-line">
          {displayText}
        </p>
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="font-mono text-[9px] tracking-[0.15em] uppercase mt-2 transition-colors cursor-pointer"
            style={{ color: accent }}
          >
            {expanded ? 'Collapse' : 'Read more'}
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 px-5 py-3 border-t border-[var(--color-border)]">
        <button
          onClick={handleCopy}
          className="font-mono text-[9px] tracking-[0.12em] uppercase px-3 py-1.5 hover:bg-white/[0.03] transition-colors cursor-pointer"
          style={{ color: copied ? accent : 'var(--color-muted)' }}
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
        <div className="w-px h-3 bg-[var(--color-border)]" />
        <button
          onClick={onEdit}
          className="font-mono text-[9px] tracking-[0.12em] uppercase text-[var(--color-muted)] px-3 py-1.5 hover:bg-white/[0.03] hover:text-white/60 transition-colors cursor-pointer"
        >
          Edit
        </button>
        <div className="w-px h-3 bg-[var(--color-border)]" />
        <button
          onClick={onArchive}
          className="font-mono text-[9px] tracking-[0.12em] uppercase text-[var(--color-muted)] px-3 py-1.5 hover:bg-white/[0.03] hover:text-white/60 transition-colors cursor-pointer"
        >
          {caption.archived ? 'Restore' : 'Archive'}
        </button>
        <div className="w-px h-3 bg-[var(--color-border)]" />
        <button
          onClick={onDelete}
          className="font-mono text-[9px] tracking-[0.12em] uppercase text-[var(--color-muted)] px-3 py-1.5 hover:bg-white/[0.03] hover:text-red-400/70 transition-colors cursor-pointer"
        >
          Delete
        </button>
      </div>
    </motion.div>
  );
}

// ─── Add/Edit Modal ─────────────────────────────────────────
function CaptionModal({
  accent,
  initial,
  onSave,
  onClose,
}: {
  accent: string;
  initial?: Caption;
  onSave: (text: string, postType: PostType, tags: string[]) => void;
  onClose: () => void;
}) {
  const [text, setText] = useState(initial?.text ?? '');
  const [postType, setPostType] = useState<PostType>(initial?.postType ?? 'Lead Gen');
  const [tagInput, setTagInput] = useState(initial?.tags.join(', ') ?? '');

  const handleSubmit = () => {
    if (!text.trim()) return;
    const tags = tagInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
    onSave(text, postType, tags);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
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
              {initial ? 'Edit Caption' : 'New Caption'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="font-mono text-[10px] tracking-[0.1em] text-[var(--color-muted)] hover:text-white/60 transition-colors cursor-pointer uppercase"
          >
            Close
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Post Type */}
          <div>
            <label className="block font-mono text-[10px] tracking-[0.25em] text-[var(--color-muted)] uppercase mb-2.5">
              Post Type
            </label>
            <div className="flex flex-wrap gap-2">
              {POST_TYPES.map((pt) => (
                <button
                  key={pt}
                  onClick={() => setPostType(pt)}
                  className="font-mono text-[9px] tracking-[0.1em] uppercase px-3 py-1.5 border transition-all duration-200 cursor-pointer"
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

          {/* Caption text */}
          <div>
            <label className="block font-mono text-[10px] tracking-[0.25em] text-[var(--color-muted)] uppercase mb-2.5">
              Caption Text
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full bg-white/[0.02] border border-[var(--color-border)] px-4 py-3 text-white/85 font-serif text-sm leading-[1.8] focus:outline-none focus:border-[var(--brand-accent)] transition-all resize-vertical min-h-[200px] placeholder:text-white/15"
              rows={10}
              placeholder="Write your caption here..."
              autoFocus
            />
            <p className="font-mono text-[9px] tracking-wide text-white/15 mt-1.5">
              {text.length} characters
            </p>
          </div>

          {/* Tags */}
          <div>
            <label className="block font-mono text-[10px] tracking-[0.25em] text-[var(--color-muted)] uppercase mb-2.5">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="w-full bg-white/[0.02] border border-[var(--color-border)] px-4 py-3 text-white/85 font-mono text-sm tracking-wide focus:outline-none focus:border-[var(--brand-accent)] transition-all placeholder:text-white/15"
              placeholder="e.g. barndo, spring-campaign-2026"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--color-border)]">
          <button
            onClick={onClose}
            className="font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--color-muted)] px-5 py-2.5 border border-[var(--color-border)] hover:bg-white/[0.02] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="font-mono text-[10px] tracking-[0.15em] uppercase px-5 py-2.5 border transition-all cursor-pointer"
            style={{
              color: text.trim() ? '#0a0a0a' : 'var(--color-muted)',
              backgroundColor: text.trim() ? accent : 'transparent',
              borderColor: text.trim() ? accent : 'var(--color-border)',
            }}
          >
            {initial ? 'Save Changes' : 'Add Caption'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── AI Generate Modal (Mocked) ─────────────────────────────
function AIGenerateModal({
  accent,
  companyName,
  onSave,
  onClose,
}: {
  accent: string;
  companyName: string;
  onSave: (text: string, postType: PostType) => void;
  onClose: () => void;
}) {
  const [prompt, setPrompt] = useState('');
  const [postType, setPostType] = useState<PostType>('Lead Gen');
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const mockGenerate = () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    // Simulate API delay
    setTimeout(() => {
      setResults([
        `There is a certain confidence that comes from knowing the team behind your project has done this before and done it well. At ${companyName}, every build starts with a conversation and ends with a home that reflects exactly what our clients envisioned from day one.\n\nIf you have been thinking about building, renovating, or adding on this spring, now is the time to start that conversation. We are ready to put our process to work for you.\n\n931-510-6147 | moderndevelopment.co`,
        `Spring construction season is here and we are walking into it prepared. All offseason we sharpened our process, strengthened our crew, and set the foundation for a year of builds we are genuinely excited about.\n\nIf your project has been on the back burner, let's change that. The families who plan early are always the ones who enjoy the process most.\n\n931-510-6147 | moderndevelopment.co`,
        `The Upper Cumberland is full of families who want to build something meaningful on their land and we have spent years becoming the team they trust to do it right. Every project we take on gets the same attention, the same process, and the same commitment to quality regardless of size.\n\nReach out and let's talk about what we can build together this season.\n\n931-510-6147 | moderndevelopment.co`,
      ]);
      setGenerating(false);
    }, 2000);
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
              AI Generate
            </h3>
            <span className="font-mono text-[9px] tracking-[0.1em] text-[var(--color-muted)] uppercase px-2 py-0.5 border border-[var(--color-border)]">
              Mocked
            </span>
          </div>
          <button
            onClick={onClose}
            className="font-mono text-[10px] tracking-[0.1em] text-[var(--color-muted)] hover:text-white/60 transition-colors cursor-pointer uppercase"
          >
            Close
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Post Type selector */}
          <div>
            <label className="block font-mono text-[10px] tracking-[0.25em] text-[var(--color-muted)] uppercase mb-2.5">
              Post Type
            </label>
            <div className="flex flex-wrap gap-2">
              {POST_TYPES.map((pt) => (
                <button
                  key={pt}
                  onClick={() => setPostType(pt)}
                  className="font-mono text-[9px] tracking-[0.1em] uppercase px-3 py-1.5 border transition-all duration-200 cursor-pointer"
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

          {/* Prompt */}
          <div>
            <label className="block font-mono text-[10px] tracking-[0.25em] text-[var(--color-muted)] uppercase mb-2.5">
              Describe the post
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-white/[0.02] border border-[var(--color-border)] px-4 py-3 text-white/85 font-serif text-sm leading-[1.8] focus:outline-none focus:border-[var(--brand-accent)] transition-all resize-vertical min-h-[100px] placeholder:text-white/15"
              rows={4}
              placeholder="e.g. Spring lead gen post about custom homes, warm and inviting tone..."
              autoFocus
            />
          </div>

          {/* Generate button */}
          <button
            onClick={mockGenerate}
            disabled={generating || !prompt.trim()}
            className="font-mono text-[10px] tracking-[0.15em] uppercase px-6 py-2.5 border transition-all cursor-pointer disabled:opacity-30"
            style={{
              color: '#0a0a0a',
              backgroundColor: accent,
              borderColor: accent,
            }}
          >
            {generating ? 'Generating...' : 'Generate 3 Options'}
          </button>

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-[var(--color-border)]" />
                <span className="font-mono text-[9px] tracking-[0.2em] text-[var(--color-muted)] uppercase">
                  3 Options Generated
                </span>
                <div className="h-px flex-1 bg-[var(--color-border)]" />
              </div>

              {results.map((result, i) => (
                <div key={i} className="border border-[var(--color-border)] hover:border-white/[0.1] transition-colors">
                  <div className="px-5 py-3 border-b border-[var(--color-border)] flex items-center justify-between">
                    <span className="font-mono text-[9px] tracking-[0.12em] text-[var(--color-muted)] uppercase">
                      Option {i + 1}
                    </span>
                    <button
                      onClick={() => onSave(result, postType)}
                      className="font-mono text-[9px] tracking-[0.12em] uppercase px-3 py-1 border transition-all cursor-pointer"
                      style={{ color: accent, borderColor: `${accent}50` }}
                    >
                      Save to Library
                    </button>
                  </div>
                  <div className="px-5 py-4">
                    <p className="font-serif text-sm leading-[1.8] text-white/70 whitespace-pre-line">
                      {result}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Delete Confirm ─────────────────────────────────────────
function DeleteConfirm({
  accent,
  onConfirm,
  onCancel,
}: {
  accent: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <motion.div
        className="relative bg-[#0c0c0c] border border-[var(--color-border)] p-6 max-w-sm mx-4"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
      >
        <h3 className="font-sans text-base font-medium tracking-[0.08em] uppercase mb-2">
          Delete Caption
        </h3>
        <p className="font-serif text-sm italic text-[var(--color-muted)] mb-6">
          This action cannot be undone.
        </p>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--color-muted)] px-5 py-2.5 border border-[var(--color-border)] hover:bg-white/[0.02] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="font-mono text-[10px] tracking-[0.15em] uppercase px-5 py-2.5 bg-red-500/80 text-white border border-red-500/80 hover:bg-red-500 transition-colors cursor-pointer"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ──────────────────────────────────────────────
export default function CaptionsPage({
  params,
}: {
  params: Promise<{ companySlug: string }>;
}) {
  const { companySlug } = use(params);
  const company = getCompany(companySlug);
  const { captions, loading, addCaption, updateCaption, deleteCaption, toggleArchive } = useCaptions(
    companySlug as CompanySlug
  );

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<PostType | 'All'>('All');
  const [showArchived, setShowArchived] = useState(false);
  const [modal, setModal] = useState<'add' | 'edit' | 'ai' | null>(null);
  const [editingCaption, setEditingCaption] = useState<Caption | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return captions.filter((c) => {
      if (!showArchived && c.archived) return false;
      if (showArchived && !c.archived) return false;
      if (filterType !== 'All' && c.postType !== filterType) return false;
      if (search && !c.text.toLowerCase().includes(search.toLowerCase()) && !c.tags.some((t) => t.includes(search.toLowerCase()))) return false;
      return true;
    });
  }, [captions, search, filterType, showArchived]);

  if (!company) return null;
  const accent = company.colors.accent;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleEdit = (caption: Caption) => {
    setEditingCaption(caption);
    setModal('edit');
  };

  const handleSaveNew = (text: string, postType: PostType, tags: string[]) => {
    addCaption(text, postType, tags);
    setModal(null);
  };

  const handleSaveEdit = (text: string, postType: PostType, tags: string[]) => {
    if (!editingCaption) return;
    updateCaption(editingCaption.id, { text, postType, tags });
    setEditingCaption(null);
    setModal(null);
  };

  const handleAISave = (text: string, postType: PostType) => {
    addCaption(text, postType, ['ai-generated']);
    setModal(null);
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      deleteCaption(deletingId);
      setDeletingId(null);
    }
  };

  // Count active post types for filter badges
  const typeCounts = useMemo(() => {
    const active = captions.filter((c) => !c.archived);
    const counts: Record<string, number> = { All: active.length };
    for (const c of active) {
      counts[c.postType] = (counts[c.postType] || 0) + 1;
    }
    return counts;
  }, [captions]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: accent }} />
          <span className="text-[var(--color-muted)] font-mono text-xs tracking-wide">Loading captions...</span>
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
            <span className="font-mono text-[10px] tracking-[0.3em] text-[var(--color-muted)] uppercase">
              Library
            </span>
          </motion.div>
          <motion.h1
            className="font-sans text-3xl font-semibold tracking-[0.08em] uppercase"
            style={{ color: accent }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            Captions
          </motion.h1>
          <motion.p
            className="text-[var(--color-muted)] font-serif text-sm italic mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {captions.filter((c) => !c.archived).length} active captions
          </motion.p>
        </div>
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <button
            onClick={() => setModal('ai')}
            className="font-mono text-[10px] tracking-[0.15em] uppercase px-5 py-2.5 border border-[var(--color-border)] text-[var(--color-muted)] hover:border-white/[0.12] hover:text-white/60 transition-all cursor-pointer"
          >
            AI Generate
          </button>
          <button
            onClick={() => setModal('add')}
            className="font-mono text-[10px] tracking-[0.15em] uppercase px-5 py-2.5 border transition-all cursor-pointer"
            style={{ color: '#0a0a0a', backgroundColor: accent, borderColor: accent }}
          >
            + New Caption
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
        {/* Search bar */}
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/[0.02] border border-[var(--color-border)] pl-10 pr-4 py-2.5 text-white/85 font-mono text-xs tracking-wide focus:outline-none focus:border-white/[0.12] transition-all placeholder:text-white/15"
            placeholder="Search captions or tags..."
          />
        </div>

        {/* Type filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {['All', ...POST_TYPES].map((type) => {
            const count = typeCounts[type] || 0;
            if (type !== 'All' && count === 0) return null;
            const active = filterType === type || (type === 'All' && filterType === 'All');
            return (
              <button
                key={type}
                onClick={() => setFilterType(type as PostType | 'All')}
                className="font-mono text-[9px] tracking-[0.1em] uppercase px-3 py-1.5 border transition-all duration-200 cursor-pointer"
                style={{
                  color: active ? '#0a0a0a' : 'var(--color-muted)',
                  backgroundColor: active ? accent : 'transparent',
                  borderColor: active ? accent : 'var(--color-border)',
                }}
              >
                {type} {count > 0 && `(${count})`}
              </button>
            );
          })}

          {/* Archived toggle */}
          <div className="ml-auto">
            <button
              onClick={() => setShowArchived(!showArchived)}
              className="font-mono text-[9px] tracking-[0.1em] uppercase px-3 py-1.5 border border-[var(--color-border)] transition-all cursor-pointer"
              style={{
                color: showArchived ? accent : 'var(--color-muted)',
                borderColor: showArchived ? `${accent}50` : 'var(--color-border)',
              }}
            >
              {showArchived ? `Archived (${captions.filter((c) => c.archived).length})` : 'Show Archived'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Caption list */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              className="py-16 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="font-serif text-sm italic text-[var(--color-muted)]">
                {showArchived ? 'No archived captions.' : search || filterType !== 'All' ? 'No captions match your filters.' : 'No captions yet. Add one or generate with AI.'}
              </p>
            </motion.div>
          ) : (
            filtered.map((caption) => (
              <CaptionCard
                key={caption.id}
                caption={caption}
                accent={accent}
                onEdit={() => handleEdit(caption)}
                onCopy={() => handleCopy(caption.text)}
                onArchive={() => toggleArchive(caption.id)}
                onDelete={() => setDeletingId(caption.id)}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {modal === 'add' && (
          <CaptionModal
            accent={accent}
            onSave={handleSaveNew}
            onClose={() => setModal(null)}
          />
        )}
        {modal === 'edit' && editingCaption && (
          <CaptionModal
            accent={accent}
            initial={editingCaption}
            onSave={handleSaveEdit}
            onClose={() => { setEditingCaption(null); setModal(null); }}
          />
        )}
        {modal === 'ai' && (
          <AIGenerateModal
            accent={accent}
            companyName={company.name}
            onSave={handleAISave}
            onClose={() => setModal(null)}
          />
        )}
        {deletingId && (
          <DeleteConfirm
            accent={accent}
            onConfirm={handleConfirmDelete}
            onCancel={() => setDeletingId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
