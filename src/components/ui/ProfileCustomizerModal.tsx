import React, { useState } from 'react';
import { PortfolioData } from '../../types/portfolio';
import { X, Save, RotateCcw, UserCheck, Sparkles } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface ProfileCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PortfolioData;
  onSave: (updatedData: PortfolioData) => void;
  onReset: () => void;
}

export const ProfileCustomizerModal: React.FC<ProfileCustomizerModalProps> = ({
  isOpen,
  onClose,
  data,
  onSave,
  onReset,
}) => {
  const [formData, setFormData] = useState<PortfolioData>(data);
  const [savedNotification, setSavedNotification] = useState(false);

  if (!isOpen) return null;

  const handleChange = (field: keyof PortfolioData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRolesChange = (value: string) => {
    const rolesArray = value.split(',').map((r) => r.trim()).filter(Boolean);
    setFormData((prev) => ({
      ...prev,
      roles: rolesArray,
    }));
  };

  const handleBioChange = (value: string) => {
    const bioParagraphs = value.split('\n\n').map((p) => p.trim()).filter(Boolean);
    setFormData((prev) => ({
      ...prev,
      bio: bioParagraphs,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();
    onSave(formData);
    setSavedNotification(true);
    setTimeout(() => {
      setSavedNotification(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[var(--bg)] border border-white/10 shadow-2xl p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 text-[var(--secondary)] text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CUSTOMIZE PORTFOLIO DATA</span>
            </div>
            <h2 className="text-xl font-bold font-heading text-[var(--text)] mt-1">
              Replace With Your Info
            </h2>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--muted)] hover:text-[var(--text)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-[var(--muted)] mb-1">Your Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/20 border border-white/10 text-[var(--text)] focus:border-[var(--secondary)] focus:outline-none transition-colors"
                placeholder="e.g. Alex Morgan"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[var(--muted)] mb-1">Main Professional Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/20 border border-white/10 text-[var(--text)] focus:border-[var(--secondary)] focus:outline-none transition-colors"
                placeholder="e.g. Senior Full-Stack Engineer"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[var(--muted)] mb-1">
              Hero Tagline (Brief Impact Statement)
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => handleChange('tagline', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/20 border border-white/10 text-[var(--text)] focus:border-[var(--secondary)] focus:outline-none transition-colors"
              placeholder="e.g. Crafting bespoke digital experiences..."
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[var(--muted)] mb-1">
              Typewriter Roles (Comma separated)
            </label>
            <input
              type="text"
              value={formData.roles.join(', ')}
              onChange={(e) => handleRolesChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/20 border border-white/10 text-[var(--text)] focus:border-[var(--secondary)] focus:outline-none transition-colors"
              placeholder="Web Developer, UI/UX Designer, Creative Technologist"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[var(--muted)] mb-1">
              Bio Paragraphs (Separate paragraphs with double enter)
            </label>
            <textarea
              rows={4}
              value={formData.bio.join('\n\n')}
              onChange={(e) => handleBioChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/20 border border-white/10 text-[var(--text)] focus:border-[var(--secondary)] focus:outline-none transition-colors"
              placeholder="Tell visitors about your background, design principles, and technical strengths..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-[var(--muted)] mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/20 border border-white/10 text-[var(--text)] focus:border-[var(--secondary)] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[var(--muted)] mb-1">Location / Base</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/20 border border-white/10 text-[var(--text)] focus:border-[var(--secondary)] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-[var(--muted)] mb-1">GitHub URL</label>
              <input
                type="url"
                value={formData.github}
                onChange={(e) => handleChange('github', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/20 border border-white/10 text-[var(--text)] focus:border-[var(--secondary)] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[var(--muted)] mb-1">LinkedIn URL</label>
              <input
                type="url"
                value={formData.linkedin}
                onChange={(e) => handleChange('linkedin', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/20 border border-white/10 text-[var(--text)] focus:border-[var(--secondary)] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                onReset();
                onClose();
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs text-[var(--accent)] hover:opacity-80 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Defaults</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs text-[var(--muted)] hover:text-[var(--text)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[var(--text)] text-xs font-semibold shadow-lg shadow-[var(--primary)]/25 transition-all"
              >
                {savedNotification ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5 text-[var(--secondary)]" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Apply Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
