import React from 'react';
import { GraduationCap, School } from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';
import { TimelineEntry } from '../../content';

interface EducationSectionProps {
  items?: TimelineEntry[];
}

export const EducationSection: React.FC<EducationSectionProps> = ({ items: propItems }) => {
  const { content } = useSiteContent();
  const educationList = propItems || content.education || [];
  const { badge, heading, subtitle } = content.educationSection || {
    badge: '05. Academic Background',
    heading: 'Education',
    subtitle: 'Formal Computer Science Foundations & Academic Qualifications',
  };

  return (
    <section
      id="education"
      className="relative py-20 sm:py-24 px-6 sm:px-8 max-w-7xl mx-auto scroll-mt-24"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-16 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[var(--secondary)]">
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

      {/* Education Timeline */}
      {educationList.length === 0 ? (
        <div className="p-8 rounded-3xl bg-[var(--card)] backdrop-blur-xl border border-white/10 text-center text-sm font-mono text-[var(--muted)]">
          No education records currently listed.
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-10 space-y-12 before:absolute before:left-2 sm:before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-[var(--secondary)] before:via-[var(--primary)] before:to-[var(--accent)]">
          {educationList.map((item) => (
            <div key={item.id} className="relative group">
              {/* Glowing Timeline Marker Node */}
              <div className="absolute -left-[30px] sm:-left-[38px] top-1.5 w-5 h-5 rounded-full bg-[var(--bg)] border-2 border-[var(--primary)] group-hover:border-[var(--secondary)] flex items-center justify-center shadow-lg shadow-[var(--primary)]/20 transition-all duration-300 group-hover:scale-125">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] group-hover:bg-[var(--secondary)]" />
              </div>

              {/* Glass Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[var(--card)] backdrop-blur-xl border border-white/10 group-hover:border-[var(--secondary)]/40 transition-all duration-300 shadow-xl space-y-4">
                {/* Meta Row: Period & Icon */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent)]">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span className="tabular-nums">{item.period}</span>
                  </div>

                  <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--muted)]">
                    Education
                  </span>
                </div>

                {/* Role/Degree & Institution */}
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold font-heading text-[var(--text)] group-hover:text-[var(--secondary)] transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-base text-[var(--secondary)] font-medium mt-0.5">
                    <School className="w-3.5 h-3.5 text-[var(--secondary)]/70" />
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
