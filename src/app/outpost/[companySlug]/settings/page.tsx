'use client';

import { use, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCompany } from '@/lib/companies';
import { useBrandSettings } from '@/hooks/useBrandSettings';
import { CompanySlug } from '@/types';

function SectionAccordion({
  title,
  subtitle,
  accent,
  defaultOpen,
  children,
  delay,
}: {
  title: string;
  subtitle?: string;
  accent: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  delay?: number;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);

  return (
    <motion.section
      className="border border-white/[0.06] overflow-hidden"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay ?? 0 }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 hover:bg-white/[0.02] transition-colors group cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <div
            className="w-1 h-8 rounded-full transition-opacity"
            style={{ backgroundColor: accent, opacity: open ? 1 : 0.3 }}
          />
          <div className="text-left">
            <h3 className="text-white/75 text-lg font-sans font-bold tracking-wide group-hover:text-white/90 transition-colors">
              {title}
            </h3>
            {subtitle && (
              <p className="text-white/25 text-sm font-sans mt-0.5 tracking-wide">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        <motion.svg
          className="w-5 h-5 text-white/25 group-hover:text-white/50 transition-colors"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </motion.svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="px-6 pb-6 pt-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

export default function BrandSettingsPage({
  params,
}: {
  params: Promise<{ companySlug: string }>;
}) {
  const { companySlug } = use(params);
  const company = getCompany(companySlug);
  const { settings, loading, updateSettings } = useBrandSettings(companySlug as CompanySlug);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    website: '',
    services: '',
    targetAudience: '',
    geoFocus: '',
    tone: '',
    hardRules: '',
    bannedPhrases: '',
    ctaStyle: '',
    exampleCaptions: '',
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm({
        name: settings.name,
        phone: settings.phone,
        website: settings.website,
        services: settings.services,
        targetAudience: settings.targetAudience,
        geoFocus: settings.geoFocus,
        tone: settings.tone,
        hardRules: settings.hardRules.join('\n'),
        bannedPhrases: settings.bannedPhrases.join('\n'),
        ctaStyle: settings.ctaStyle,
        exampleCaptions: settings.exampleCaptions.join('\n---\n'),
      });
    }
  }, [settings]);

  if (!company) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3">
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: company.colors.accent }}
          />
          <span className="text-white/35 font-mono text-sm tracking-wide">Loading settings...</span>
        </div>
      </div>
    );
  }

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    updateSettings({
      name: form.name,
      phone: form.phone,
      website: form.website,
      services: form.services,
      targetAudience: form.targetAudience,
      geoFocus: form.geoFocus,
      tone: form.tone,
      hardRules: form.hardRules.split('\n').filter((r) => r.trim()),
      bannedPhrases: form.bannedPhrases.split('\n').filter((p) => p.trim()),
      ctaStyle: form.ctaStyle,
      exampleCaptions: form.exampleCaptions
        .split('\n---\n')
        .filter((c) => c.trim()),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const inputClass =
    'w-full bg-white/[0.03] border border-white/[0.08] px-4 py-3 text-white/85 text-base font-sans tracking-wide focus:outline-none focus:border-[var(--brand-accent)] focus:bg-white/[0.04] transition-all placeholder:text-white/20';

  const textareaClass = `${inputClass} resize-vertical min-h-[110px]`;

  const labelClass = 'block text-xs font-mono tracking-[0.25em] text-white/35 uppercase mb-2.5 font-semibold';

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <motion.div
            className="flex items-center gap-3 mb-3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div
              className="h-[2px] w-8"
              style={{ backgroundColor: company.colors.accent, opacity: 0.5 }}
            />
            <span className="text-xs font-mono tracking-[0.3em] text-white/25 uppercase font-semibold">
              Configuration
            </span>
          </motion.div>
          <motion.h1
            className="font-display text-3xl font-bold tracking-wider uppercase"
            style={{ color: company.colors.accent }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            Brand Settings
          </motion.h1>
          <motion.p
            className="text-white/40 text-base font-sans mt-2 tracking-wide font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Voice profile and AI generation rules
          </motion.p>
        </div>
        <motion.button
          onClick={handleSave}
          className="px-7 py-3 text-sm font-mono tracking-[0.2em] uppercase font-bold border transition-all duration-300"
          style={{
            color: saved ? '#060606' : company.colors.accent,
            borderColor: company.colors.accent,
            backgroundColor: saved ? company.colors.accent : 'transparent',
          }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {saved ? '✓ Saved' : 'Save'}
        </motion.button>
      </div>

      {/* Form sections as accordions */}
      <div className="space-y-4">
        <SectionAccordion
          title="Identity"
          subtitle="Company name, phone, website, location"
          accent={company.colors.accent}
          defaultOpen={true}
          delay={0.1}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Company Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className={inputClass}
                placeholder="e.g. 931-510-6147"
              />
            </div>
            <div>
              <label className={labelClass}>Website</label>
              <input
                type="text"
                value={form.website}
                onChange={(e) => handleChange('website', e.target.value)}
                className={inputClass}
                placeholder="e.g. moderndevelopment.co"
              />
            </div>
            <div>
              <label className={labelClass}>Geographic Focus</label>
              <input
                type="text"
                value={form.geoFocus}
                onChange={(e) => handleChange('geoFocus', e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </SectionAccordion>

        <SectionAccordion
          title="Audience & Services"
          subtitle="Who you serve and what you offer"
          accent={company.colors.accent}
          delay={0.15}
        >
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Services</label>
              <textarea
                value={form.services}
                onChange={(e) => handleChange('services', e.target.value)}
                className={textareaClass}
                rows={3}
              />
            </div>
            <div>
              <label className={labelClass}>Target Audience</label>
              <textarea
                value={form.targetAudience}
                onChange={(e) => handleChange('targetAudience', e.target.value)}
                className={textareaClass}
                rows={3}
              />
            </div>
          </div>
        </SectionAccordion>

        <SectionAccordion
          title="Voice & Tone"
          subtitle="How the brand sounds when it speaks"
          accent={company.colors.accent}
          delay={0.2}
        >
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Tone Description</label>
              <textarea
                value={form.tone}
                onChange={(e) => handleChange('tone', e.target.value)}
                className={textareaClass}
                rows={3}
              />
            </div>
            <div>
              <label className={labelClass}>CTA Style</label>
              <textarea
                value={form.ctaStyle}
                onChange={(e) => handleChange('ctaStyle', e.target.value)}
                className={textareaClass}
                rows={2}
              />
            </div>
          </div>
        </SectionAccordion>

        <SectionAccordion
          title="AI Rules"
          subtitle="Hard rules and banned phrases for the generator"
          accent={company.colors.accent}
          delay={0.25}
        >
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Hard Rules (one per line)</label>
              <textarea
                value={form.hardRules}
                onChange={(e) => handleChange('hardRules', e.target.value)}
                className={textareaClass}
                rows={8}
                placeholder="Each line becomes a rule the AI must follow"
              />
              <p className="text-white/20 text-xs font-mono mt-2 tracking-wide">
                {form.hardRules.split('\n').filter((r) => r.trim()).length} rules configured
              </p>
            </div>
            <div>
              <label className={labelClass}>Banned Phrases (one per line)</label>
              <textarea
                value={form.bannedPhrases}
                onChange={(e) => handleChange('bannedPhrases', e.target.value)}
                className={textareaClass}
                rows={5}
                placeholder="Each line becomes a phrase the AI must never use"
              />
              <p className="text-white/20 text-xs font-mono mt-2 tracking-wide">
                {form.bannedPhrases.split('\n').filter((p) => p.trim()).length} phrases banned
              </p>
            </div>
          </div>
        </SectionAccordion>

        <SectionAccordion
          title="Example Captions"
          subtitle="Style references the AI studies before generating"
          accent={company.colors.accent}
          delay={0.3}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className={labelClass}>Approved Captions</label>
              <span className="text-xs font-mono tracking-[0.1em] text-white/25">
                {form.exampleCaptions.split('\n---\n').filter((c) => c.trim()).length} examples loaded
              </span>
            </div>
            <textarea
              value={form.exampleCaptions}
              onChange={(e) => handleChange('exampleCaptions', e.target.value)}
              className={`${inputClass} resize-vertical min-h-[250px] font-sans leading-relaxed text-sm`}
              rows={14}
              placeholder={"First example caption here...\n---\nSecond example caption here...\n---\nThird example caption here..."}
            />
            <p className="text-white/20 text-xs font-sans mt-2 tracking-wide">
              Separate each caption with a line containing only <span className="font-mono text-white/30">---</span>
            </p>
          </div>
        </SectionAccordion>
      </div>

      {/* Bottom save */}
      <motion.div
        className="mt-8 flex justify-end"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          onClick={handleSave}
          className="px-10 py-3.5 text-base font-mono tracking-[0.2em] uppercase font-bold border transition-all duration-300"
          style={{
            color: saved ? '#060606' : company.colors.accent,
            borderColor: company.colors.accent,
            backgroundColor: saved ? company.colors.accent : 'transparent',
          }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {saved ? '✓ Changes Saved' : 'Save Changes'}
        </motion.button>
      </motion.div>
    </div>
  );
}
