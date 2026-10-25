import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, Sliders } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { useSiteContent } from '../../context/SiteContentContext';

interface NavbarProps {
  brandName?: string;
  activeSection: string;
  onOpenContact: () => void;
  onOpenCustomizer?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  brandName: propBrandName,
  activeSection,
  onOpenContact,
  onOpenCustomizer,
}) => {
  const { content, enableEditor, openEditor } = useSiteContent();
  const brandName = propBrandName || content.profile.shortName;

  const [scrolled, setScrolled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSound = () => {
    const newState = soundManager.toggle();
    setSoundEnabled(newState);
  };

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Education', href: '#education' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleEditClick = () => {
    if (onOpenCustomizer) {
      onOpenCustomizer();
    } else {
      openEditor();
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'py-3 bg-[var(--bg)]/85 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/50'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between gap-6 lg:gap-8">
        {/* Zone 1: Brand Wordmark (Single text element in display face) */}
        <a
          href="#"
          onClick={() => soundManager.playClick()}
          className="group flex items-center gap-2 text-lg sm:text-xl font-bold font-heading tracking-tight text-[var(--text)] hover:text-white transition-colors whitespace-nowrap shrink-0"
        >
          <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] group-hover:rotate-45 transition-transform duration-300" />
          <span>{brandName}</span>
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-7 xl:gap-8 text-sm font-medium text-[var(--muted)]">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => soundManager.playHover()}
                className={`whitespace-nowrap shrink-0 transition-colors relative py-1 ${
                  isActive ? 'text-[var(--secondary)] font-semibold' : 'hover:text-[var(--text)]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action + Audio Switch */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={toggleSound}
            aria-label={soundEnabled ? 'Mute audio cues' : 'Enable audio cues'}
            title={soundEnabled ? 'Mute audio' : 'Enable cosmic audio feedback'}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-[var(--primary)]/20 border-[var(--primary)]/60 text-[var(--secondary)] shadow-md shadow-[var(--primary)]/20'
                : 'bg-white/5 border-white/10 text-[var(--muted)] hover:text-[var(--text)] hover:bg-white/10'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onOpenContact();
            }}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-[var(--text)] bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:opacity-95 rounded-xl shadow-lg shadow-[var(--primary)]/25 transition-all duration-200 hover:scale-[1.02] active:scale-98 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Get in Touch
          </button>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-[var(--text)] cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 mx-4 p-5 rounded-2xl bg-[var(--bg)]/95 backdrop-blur-2xl border border-white/10 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-4 text-sm font-medium text-[var(--muted)]">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => {
                  soundManager.playClick();
                  setMobileMenuOpen(false);
                }}
                className="py-1 hover:text-[var(--secondary)] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setMobileMenuOpen(false);
                  onOpenContact();
                }}
                className="w-full py-2.5 text-center text-xs font-semibold text-[var(--text)] bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-xl cursor-pointer"
              >
                Get in Touch
              </button>

              {/* Only show when ENABLE_EDITOR is true */}
              {enableEditor && (
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setMobileMenuOpen(false);
                    handleEditClick();
                  }}
                  className="w-full py-2 flex items-center justify-center gap-1.5 text-xs text-[var(--secondary)] hover:text-[var(--text)] cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Site Editor</span>
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
