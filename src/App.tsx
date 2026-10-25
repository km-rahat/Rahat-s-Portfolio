import React, { useState, useEffect } from 'react';
import { Project } from './types/portfolio';
import { SiteContentProvider, useSiteContent } from './context/SiteContentContext';
import { Navbar } from './components/ui/Navbar';
import { CustomCursor } from './components/ui/CustomCursor';
import { IntroLoader } from './components/ui/IntroLoader';
import { UnifiedBackground3D } from './components/3d/UnifiedBackground3D';
import { HeroSection } from './components/sections/HeroSection';
import { AboutSection } from './components/sections/AboutSection';
import { SkillsSection } from './components/sections/SkillsSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { ExperienceSection } from './components/sections/ExperienceSection';
import { EducationSection } from './components/sections/EducationSection';
import { ContactSection } from './components/sections/ContactSection';
import { ProjectModal } from './components/ui/ProjectModal';
import { FloatingEditButton } from './components/editor/FloatingEditButton';
import { ContentEditorDrawer } from './components/editor/ContentEditorDrawer';

function PortfolioMain() {
  const { openEditor } = useSiteContent();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeSection, setActiveSection] = useState('hero');

  // Track active section on scroll for nav link highlight
  useEffect(() => {
    const sectionIds = ['about', 'skills', 'projects', 'experience', 'education', 'contact'];
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      if (scrollY < windowHeight * 0.4) {
        setActiveSection('hero');
        return;
      }

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop - 140;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] relative selection:bg-[var(--primary)]/40 selection:text-[var(--secondary)]">
      {/* Intro Loader Animation */}
      {isLoading && <IntroLoader onComplete={() => setIsLoading(false)} />}

      {/* Custom Glowing Cursor */}
      <CustomCursor />

      {/* Fixed Scroll-Controlled 3D Cosmic Background */}
      <UnifiedBackground3D />

      {/* Top Bar Navigation */}
      <Navbar
        activeSection={activeSection}
        onOpenContact={() => {
          const el = document.getElementById('contact');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenCustomizer={openEditor}
      />

      {/* Main Single-Page Content */}
      <main className="relative z-10">
        <HeroSection
          onOpenContact={() => {
            const el = document.getElementById('contact');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenCustomizer={openEditor}
        />

        <AboutSection
          onOpenCustomizer={openEditor}
        />

        <SkillsSection />

        <ProjectsSection
          onOpenModal={(proj) => setSelectedProject(proj)}
        />

        <ExperienceSection />
        <EducationSection />

        <ContactSection />
      </main>

      {/* Project Deep Dive Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* Floating "Edit site" glass button at bottom-left */}
      <FloatingEditButton />

      {/* Built-in Content Editor Drawer */}
      <ContentEditorDrawer />
    </div>
  );
}

export default function App() {
  return (
    <SiteContentProvider>
      <PortfolioMain />
    </SiteContentProvider>
  );
}
