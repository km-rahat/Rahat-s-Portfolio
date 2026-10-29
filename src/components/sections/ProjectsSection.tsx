import React, { useState } from 'react';
import { Project } from '../../types/portfolio';
import { ProjectCard3D } from '../ui/ProjectCard3D';
import { soundManager } from '../../utils/audio';

import { useSiteContent } from '../../context/SiteContentContext';

interface ProjectsSectionProps {
  projects?: Project[];
  onOpenModal: (project: Project) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects: propProjects, onOpenModal }) => {
  const { content } = useSiteContent();
  const projects = (propProjects || content.projects || []) as Project[];
  const [filter, setFilter] = useState<string>('all');

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter((p) => p.category === filter);

  const categories = React.useMemo(() => {
    const categoryNameMap: Record<string, string> = {
      'fintech': 'Fintech & Utility',
      'e-commerce': 'E-Commerce',
      'showcase': 'Product Showcase',
      'web-app': 'Web Applications',
      '3d-webgl': '3D & WebGL',
      'ai-systems': 'Spatial AI',
      'creative': 'Creative & Audio',
    };
    const found = new Set<string>();
    projects.forEach((p) => {
      if (p.category) found.add(p.category);
    });
    const tabs = [{ id: 'all', label: `All Projects (${projects.length})` }];
    found.forEach((cat) => {
      tabs.push({
        id: cat,
        label: categoryNameMap[cat] || (cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, ' ')),
      });
    });
    return tabs;
  }, [projects]);

  return (
    <section id="projects" className="relative py-24 px-6 sm:px-8 max-w-7xl mx-auto scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[var(--secondary)]">
            03. Selected Portfolio
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[var(--text)] mt-2">
            Featured Works & Flagship Systems
          </h2>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[var(--card)] border border-white/10 rounded-xl">
          {categories.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                soundManager.playClick();
                setFilter(tab.id);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                filter === tab.id
                  ? 'bg-[var(--primary)] text-[var(--text)] shadow-md shadow-[var(--primary)]/30'
                  : 'text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of 3D Tilt Project Cards */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 text-[var(--muted)] text-sm">
          No projects found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard3D
              key={project.id}
              project={project}
              onOpenModal={onOpenModal}
            />
          ))}
        </div>
      )}

      {/* Proof / Client Trust Note */}
      <div className="mt-16 p-6 rounded-2xl bg-[var(--card)] backdrop-blur-xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h4 className="text-sm font-semibold text-[var(--text)]">
            Need custom 3D WebGL architecture or private NDA case studies?
          </h4>
          <p className="text-xs text-[var(--muted)] mt-1">
            Additional proprietary enterprise systems available upon verified inquiry.
          </p>
        </div>
        <a
          href="#contact"
          onClick={() => soundManager.playClick()}
          className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-[var(--secondary)] hover:text-[var(--accent)] transition-colors whitespace-nowrap"
        >
          Request NDA Portfolio
        </a>
      </div>
    </section>
  );
};
