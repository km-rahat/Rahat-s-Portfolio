import React, { useState, useEffect } from 'react';
import { soundManager } from '../../utils/audio';
import { ArrowRight, Terminal, Send } from 'lucide-react';
import { HeroParticlePortrait } from '../3d/HeroParticlePortrait';
import { useSiteContent } from '../../context/SiteContentContext';

interface HeroSectionProps {
  onOpenContact: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenContact }) => {
  const { content } = useSiteContent();
  const { profile, hero } = content;
  const roles = profile.roles || [];

  // Typewriter effect state
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!roles || roles.length === 0) return;
    const currentFullRole = roles[currentRoleIndex] || roles[0] || '';
    const typingSpeed = isDeleting ? 40 : 80;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentFullRole.substring(0, displayText.length + 1));
        if (displayText.length + 1 >= currentFullRole.length) {
          setTimeout(() => setIsDeleting(true), 1800);
        }
      } else {
        setDisplayText(currentFullRole.substring(0, displayText.length - 1));
        if (displayText.length <= 0) {
          setIsDeleting(false);
          setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentRoleIndex, roles]);

  return (
    <section
      id="hero"
      className="relative flex flex-col justify-center px-6 sm:px-8 overflow-hidden scroll-mt-24"
      style={{
        position: 'relative',
        minHeight: '100svh',
        height: 'auto',
        paddingTop: '96px',
        paddingBottom: '32px',
        marginBottom: 0,
      }}
    >
      {/* 3D Particle Portrait anchored to the bottom and right of Hero */}
      <HeroParticlePortrait photoUrl={profile.photoUrl} />

      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
        {/* Left Column: Typographic Hierarchy & Primary Narrative */}
        <div className="lg:col-span-7 space-y-6 z-10">
          {/* Editorial Kicker */}
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--secondary)]">
            <span className="w-2 h-2 rounded-full bg-[var(--secondary)] animate-ping" />
            <span>{hero.kicker}</span>
          </div>

          {/* Hero Name with Multi-Tone Gradient */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-heading tracking-tight leading-[1.08] text-balance text-[var(--text)]">
            {hero.greeting}{' '}
            <span className="text-gradient-cosmic block mt-1">
              {profile.name}
            </span>
          </h1>

          {/* Typewriter Role Bar */}
          <div className="flex items-center gap-2 text-lg sm:text-2xl font-mono text-[var(--text)] min-h-[2.2rem]">
            <Terminal className="w-5 h-5 text-[var(--primary)] shrink-0" />
            <span className="text-[var(--secondary)] font-medium">{displayText}</span>
            <span className="w-2 h-5 bg-[var(--secondary)] inline-block animate-pulse ml-0.5" />
          </div>

          {/* Tagline */}
          <p className="text-base sm:text-lg text-[var(--muted)] max-w-xl leading-relaxed">
            {hero.description || profile.tagline}
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <a
              href={hero.primaryButtonTarget || '#projects'}
              onClick={() => soundManager.playClick()}
              className="group flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[var(--text)] text-sm font-semibold shadow-xl shadow-[var(--primary)]/25 transition-all duration-300 hover:scale-[1.02] active:scale-98"
            >
              <span>{hero.primaryButtonLabel}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>

            <button
              onClick={() => {
                soundManager.playClick();
                onOpenContact();
              }}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--card)] hover:bg-white/[0.08] border border-white/10 hover:border-[var(--secondary)]/40 text-[var(--text)] text-sm font-medium transition-all duration-300 cursor-pointer"
            >
              <Send className="w-4 h-4 text-[var(--secondary)]" />
              <span>{hero.secondaryButtonLabel}</span>
            </button>
          </div>

          {/* Status Markers */}
          <div className="pt-4 flex items-center gap-4 text-xs font-mono text-[var(--muted)]">
            <span>{profile.availabilityText}</span>
            <span aria-hidden="true">·</span>
            <span>{hero.statusPeriod}</span>
          </div>
        </div>

        {/* Right Column: Dedicated column spacer for desktop grid layout without creating extra vertical space */}
        <div className="hidden lg:block lg:col-span-5 pointer-events-none" aria-hidden="true" />
      </div>
    </section>
  );
};
