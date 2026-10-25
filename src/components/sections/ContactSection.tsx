import React, { useState } from 'react';
import { soundManager } from '../../utils/audio';
import confetti from 'canvas-confetti';
import {
  Send,
  Mail,
  Copy,
  Check,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Sparkles,
  Rocket,
  Globe,
} from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';

interface ContactSectionProps {
  data?: any;
}

export const ContactSection: React.FC<ContactSectionProps> = () => {
  const { content } = useSiteContent();
  const { profile, contact } = content;

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    service: '3D Interactive Website',
    message: '',
  });

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contact.email || profile.name);
    setCopiedEmail(true);
    soundManager.playClick();
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedSuccess(true);
      soundManager.playChime();

      // Cosmic celebratory confetti with strict palette colors
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.65 },
        colors: [content.theme.primary, content.theme.secondary, content.theme.accent, content.theme.text],
      });

      setFormState({
        name: '',
        email: '',
        service: '3D Interactive Website',
        message: '',
      });

      setTimeout(() => {
        setSubmittedSuccess(false);
      }, 5000);
    }, 700);
  };

  const scrollToTop = () => {
    soundManager.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getSocialIcon = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes('git')) return Github;
    if (l.includes('link')) return Linkedin;
    if (l.includes('twit') || l.includes('x')) return Twitter;
    if (l.includes('insta')) return Instagram;
    return Globe;
  };

  return (
    <section id="contact" className="relative pt-24 pb-16 px-6 sm:px-8 max-w-7xl mx-auto scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-16 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[var(--secondary)]">
            {contact.badge || '05. Initiate Transmission'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[var(--text)] mt-2">
            {contact.heading}
          </h2>
        </div>
        <p className="text-xs text-[var(--muted)] font-mono sm:text-right">
          {contact.subheading || 'TYPICAL RESPONSE TIME < 24 HOURS'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Direct Inquiries & Social Ecosystem */}
        <div className="lg:col-span-5 space-y-8">
          <div className="p-8 rounded-3xl bg-[var(--card)] backdrop-blur-xl border border-white/10 space-y-6 shadow-2xl">
            <h3 className="text-xl font-bold font-heading text-[var(--text)]">
              Direct Communication
            </h3>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              {contact.description ||
                'Have a bold product vision, upcoming WebGL exhibition, or brand re-architecture? Reach out directly or dispatch a transmission via the cyber console.'}
            </p>

            {/* Copyable Email Box */}
            <div className="p-4 rounded-2xl bg-black/20 border border-white/5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 overflow-hidden">
                <Mail className="w-5 h-5 text-[var(--secondary)] shrink-0" />
                <span className="text-sm font-mono text-[var(--text)] truncate">{contact.email}</span>
              </div>
              <button
                onClick={handleCopyEmail}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--muted)] hover:text-[var(--text)] transition-colors shrink-0 cursor-pointer"
                title="Copy email to clipboard"
              >
                {copiedEmail ? (
                  <Check className="w-4 h-4 text-[var(--secondary)]" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Social Grid */}
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--muted)] block mb-3">
                Digital Presence & Networks
              </span>
              <div className="flex flex-wrap items-center gap-3">
                {contact.socials.map((s) => {
                  const Icon = getSocialIcon(s.label);
                  return (
                    <a
                      key={s.label}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => soundManager.playHover()}
                      className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--card)] hover:bg-[var(--primary)]/20 border border-white/10 hover:border-[var(--primary)]/40 text-xs text-[var(--muted)] hover:text-[var(--secondary)] transition-all hover:scale-105 active:scale-95"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{s.label}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Cyber-Glass Transmission Form */}
        <div className="lg:col-span-7">
          <div className="p-8 sm:p-10 rounded-3xl bg-[var(--card)] backdrop-blur-2xl border border-white/10 shadow-2xl relative overflow-hidden">
            {submittedSuccess ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center shadow-2xl shadow-[var(--primary)]/30">
                  <Sparkles className="w-8 h-8 text-[var(--text)]" />
                </div>
                <h3 className="text-2xl font-bold font-heading text-[var(--text)]">
                  Transmission Received
                </h3>
                <p className="text-sm text-[var(--muted)] max-w-sm">
                  Thank you! Your message has been encrypted and routed into my priority dispatch queue ({contact.formTargetEmail || contact.email}). I will follow up shortly.
                </p>
                <button
                  onClick={() => setSubmittedSuccess(false)}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-[var(--secondary)] cursor-pointer"
                >
                  Send Another Transmission
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-mono text-[var(--muted)] mb-2">
                      Your Identity / Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="e.g. Elena Rostova"
                      className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-[var(--text)] placeholder:text-[var(--muted)]/50 focus:border-[var(--secondary)] focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[var(--muted)] mb-2">
                      Direct Email Contact
                    </label>
                    <input
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="elena@studio.dev"
                      className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-[var(--text)] placeholder:text-[var(--muted)]/50 focus:border-[var(--secondary)] focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[var(--muted)] mb-2">
                    Scope of Engagement
                  </label>
                  <select
                    value={formState.service}
                    onChange={(e) => setFormState({ ...formState, service: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg)] border border-white/10 text-[var(--text)] focus:border-[var(--secondary)] focus:outline-none transition-all"
                  >
                    <option value="3D Interactive Website">3D Interactive Website / WebGL</option>
                    <option value="Generative AI & Spatial UI">Generative AI & Spatial UI Design</option>
                    <option value="Full-Stack Web App">Full-Stack Production Application</option>
                    <option value="Creative Technical Direction">Creative Technical Direction & Consulting</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-mono text-[var(--muted)]">
                      Message & Project Vision
                    </label>
                    <span className="text-[11px] font-mono text-[var(--muted)] tabular-nums">
                      {formState.message.length} chars
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    required
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    placeholder="Outline your timeline, goals, and technical ambitions..."
                    className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-[var(--text)] placeholder:text-[var(--muted)]/50 focus:border-[var(--secondary)] focus:outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:opacity-95 text-[var(--text)] text-sm font-semibold shadow-xl shadow-[var(--primary)]/30 transition-all duration-300 hover:scale-[1.01] active:scale-99 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 animate-spin text-[var(--secondary)]" />
                      <span>Transmitting Payload...</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-4 h-4 text-[var(--text)]" />
                      <span>Dispatch Transmission</span>
                    </span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Minimal Footer with 'Back to top' rocket button */}
      <footer className="mt-24 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[var(--muted)]">
        <div className="flex items-center gap-3">
          <span className="font-heading font-bold text-[var(--text)]">{profile.name}</span>
          <span aria-hidden="true">·</span>
          <span>{contact.footerCopyright || '© 2026 Crafted with WebGL & Three.js'}</span>
        </div>

        <button
          onClick={scrollToTop}
          className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--card)] hover:bg-white/10 border border-white/10 text-[var(--muted)] hover:text-[var(--secondary)] transition-all cursor-pointer"
        >
          <span>Back to Apex</span>
          <Rocket className="w-4 h-4 text-[var(--secondary)] transition-transform group-hover:-translate-y-1" />
        </button>
      </footer>
    </section>
  );
};
