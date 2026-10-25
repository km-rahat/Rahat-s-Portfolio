import React from 'react';
import { Briefcase, Building2 } from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';
import { TimelineEntry } from '../../content';

interface ExperienceSectionProps {
  items?: TimelineEntry[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ items: propItems }) => {
  const { content } = useSiteContent();
  const experienceList = propItems || content.experience || [];
  const { badge, heading, subtitle } = content.experienceSection || {
    badge: '04. Professional Trajectory',
    heading: 'Experience',
    subtitle: 'Leadership, Community Engagement & Engineering Impact',
  };

  return (
    <section
      id="experience"
      className="relative py-20 sm:py-24 px-6 sm:px-8 max-w-7xl mx-auto scroll-mt-24"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-16 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[var(--accent)]">
            {badge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[var(--text)] mt-2">
            {heading}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-[var(--muted)] font-mono mt-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Experience Timeline */}
      {experienceList.length === 0 ? (
        <div className="p-8 rounded-3xl bg-[var(--card)] backdrop-blur-xl border border-white/10 text-center text-sm font-mono text-[var(--muted)]">
          No experience records currently listed.
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-10 space-y-12 before:absolute before:left-2 sm:before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-[var(--primary)] before:via-[var(--secondary)] before:to-[var(--accent)]">
          {experienceList.map((item) => (
            <div key={item.id} className="relative group">
              {/* Glowing Timeline Marker Node */}
              <div className="absolute -left-[30px] sm:-left-[38px] top-1.5 w-5 h-5 rounded-full bg-[var(--bg)] border-2 border-[var(--secondary)] group-hover:border-[var(--accent)] flex items-center justify-center shadow-lg shadow-[var(--secondary)]/20 transition-all duration-300 group-hover:scale-125">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--secondary)] group-hover:bg-[var(--accent)]" />
              </div>

              {/* Glass Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[var(--card)] backdrop-blur-xl border border-white/10 group-hover:border-[var(--primary)]/40 transition-all duration-300 shadow-xl space-y-4">
                {/* Meta Row: Period & Icon */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-[var(--secondary)]">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span className="tabular-nums">{item.period}</span>
                  </div>

                  <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--muted)]">
                    Experience
                  </span>
                </div>

                {/* Role & Org */}
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold font-heading text-[var(--text)] group-hover:text-[var(--secondary)] transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-base text-[var(--secondary)] font-medium mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-[var(--secondary)]/70" />
                    <span>{item.place}</span>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
