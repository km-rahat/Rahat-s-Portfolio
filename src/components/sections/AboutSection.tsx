import React, { useState } from 'react';
import { soundManager } from '../../utils/audio';
import { Code2, Compass, Cpu, Edit3 } from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';

interface AboutSectionProps {
  onOpenCustomizer: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenCustomizer }) => {
  const { content, enableEditor } = useSiteContent();
  const { profile, about } = content;
  const [activeTab, setActiveTab] = useState<'manifesto' | 'process'>('manifesto');
  const [imgError, setImgError] = useState(false);

  const displayPhotoUrl = profile.photoUrl || about.photoUrl;

  return (
    <section
      id="about"
      className="relative pt-10 sm:pt-16 pb-20 sm:pb-24 px-6 sm:px-8 max-w-7xl mx-auto mt-0 scroll-mt-24"
      style={{ marginTop: 0 }}
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-16 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[var(--secondary)]">
            {about.badge || '01. Background & Philosophy'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[var(--text)] mt-2">
            {about.heading}
          </h2>
        </div>
        {enableEditor && (
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenCustomizer();
            }}
            className="flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-[var(--secondary)] font-mono transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Customize Profile</span>
          </button>
        )}
      </div>

      {/* Main Split: Glowing Portrait + Bio Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Creator Portrait in Glowing Frame */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative group">
            {/* Ambient Radial Bloom */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-[var(--primary)]/20 via-[var(--secondary)]/15 to-[var(--accent)]/15 rounded-3xl blur-2xl opacity-60 pointer-events-none" />

            {/* Glowing Border Frame */}
            <div className="relative w-72 sm:w-80 aspect-square rounded-3xl p-[2px] bg-gradient-to-br from-[var(--primary)] via-[var(--secondary)] to-[var(--accent)] shadow-2xl">
              <div className="w-full h-full rounded-[22px] overflow-hidden bg-[var(--bg)] relative">
                {!imgError && displayPhotoUrl ? (
                  <img
                    key={displayPhotoUrl}
                    src={displayPhotoUrl}
                    alt={profile.name}
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[var(--bg)]">
                    <Cpu className="w-12 h-12 text-[var(--secondary)] mb-3" />
                    <span className="font-heading font-bold text-[var(--text)]">{profile.name}</span>
                    <span className="text-xs text-[var(--muted)] mt-1">{profile.shortName}</span>
                  </div>
                )}
                
                {/* Subtle Inner Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)]/80 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-[var(--text)] backdrop-blur-md bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
                  <span className="text-[var(--secondary)] font-semibold">{profile.location}</span>
                  <span className="text-[var(--secondary)]">Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bio Prose & Narrative */}
        <div className="lg:col-span-7 space-y-6">
          {/* Segmented Filter Tab Controls */}
          <div className="flex items-center gap-2 p-1 bg-[var(--card)] border border-white/10 rounded-xl w-fit">
            <button
              onClick={() => {
                soundManager.playClick();
                setActiveTab('manifesto');
              }}
              className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                activeTab === 'manifesto'
                  ? 'bg-[var(--primary)] text-[var(--text)] shadow-md shadow-[var(--primary)]/30'
                  : 'text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              Creative Manifesto
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                setActiveTab('process');
              }}
              className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                activeTab === 'process'
                  ? 'bg-[var(--primary)] text-[var(--text)] shadow-md shadow-[var(--primary)]/30'
                  : 'text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              Methodology & Code
            </button>
          </div>

          {activeTab === 'manifesto' ? (
            <div className="space-y-4 text-[var(--text)] text-base sm:text-lg leading-relaxed">
              {about.paragraphs.map((paragraph, idx) => (
                <p key={idx} className="text-[var(--text)]">
                  {paragraph}
                </p>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[var(--card)] border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-[var(--secondary)] font-mono text-xs">
                  <Code2 className="w-4 h-4" />
                  <span>{about.methodologyNotes?.leftSubtitle || 'SHADER PIPELINES'}</span>
                </div>
                <h4 className="font-bold text-[var(--text)]">
                  {about.methodologyNotes?.leftTitle || 'Deterministic WebGL'}
                </h4>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  {about.methodologyNotes?.leftText ||
                    'Profiling draw calls, optimizing buffer geometries, and authoring modular GLSL shaders to guarantee rock-solid 60 FPS across low-power mobile devices.'}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[var(--card)] border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-[var(--primary)] font-mono text-xs">
                  <Compass className="w-4 h-4" />
                  <span>{about.methodologyNotes?.rightSubtitle || 'ERGONOMIC UX'}</span>
                </div>
                <h4 className="font-bold text-[var(--text)]">
                  {about.methodologyNotes?.rightTitle || 'Tactile Micro-Physics'}
                </h4>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  {about.methodologyNotes?.rightText ||
                    'Every transition utilizes spring physics curves, subtle cursor parallax, and typographic restraint so interactions feel grounded and organic.'}
                </p>
              </div>
            </div>
          )}

          {/* Core Focus Area Bullets */}
          <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-[var(--muted)]">
            <span>CORE STACK: THREE.JS</span>
            <span aria-hidden="true">·</span>
            <span>REACT 19</span>
            <span aria-hidden="true">·</span>
            <span>GLSL NOISE</span>
            <span aria-hidden="true">·</span>
            <span>TYPESCRIPT</span>
          </div>
        </div>
      </div>

      {/* Full-Width 4-Column KPI Counters Strip */}
      <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {about.counters.map((stat, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl bg-[var(--card)] backdrop-blur-xl border border-white/10 hover:border-[var(--primary)]/40 transition-colors"
          >
            <div className="text-3xl sm:text-4xl font-bold font-heading text-gradient-cosmic tabular-nums">
              {stat.value}{stat.suffix}
            </div>
            <div className="text-sm font-semibold text-[var(--text)] mt-2">
              {stat.label}
            </div>
            <div className="text-xs text-[var(--muted)] font-mono mt-1">
              {stat.subtext}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
