import React from 'react';
import { useSiteContent } from '../../context/SiteContentContext';
import { Sliders, Sparkles } from 'lucide-react';
import { soundManager } from '../../utils/audio';

export const FloatingEditButton: React.FC = () => {
  const { enableEditor, isEditorOpen, openEditor } = useSiteContent();

  if (!enableEditor || isEditorOpen) return null;

  return (
    <button
      onClick={() => {
        soundManager.playClick();
        openEditor();
      }}
      className="fixed bottom-6 left-6 z-40 group flex items-center gap-2.5 px-4 py-2.5 rounded-full text-xs font-semibold text-[var(--text)] bg-[var(--card)] hover:bg-[var(--primary)]/20 border border-white/15 hover:border-[var(--secondary)]/60 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer pointer-events-auto"
      style={{
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 16px rgba(34, 211, 238, 0.15)',
      }}
      aria-label="Open site content editor"
      title="Edit portfolio content live"
    >
      <span className="w-2 h-2 rounded-full bg-[var(--secondary)] animate-pulse" />
      <Sliders className="w-3.5 h-3.5 text-[var(--secondary)] group-hover:rotate-45 transition-transform duration-300" />
      <span className="tracking-wide">Edit site</span>
      <Sparkles className="w-3 h-3 text-[var(--accent)] opacity-60 group-hover:opacity-100 transition-opacity" />
    </button>
  );
};
