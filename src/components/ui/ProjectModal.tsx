import React, { useEffect } from 'react';
import { Project } from '../../types/portfolio';
import { X, ExternalLink, Github, CheckCircle2, Layers } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[var(--bg)] border border-white/10 shadow-2xl p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--muted)] hover:text-[var(--text)] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Metadata */}
        <div>
          <div className="flex items-center gap-2 text-xs text-[var(--muted)] mb-2">
            <span className="text-[var(--secondary)] font-mono">{project.year}</span>
            <span aria-hidden="true">·</span>
            <span>{project.role}</span>
            {project.metrics && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-[var(--secondary)] font-mono">{project.metrics}</span>
              </>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[var(--text)]">
            {project.title}
          </h2>
        </div>

        {/* High-Resolution Media Viewport */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-[var(--bg)]">
          <img
            src={project.image}
            alt={project.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)]/80 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Narrative & Architecture Breakdown */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-[var(--text)] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[var(--primary)]" />
            <span>Architecture & Systems Engineering</span>
          </h3>
          <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed">
            {project.extendedDescription}
          </p>
        </div>

        {/* Technical Highlights */}
        {project.highlights && project.highlights.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--muted)]">
              Key Technical Innovations
            </h4>
            <div className="grid sm:grid-cols-2 gap-3">
              {project.highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-[var(--card)] border border-white/5 text-xs text-[var(--text)]"
                >
                  <CheckCircle2 className="w-4 h-4 text-[var(--secondary)] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tech Stack Unboxed */}
        <div className="pt-2 border-t border-white/5">
          <span className="text-xs font-mono text-[var(--muted)] block mb-2">Technologies Used</span>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--muted)] font-mono">
            {((project as any).techTags || project.tags || []).map((tag: string, i: number, arr: string[]) => (
              <span key={tag}>
                <span className="text-[var(--secondary)]">{tag}</span>
                {i < arr.length - 1 && <span className="text-white/20 ml-2" aria-hidden="true">/</span>}
              </span>
            ))}
          </div>
        </div>

        {/* Modal Footer CTAs */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => soundManager.playClick()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[var(--text)] text-xs font-semibold shadow-lg shadow-[var(--primary)]/20 transition-all hover:scale-[1.02] active:scale-98"
            >
              <span>Launch Live Prototype</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => soundManager.playClick()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[var(--text)] text-xs font-medium transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Source Repository</span>
            </a>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="text-xs text-[var(--muted)] hover:text-[var(--text)] transition-colors"
          >
            Dismiss (ESC)
          </button>
        </div>
      </div>
    </div>
  );
};
