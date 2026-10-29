import React, { useRef, useState } from 'react';
import { Project } from '../../types/portfolio';
import { ExternalLink, Github, Eye, Sparkles } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface ProjectCard3DProps {
  project: Project;
  onOpenModal: (project: Project) => void;
}

export const ProjectCard3D: React.FC<ProjectCard3DProps> = ({ project, onOpenModal }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 });
  const [imgError, setImgError] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -8;
    const rotY = ((x - centerX) / centerX) * 8;

    setRotateX(rotX);
    setRotateY(rotY);

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlarePosition({ x: glareX, y: glareY, opacity: 0.22 });
  };

  const handleMouseEnter = () => {
    soundManager.playHover();
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePosition(prev => ({ ...prev, opacity: 0 }));
  };

  const hasGithub = Boolean(
    project.githubUrl &&
    project.githubUrl.trim() !== '' &&
    project.githubUrl.trim().toLowerCase() !== 'none' &&
    project.githubUrl.trim().toLowerCase() !== '#'
  );

  // Filter out any placeholder tags like [TECH_1], [TECH_2], etc.
  const rawTags = ((project as any).techTags || project.tags || []) as string[];
  const validTags = rawTags.filter((tag: string) => {
    if (!tag) return false;
    const trimmed = tag.trim();
    if (trimmed.startsWith('[') || trimmed.endsWith(']')) return false;
    if (trimmed.toUpperCase().includes('TECH_')) return false;
    return true;
  });

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative rounded-2xl p-[1px] transition-all duration-300 will-change-transform h-full flex flex-col"
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Outer Border Glow on Hover */}
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-[var(--primary)]/20 via-[var(--secondary)]/15 to-[var(--accent)]/20 opacity-40 group-hover:opacity-100 group-hover:from-[var(--primary)] group-hover:via-[var(--secondary)] group-hover:to-[var(--accent)] transition-all duration-500 blur-[1px]" />

      {/* Glass Container */}
      <div className="relative h-full flex flex-col rounded-2xl bg-[var(--card)] backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl transition-all duration-300">
        
        {/* Dynamic Specular Glare Layer */}
        <div
          className="pointer-events-none absolute inset-0 z-20 rounded-2xl transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.35) 0%, rgba(34,211,238,0.15) 30%, transparent 70%)`,
            opacity: glarePosition.opacity,
          }}
        />

        {/* Media Container with 16:10 Aspect Ratio */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--bg)] rounded-t-2xl">
          {!imgError && project.image ? (
            <img
              src={project.image}
              alt={`Screenshot of ${project.title} website`}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[var(--card)] via-[var(--bg)] to-[var(--card)] p-6 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--primary)_0%,_transparent_70%)] opacity-25 pointer-events-none" />
              <div className="w-12 h-12 rounded-2xl bg-[var(--primary)]/15 border border-[var(--primary)]/30 flex items-center justify-center mb-3 text-[var(--secondary)] shadow-inner relative z-10">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="text-base font-bold font-heading text-[var(--text)] relative z-10">{project.title}</span>
              <span className="text-xs text-[var(--secondary)] font-mono mt-1 uppercase tracking-wider relative z-10">{project.category}</span>
            </div>
          )}

          {/* Scrim Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-black/20" />

          {/* Quick Action Overlay on hover */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2.5 z-10">
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenModal(project);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--text)] text-xs font-semibold shadow-lg shadow-[var(--primary)]/30 transition-transform active:scale-95"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Details</span>
            </button>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundManager.playClick()}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[var(--text)] text-xs font-medium transition-colors"
                title={`Launch ${project.title}`}
              >
                <span>Live</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {hasGithub && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundManager.playClick()}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[var(--text)] text-xs font-medium transition-colors"
                title="GitHub Repository"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            {/* Unboxed Metadata with Typographic Separator */}
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

            <h3 className="text-xl font-bold font-heading text-[var(--text)] group-hover:text-[var(--secondary)] transition-colors">
              {project.title}
            </h3>

            <p className="mt-2 text-sm text-[var(--muted)] line-clamp-3 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Tech Stack Unboxed Tags & Actions */}
          <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--muted)] font-mono">
              {validTags.length > 0 ? (
                validTags.map((tag: string, i: number, arr: string[]) => (
                  <span key={tag}>
                    <span className="hover:text-[var(--text)] transition-colors">{tag}</span>
                    {i < arr.length - 1 && <span className="text-white/20 ml-2" aria-hidden="true">/</span>}
                  </span>
                ))
              ) : (
                <span className="text-[var(--muted)]/60 text-xs italic">Web Development</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundManager.playClick()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--primary)]/15 hover:bg-[var(--primary)] text-xs font-semibold text-[var(--secondary)] hover:text-[var(--text)] transition-all border border-[var(--primary)]/30 hover:border-[var(--primary)]"
                >
                  <span>Live</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {hasGithub && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundManager.playClick()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-[var(--muted)] hover:text-[var(--text)] transition-colors border border-white/10"
                  title="Source Code Repository"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
