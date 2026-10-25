import React, { useState, useRef, ChangeEvent } from 'react';
import { useSiteContent } from '../../context/SiteContentContext';
import { processImageFile } from '../../utils/imageProcessor';
import { soundManager } from '../../utils/audio';
import {
  X,
  Save,
  RotateCcw,
  Download,
  Upload,
  User,
  Sparkles,
  Layers,
  Briefcase,
  Clock,
  Mail,
  Palette,
  Image as ImageIcon,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Check,
  AlertTriangle,
  Info,
  Sliders,
  ExternalLink,
  GraduationCap,
  School,
  Building2,
} from 'lucide-react';
import { SkillItemContent, ProjectContent, TimelineEntry, SocialLink } from '../../content';

type EditorTab =
  | 'profile'
  | 'hero'
  | 'about'
  | 'skills'
  | 'projects'
  | 'experience'
  | 'education'
  | 'contact'
  | 'theme';

export const ContentEditorDrawer: React.FC = () => {
  const {
    content,
    updateContent,
    isEditorOpen,
    closeEditor,
    hasUnsavedChanges,
    saveChanges,
    resetDefaults,
    exportJson,
    importJson,
    enableEditor,
  } = useSiteContent();

  const [activeTab, setActiveTab] = useState<EditorTab>('profile');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [saveToast, setSaveToast] = useState(false);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const photoFileInputRef = useRef<HTMLInputElement>(null);
  const projectFileInputRef = useRef<HTMLInputElement>(null);
  const jsonFileInputRef = useRef<HTMLInputElement>(null);
  const currentEditingProjectIndex = useRef<number | null>(null);

  if (!enableEditor || !isEditorOpen) return null;

  // Handle Save
  const handleSave = () => {
    soundManager.playClick();
    saveChanges();
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2200);
  };

  // Handle Reset to Defaults
  const handleReset = () => {
    if (window.confirm('Reset all content back to original defaults? Any unsaved edits will be lost.')) {
      soundManager.playClick();
      resetDefaults();
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 2200);
    }
  };

  // Handle Photo File Upload
  const handlePhotoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessingPhoto(true);
      const dataUri = await processImageFile(file, 900);
      updateContent((prev) => ({
        ...prev,
        profile: { ...prev.profile, photoUrl: dataUri },
        about: { ...prev.about, photoUrl: dataUri },
      }));
      soundManager.playChime();
    } catch (err) {
      console.error('Image processing failed:', err);
      alert('Failed to process image. Please try a different PNG/JPG file.');
    } finally {
      setIsProcessingPhoto(false);
      if (photoFileInputRef.current) photoFileInputRef.current.value = '';
    }
  };

  // Handle Project Image Upload
  const handleProjectImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const idx = currentEditingProjectIndex.current;
    if (!file || idx === null) return;

    try {
      const dataUri = await processImageFile(file, 1200);
      updateContent((prev) => {
        const next = [...prev.projects];
        next[idx] = { ...next[idx], image: dataUri };
        return { ...prev, projects: next };
      });
      soundManager.playChime();
    } catch (err) {
      console.error('Project image failed:', err);
      alert('Failed to process image.');
    } finally {
      if (projectFileInputRef.current) projectFileInputRef.current.value = '';
      currentEditingProjectIndex.current = null;
    }
  };

  // Handle JSON Import
  const handleJsonImport = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = importJson(event.target?.result as string);
      if (!result.success) {
        setImportError(result.error || 'Failed to import JSON');
      } else {
        setImportError(null);
        soundManager.playChime();
        saveChanges();
      }
    };
    reader.readAsText(file);
    if (jsonFileInputRef.current) jsonFileInputRef.current.value = '';
  };

  // List manipulation helpers
  const moveItem = <T,>(list: T[], index: number, direction: 'up' | 'down'): T[] => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return list;
    const next = [...list];
    const [moved] = next.splice(index, 1);
    next.splice(targetIndex, 0, moved);
    return next;
  };

  return (
    <>
      {/* Hidden file inputs */}
      <input
        ref={photoFileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handlePhotoUpload}
        className="hidden"
      />
      <input
        ref={projectFileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleProjectImageUpload}
        className="hidden"
      />
      <input
        ref={jsonFileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleJsonImport}
        className="hidden"
      />

      {/* Editor Drawer (Overlay-free so user sees live page changes behind it) */}
      <aside
        aria-label="Site Content Editor"
        className="fixed top-0 left-0 bottom-0 z-50 w-full sm:w-[480px] lg:w-[520px] bg-[var(--bg)]/95 backdrop-blur-2xl border-r border-white/10 shadow-2xl flex flex-col transition-transform duration-300 pointer-events-auto"
        style={{
          boxShadow: '0 0 50px rgba(0, 0, 0, 0.8), 0 0 20px rgba(124, 58, 237, 0.15)',
        }}
      >
        {/* TOP BAR */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center shadow-md shadow-[var(--primary)]/20">
              <Sliders className="w-4 h-4 text-[var(--text)]" />
            </div>
            <div>
              <h2 className="text-sm font-bold font-heading text-[var(--text)] flex items-center gap-2">
                Site Editor
                {hasUnsavedChanges ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Unsaved changes
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Saved
                  </span>
                )}
              </h2>
              <p className="text-[11px] text-[var(--muted)] font-mono">Live In-Place Content Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[var(--text)] hover:opacity-95 shadow-md shadow-[var(--primary)]/25 transition-all"
              title="Save changes to browser"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>

            <button
              onClick={closeEditor}
              className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--text)] hover:bg-white/10 transition-colors"
              title="Close editor drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* UTILITY ACTION ROW (Reset, Export, Import) */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-black/40 border-b border-white/5 text-[11px] font-mono text-[var(--muted)]">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
            title="Reset to default content"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Defaults</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={exportJson}
              className="flex items-center gap-1 hover:text-[var(--secondary)] transition-colors"
              title="Download content as JSON"
            >
              <Download className="w-3 h-3" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={() => jsonFileInputRef.current?.click()}
              className="flex items-center gap-1 hover:text-[var(--secondary)] transition-colors"
              title="Load content from JSON"
            >
              <Upload className="w-3 h-3" />
              <span>Import JSON</span>
            </button>
          </div>
        </div>

        {importError && (
          <div className="px-5 py-2 bg-rose-500/20 border-b border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
            <span>{importError}</span>
            <button onClick={() => setImportError(null)} className="underline ml-2">
              Dismiss
            </button>
          </div>
        )}

        {saveToast && (
          <div className="px-5 py-2 bg-emerald-500/20 border-b border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-3.5 h-3.5" />
            <span>Changes successfully saved to browser storage!</span>
          </div>
        )}

        {/* TABS NAVIGATION */}
        <div className="flex items-center overflow-x-auto px-3 py-2 border-b border-white/10 bg-white/[0.01] gap-1 shrink-0 no-scrollbar">
          {[
            { id: 'profile', label: 'Profile & Photo', icon: User },
            { id: 'hero', label: 'Hero', icon: Sparkles },
            { id: 'about', label: 'About', icon: Info },
            { id: 'skills', label: 'Skills', icon: Layers },
            { id: 'projects', label: 'Projects', icon: Layers },
            { id: 'experience', label: 'Experience', icon: Briefcase },
            { id: 'education', label: 'Education', icon: GraduationCap },
            { id: 'contact', label: 'Contact', icon: Mail },
            { id: 'theme', label: 'Theme & SEO', icon: Palette },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundManager.playClick();
                  setActiveTab(tab.id as EditorTab);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[var(--primary)] text-[var(--text)] shadow-md shadow-[var(--primary)]/30 font-semibold'
                    : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* DRAWER SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* TAB 1: PROFILE & PHOTO */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Photo Upload Section */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-[var(--secondary)] flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" />
                    Portrait Photo (Hero 3D & About)
                  </span>
                  {isProcessingPhoto && (
                    <span className="text-[10px] text-[var(--secondary)] font-mono animate-pulse">
                      Processing 900px...
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-black/60 border border-white/20 shrink-0">
                    <img
                      src={content.profile.photoUrl}
                      alt="Portrait Preview"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => photoFileInputRef.current?.click()}
                        disabled={isProcessingPhoto}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--text)] transition-colors flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload From Device</span>
                      </button>
                      <button
                        onClick={() => {
                          updateContent((prev) => ({
                            ...prev,
                            profile: { ...prev.profile, photoUrl: 'https://i.postimg.cc/9XqD9rG1/me.png' },
                            about: { ...prev.about, photoUrl: 'https://i.postimg.cc/9XqD9rG1/me.png' },
                          }));
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-mono text-[var(--muted)] hover:text-[var(--text)] bg-white/5 border border-white/10"
                      >
                        Reset Photo
                      </button>
                    </div>

                    <p className="text-[11px] text-[var(--muted)] leading-tight">
                      Tip: <span className="text-[var(--secondary)]">Use a transparent-background PNG</span> for the best particle portrait. Resized to 900px automatically.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[var(--muted)] mb-1">
                    Or Paste Image URL:
                  </label>
                  <input
                    type="url"
                    value={content.profile.photoUrl}
                    onChange={(e) => {
                      const url = e.target.value;
                      updateContent((prev) => ({
                        ...prev,
                        profile: { ...prev.profile, photoUrl: url },
                        about: { ...prev.about, photoUrl: url },
                      }));
                    }}
                    placeholder="https://example.com/portrait.png"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/10 text-[var(--text)] focus:border-[var(--secondary)] focus:outline-none"
                  />
                </div>
              </div>

              {/* Profile Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-[var(--muted)] mb-1.5">
                    Full Name (Display Heading)
                  </label>
                  <input
                    type="text"
                    value={content.profile.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      updateContent((prev) => ({
                        ...prev,
                        profile: { ...prev.profile, name },
                      }));
                    }}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-black/40 border border-white/10 text-[var(--text)] focus:border-[var(--secondary)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[var(--muted)] mb-1.5">
                    Short Name (Navbar Logo Wordmark)
                  </label>
                  <input
                    type="text"
                    value={content.profile.shortName}
                    onChange={(e) => {
                      const shortName = e.target.value;
                      updateContent((prev) => ({
                        ...prev,
                        profile: { ...prev.profile, shortName },
                      }));
                    }}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-black/40 border border-white/10 text-[var(--text)] focus:border-[var(--secondary)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[var(--muted)] mb-1.5">
                    Location String
                  </label>
                  <input
                    type="text"
                    value={content.profile.location}
                    onChange={(e) => {
                      const location = e.target.value;
                      updateContent((prev) => ({
                        ...prev,
                        profile: { ...prev.profile, location },
                      }));
                    }}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-black/40 border border-white/10 text-[var(--text)] focus:border-[var(--secondary)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[var(--muted)] mb-1.5">
                    Tagline (Summary under Hero)
                  </label>
                  <textarea
                    rows={2}
                    value={content.profile.tagline}
                    onChange={(e) => {
                      const tagline = e.target.value;
                      updateContent((prev) => ({
                        ...prev,
                        profile: { ...prev.profile, tagline },
                        hero: { ...prev.hero, description: tagline },
                      }));
                    }}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-black/40 border border-white/10 text-[var(--text)] focus:border-[var(--secondary)] focus:outline-none"
                  />
                </div>

                {/* Roles / Typing Lines List */}
                <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-[var(--muted)]">
                      Typewriter Role Lines ({content.profile.roles.length})
                    </span>
                    <button
                      onClick={() => {
                        updateContent((prev) => ({
                          ...prev,
                          profile: {
                            ...prev.profile,
                            roles: [...prev.profile.roles, 'Spatial Computing Engineer'],
                          },
                        }));
                      }}
                      className="flex items-center gap-1 text-[11px] font-mono text-[var(--secondary)] hover:underline"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Role</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {content.profile.roles.map((role, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={role}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateContent((prev) => {
                              const next = [...prev.profile.roles];
                              next[idx] = val;
                              return { ...prev, profile: { ...prev.profile, roles: next } };
                            });
                          }}
                          className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-black/40 border border-white/10 text-[var(--text)] focus:border-[var(--secondary)] focus:outline-none"
                        />
                        <button
                          onClick={() => {
                            updateContent((prev) => ({
                              ...prev,
                              profile: {
                                ...prev.profile,
                                roles: moveItem(prev.profile.roles, idx, 'up'),
                              },
                            }));
                          }}
                          disabled={idx === 0}
                          className="p-1 rounded text-[var(--muted)] hover:text-[var(--text)] disabled:opacity-20"
                          title="Move up"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            updateContent((prev) => ({
                              ...prev,
                              profile: {
                                ...prev.profile,
                                roles: moveItem(prev.profile.roles, idx, 'down'),
                              },
                            }));
                          }}
                          disabled={idx === content.profile.roles.length - 1}
                          className="p-1 rounded text-[var(--muted)] hover:text-[var(--text)] disabled:opacity-20"
                          title="Move down"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            updateContent((prev) => {
                              const next = prev.profile.roles.filter((_, i) => i !== idx);
                              return { ...prev, profile: { ...prev.profile, roles: next } };
                            });
                          }}
                          disabled={content.profile.roles.length <= 1}
                          className="p-1 rounded text-rose-400 hover:text-rose-300 disabled:opacity-20"
                          title="Delete role"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HERO SECTION */}
          {activeTab === 'hero' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[var(--muted)] mb-1.5">
                  Editorial Kicker Badge
                </label>
                <input
                  type="text"
                  value={content.hero.kicker}
                  onChange={(e) => {
                    const kicker = e.target.value;
                    updateContent((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, kicker },
                    }));
                  }}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-black/40 border border-white/10 text-[var(--text)] focus:border-[var(--secondary)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[var(--muted)] mb-1.5">
                  Greeting Line
                </label>
                <input
                  type="text"
                  value={content.hero.greeting}
                  onChange={(e) => {
                    const greeting = e.target.value;
                    updateContent((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, greeting },
                    }));
                  }}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-black/40 border border-white/10 text-[var(--text)] focus:border-[var(--secondary)] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[var(--muted)] mb-1.5">
                    Primary Button Label
                  </label>
                  <input
                    type="text"
                    value={content.hero.primaryButtonLabel}
                    onChange={(e) => {
                      const primaryButtonLabel = e.target.value;
                      updateContent((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, primaryButtonLabel },
                      }));
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/10 text-[var(--text)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[var(--muted)] mb-1.5">
                    Target URL / Hash
                  </label>
                  <input
                    type="text"
                    value={content.hero.primaryButtonTarget}
                    onChange={(e) => {
                      const primaryButtonTarget = e.target.value;
                      updateContent((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, primaryButtonTarget },
                      }));
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/10 text-[var(--text)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[var(--muted)] mb-1.5">
                    Secondary Button Label
                  </label>
                  <input
                    type="text"
                    value={content.hero.secondaryButtonLabel}
                    onChange={(e) => {
                      const secondaryButtonLabel = e.target.value;
                      updateContent((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, secondaryButtonLabel },
                      }));
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/10 text-[var(--text)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[var(--muted)] mb-1.5">
                    Target URL / Hash
                  </label>
                  <input
                    type="text"
                    value={content.hero.secondaryButtonTarget}
                    onChange={(e) => {
                      const secondaryButtonTarget = e.target.value;
                      updateContent((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, secondaryButtonTarget },
                      }));
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/10 text-[var(--text)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[var(--muted)] mb-1.5">
                    Availability Text
                  </label>
                  <input
                    type="text"
                    value={content.profile.availabilityText}
                    onChange={(e) => {
                      const availabilityText = e.target.value;
                      updateContent((prev) => ({
                        ...prev,
                        profile: { ...prev.profile, availabilityText },
                      }));
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/10 text-[var(--text)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[var(--muted)] mb-1.5">
                    Quarter / Period Marker
                  </label>
                  <input
                    type="text"
                    value={content.hero.statusPeriod}
                    onChange={(e) => {
                      const statusPeriod = e.target.value;
                      updateContent((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, statusPeriod },
                      }));
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/10 text-[var(--text)]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ABOUT SECTION */}
          {activeTab === 'about' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-mono text-[var(--muted)] mb-1.5">
                  Section Badge
                </label>
                <input
                  type="text"
                  value={content.about.badge}
                  onChange={(e) => {
                    const badge = e.target.value;
                    updateContent((prev) => ({
                      ...prev,
                      about: { ...prev.about, badge },
                    }));
                  }}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-black/40 border border-white/10 text-[var(--text)]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[var(--muted)] mb-1.5">
                  Section Main Heading
                </label>
                <input
                  type="text"
                  value={content.about.heading}
                  onChange={(e) => {
                    const heading = e.target.value;
                    updateContent((prev) => ({
                      ...prev,
                      about: { ...prev.about, heading },
                    }));
                  }}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-black/40 border border-white/10 text-[var(--text)]"
                />
              </div>

              {/* About Paragraphs */}
              <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-[var(--muted)]">
                    Narrative Paragraphs ({content.about.paragraphs.length})
                  </span>
                  <button
                    onClick={() => {
                      updateContent((prev) => ({
                        ...prev,
                        about: {
                          ...prev.about,
                          paragraphs: [
                            ...prev.about.paragraphs,
                            'New paragraph detailing architectural approach and engineering philosophy.',
                          ],
                        },
                      }));
                    }}
                    className="flex items-center gap-1 text-[11px] font-mono text-[var(--secondary)] hover:underline"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Paragraph</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {content.about.paragraphs.map((p, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-[var(--muted)] font-mono">
                        <span>Paragraph #{idx + 1}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              updateContent((prev) => ({
                                ...prev,
                                about: {
                                  ...prev.about,
                                  paragraphs: moveItem(prev.about.paragraphs, idx, 'up'),
                                },
                              }));
                            }}
                            disabled={idx === 0}
                            className="p-1 hover:text-[var(--text)] disabled:opacity-20"
                          >
                            <ChevronUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => {
                              updateContent((prev) => ({
                                ...prev,
                                about: {
                                  ...prev.about,
                                  paragraphs: moveItem(prev.about.paragraphs, idx, 'down'),
                                },
                              }));
                            }}
                            disabled={idx === content.about.paragraphs.length - 1}
                            className="p-1 hover:text-[var(--text)] disabled:opacity-20"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => {
                              updateContent((prev) => ({
                                ...prev,
                                about: {
                                  ...prev.about,
                                  paragraphs: prev.about.paragraphs.filter((_, i) => i !== idx),
                                },
                              }));
                            }}
                            disabled={content.about.paragraphs.length <= 1}
                            className="p-1 text-rose-400 hover:text-rose-300 disabled:opacity-20"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <textarea
                        rows={3}
                        value={p}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateContent((prev) => {
                            const next = [...prev.about.paragraphs];
                            next[idx] = val;
                            return { ...prev, about: { ...prev.about, paragraphs: next } };
                          });
                        }}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-black/60 border border-white/10 text-[var(--text)]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* KPI Counters */}
              <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-[var(--muted)]">
                    KPI Counters ({content.about.counters.length})
                  </span>
                  <button
                    onClick={() => {
                      updateContent((prev) => ({
                        ...prev,
                        about: {
                          ...prev.about,
                          counters: [
                            ...prev.about.counters,
                            { label: 'New Metric', value: 10, suffix: '+', subtext: 'Subtext' },
                          ],
                        },
                      }));
                    }}
                    className="flex items-center gap-1 text-[11px] font-mono text-[var(--secondary)] hover:underline"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Counter</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {content.about.counters.map((c, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[var(--text)]">{c.label || 'Counter'}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              updateContent((prev) => ({
                                ...prev,
                                about: {
                                  ...prev.about,
                                  counters: moveItem(prev.about.counters, idx, 'up'),
                                },
                              }));
                            }}
                            disabled={idx === 0}
                            className="p-1 hover:text-[var(--text)] disabled:opacity-20"
                          >
                            <ChevronUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => {
                              updateContent((prev) => ({
                                ...prev,
                                about: {
                                  ...prev.about,
                                  counters: moveItem(prev.about.counters, idx, 'down'),
                                },
                              }));
                            }}
                            disabled={idx === content.about.counters.length - 1}
                            className="p-1 hover:text-[var(--text)] disabled:opacity-20"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => {
                              updateContent((prev) => ({
                                ...prev,
                                about: {
                                  ...prev.about,
                                  counters: prev.about.counters.filter((_, i) => i !== idx),
                                },
                              }));
                            }}
                            className="p-1 text-rose-400 hover:text-rose-300"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-[10px] font-mono text-[var(--muted)]">Value</label>
                          <input
                            type="number"
                            value={c.value}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              updateContent((prev) => {
                                const next = [...prev.about.counters];
                                next[idx] = { ...next[idx], value: val };
                                return { ...prev, about: { ...prev.about, counters: next } };
                              });
                            }}
                            className="w-full px-2 py-1 text-xs rounded bg-black/60 border border-white/10 text-[var(--text)]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-[var(--muted)]">Suffix</label>
                          <input
                            type="text"
                            value={c.suffix}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateContent((prev) => {
                                const next = [...prev.about.counters];
                                next[idx] = { ...next[idx], suffix: val };
                                return { ...prev, about: { ...prev.about, counters: next } };
                              });
                            }}
                            className="w-full px-2 py-1 text-xs rounded bg-black/60 border border-white/10 text-[var(--text)]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-[var(--muted)]">Label</label>
                          <input
                            type="text"
                            value={c.label}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateContent((prev) => {
                                const next = [...prev.about.counters];
                                next[idx] = { ...next[idx], label: val };
                                return { ...prev, about: { ...prev.about, counters: next } };
                              });
                            }}
                            className="w-full px-2 py-1 text-xs rounded bg-black/60 border border-white/10 text-[var(--text)]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-[var(--muted)]">Subtext</label>
                        <input
                          type="text"
                          value={c.subtext}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateContent((prev) => {
                              const next = [...prev.about.counters];
                              next[idx] = { ...next[idx], subtext: val };
                              return { ...prev, about: { ...prev.about, counters: next } };
                            });
                          }}
                          className="w-full px-2 py-1 text-xs rounded bg-black/60 border border-white/10 text-[var(--text)]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SKILLS */}
          {activeTab === 'skills' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--muted)]">
                  Orbital Skills Matrix ({content.skills.length})
                </span>
                <button
                  onClick={() => {
                    const newId = `skill-${Date.now()}`;
                    const newSkill: SkillItemContent = {
                      id: newId,
                      name: 'New Technical Skill',
                      category: 'Frontend',
                      level: 88,
                      description: 'Architecting scalable modules and production systems.',
                      usedIn: ['React', 'TypeScript'],
                    };
                    updateContent((prev) => ({
                      ...prev,
                      skills: [...prev.skills, newSkill],
                    }));
                  }}
                  className="flex items-center gap-1 text-xs font-mono text-[var(--secondary)] hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Skill</span>
                </button>
              </div>

              <div className="space-y-3">
                {content.skills.map((skill, idx) => {
                  const isConfirmingDelete = deleteConfirmId === skill.id;
                  return (
                    <div
                      key={skill.id}
                      className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold font-heading text-[var(--text)]">
                          #{idx + 1} {skill.name}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              updateContent((prev) => ({
                                ...prev,
                                skills: moveItem(prev.skills, idx, 'up'),
                              }));
                            }}
                            disabled={idx === 0}
                            className="p-1 hover:text-[var(--text)] disabled:opacity-20"
                            title="Move up"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              updateContent((prev) => ({
                                ...prev,
                                skills: moveItem(prev.skills, idx, 'down'),
                              }));
                            }}
                            disabled={idx === content.skills.length - 1}
                            className="p-1 hover:text-[var(--text)] disabled:opacity-20"
                            title="Move down"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>

                          {isConfirmingDelete ? (
                            <div className="flex items-center gap-1 bg-rose-500/20 px-2 py-0.5 rounded text-[10px] text-rose-300">
                              <span>Delete?</span>
                              <button
                                onClick={() => {
                                  updateContent((prev) => ({
                                    ...prev,
                                    skills: prev.skills.filter((s) => s.id !== skill.id),
                                  }));
                                  setDeleteConfirmId(null);
                                }}
                                className="font-bold underline ml-1 text-rose-200"
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="ml-1 text-[var(--muted)]"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(skill.id)}
                              className="p-1 text-rose-400 hover:text-rose-300"
                              title="Delete skill"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-mono text-[var(--muted)]">Skill Name</label>
                          <input
                            type="text"
                            value={skill.name}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateContent((prev) => {
                                const next = [...prev.skills];
                                next[idx] = { ...next[idx], name: val };
                                return { ...prev, skills: next };
                              });
                            }}
                            className="w-full px-2.5 py-1.5 text-xs rounded bg-black/60 border border-white/10 text-[var(--text)]"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-mono text-[var(--muted)]">Category</label>
                          <select
                            value={skill.category}
                            onChange={(e) => {
                              const val = e.target.value as SkillItemContent['category'];
                              updateContent((prev) => {
                                const next = [...prev.skills];
                                next[idx] = { ...next[idx], category: val };
                                return { ...prev, skills: next };
                              });
                            }}
                            className="w-full px-2 py-1.5 text-xs rounded bg-black/80 border border-white/10 text-[var(--text)]"
                          >
                            <option value="Frontend">Frontend</option>
                            <option value="3D / Graphics">3D / Graphics</option>
                            <option value="Backend">Backend</option>
                            <option value="Tools / DevOps">Tools / DevOps</option>
                            <option value="Core / Languages">Core / Languages</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-[10px] font-mono text-[var(--muted)]">
                          <span>Proficiency Level</span>
                          <span className="text-[var(--secondary)]">{skill.level}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={skill.level}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            updateContent((prev) => {
                              const next = [...prev.skills];
                              next[idx] = { ...next[idx], level: val };
                              return { ...prev, skills: next };
                            });
                          }}
                          className="w-full accent-[var(--secondary)]"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-[var(--muted)]">Description</label>
                        <textarea
                          rows={2}
                          value={skill.description}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateContent((prev) => {
                              const next = [...prev.skills];
                              next[idx] = { ...next[idx], description: val };
                              return { ...prev, skills: next };
                            });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs rounded bg-black/60 border border-white/10 text-[var(--text)]"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-[var(--muted)]">
                          Used In Tags (Comma-separated)
                        </label>
                        <input
                          type="text"
                          value={skill.usedIn.join(', ')}
                          onChange={(e) => {
                            const tags = e.target.value.split(',').map((t) => t.trim()).filter(Boolean);
                            updateContent((prev) => {
                              const next = [...prev.skills];
                              next[idx] = { ...next[idx], usedIn: tags };
                              return { ...prev, skills: next };
                            });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs rounded bg-black/60 border border-white/10 text-[var(--text)]"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--muted)]">
                  Portfolio Works ({content.projects.length})
                </span>
                <button
                  onClick={() => {
                    const newProject: ProjectContent = {
                      id: `project-${Date.now()}`,
                      title: 'New Spatial Experience',
                      category: '3d-webgl',
                      description: 'Interactive real-time 3D experience featuring responsive shaders and procedural geometry.',
                      extendedDescription: 'Complete architectural overview and high-performance engineering breakdown.',
                      image: '/src/assets/images/project_cyber_finance_1791914218241.jpg',
                      techTags: ['Three.js', 'React 19', 'TypeScript'],
                      year: '2026',
                      role: 'Lead Architect',
                      metrics: '60 FPS Ultra Performance',
                      liveUrl: 'https://example.com',
                      githubUrl: 'https://github.com',
                      highlights: ['Procedural WebGL buffer geometry', '60 FPS responsive animations'],
                    };
                    updateContent((prev) => ({
                      ...prev,
                      projects: [newProject, ...prev.projects],
                    }));
                  }}
                  className="flex items-center gap-1 text-xs font-mono text-[var(--secondary)] hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Project</span>
                </button>
              </div>

              <div className="space-y-4">
                {content.projects.map((proj, idx) => {
                  const isConfirming = deleteConfirmId === proj.id;
                  return (
                    <div
                      key={proj.id}
                      className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold font-heading text-[var(--text)] truncate max-w-[200px]">
                          #{idx + 1} {proj.title}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              updateContent((prev) => ({
                                ...prev,
                                projects: moveItem(prev.projects, idx, 'up'),
                              }));
                            }}
                            disabled={idx === 0}
                            className="p-1 hover:text-[var(--text)] disabled:opacity-20"
                            title="Move up"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              updateContent((prev) => ({
                                ...prev,
                                projects: moveItem(prev.projects, idx, 'down'),
                              }));
                            }}
                            disabled={idx === content.projects.length - 1}
                            className="p-1 hover:text-[var(--text)] disabled:opacity-20"
                            title="Move down"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>

                          {isConfirming ? (
                            <div className="flex items-center gap-1 bg-rose-500/20 px-2 py-0.5 rounded text-[10px] text-rose-300">
                              <span>Delete?</span>
                              <button
                                onClick={() => {
                                  updateContent((prev) => ({
                                    ...prev,
                                    projects: prev.projects.filter((p) => p.id !== proj.id),
                                  }));
                                  setDeleteConfirmId(null);
                                }}
                                className="font-bold underline ml-1 text-rose-200"
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="ml-1 text-[var(--muted)]"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(proj.id)}
                              className="p-1 text-rose-400 hover:text-rose-300"
                              title="Delete project"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Image Preview & Upload */}
                      <div className="flex items-center gap-3">
                        <div className="relative w-20 aspect-video rounded-lg overflow-hidden bg-black/60 border border-white/20 shrink-0">
                          <img src={proj.image} alt={proj.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                currentEditingProjectIndex.current = idx;
                                projectFileInputRef.current?.click();
                              }}
                              className="px-2 py-1 text-[11px] rounded bg-white/10 hover:bg-white/20 text-[var(--text)] flex items-center gap-1"
                            >
                              <Upload className="w-3 h-3" />
                              <span>Upload Image</span>
                            </button>
                          </div>
                          <input
                            type="text"
                            value={proj.image}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateContent((prev) => {
                                const next = [...prev.projects];
                                next[idx] = { ...next[idx], image: val };
                                return { ...prev, projects: next };
                              });
                            }}
                            placeholder="Image URL or upload"
                            className="w-full px-2 py-1 text-[11px] rounded bg-black/60 border border-white/10 text-[var(--muted)]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-mono text-[var(--muted)]">Title</label>
                          <input
                            type="text"
                            value={proj.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateContent((prev) => {
                                const next = [...prev.projects];
                                next[idx] = { ...next[idx], title: val };
                                return { ...prev, projects: next };
                              });
                            }}
                            className="w-full px-2 py-1 text-xs rounded bg-black/60 border border-white/10 text-[var(--text)]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-[var(--muted)]">Category</label>
                          <select
                            value={proj.category}
                            onChange={(e) => {
                              const val = e.target.value as ProjectContent['category'];
                              updateContent((prev) => {
                                const next = [...prev.projects];
                                next[idx] = { ...next[idx], category: val };
                                return { ...prev, projects: next };
                              });
                            }}
                            className="w-full px-2 py-1.5 text-xs rounded bg-black/80 border border-white/10 text-[var(--text)]"
                          >
                            <option value="fintech">Fintech & Web3</option>
                            <option value="ai-systems">Spatial AI</option>
                            <option value="creative">Audio & DSP</option>
                            <option value="3d-webgl">3D Constellation</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-[var(--muted)]">Short Summary</label>
                        <textarea
                          rows={2}
                          value={proj.description}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateContent((prev) => {
                              const next = [...prev.projects];
                              next[idx] = { ...next[idx], description: val };
                              return { ...prev, projects: next };
                            });
                          }}
                          className="w-full px-2 py-1 text-xs rounded bg-black/60 border border-white/10 text-[var(--text)]"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-[10px] font-mono text-[var(--muted)]">Year</label>
                          <input
                            type="text"
                            value={proj.year}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateContent((prev) => {
                                const next = [...prev.projects];
                                next[idx] = { ...next[idx], year: val };
                                return { ...prev, projects: next };
                              });
                            }}
                            className="w-full px-2 py-1 text-xs rounded bg-black/60 border border-white/10 text-[var(--text)]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-[var(--muted)]">Role</label>
                          <input
                            type="text"
                            value={proj.role}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateContent((prev) => {
                                const next = [...prev.projects];
                                next[idx] = { ...next[idx], role: val };
                                return { ...prev, projects: next };
                              });
                            }}
                            className="w-full px-2 py-1 text-xs rounded bg-black/60 border border-white/10 text-[var(--text)]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-[var(--muted)]">Metric</label>
                          <input
                            type="text"
                            value={proj.metrics || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateContent((prev) => {
                                const next = [...prev.projects];
                                next[idx] = { ...next[idx], metrics: val };
                                return { ...prev, projects: next };
                              });
                            }}
                            className="w-full px-2 py-1 text-xs rounded bg-black/60 border border-white/10 text-[var(--text)]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-mono text-[var(--muted)]">Live URL</label>
                          <input
                            type="text"
                            value={proj.liveUrl}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateContent((prev) => {
                                const next = [...prev.projects];
                                next[idx] = { ...next[idx], liveUrl: val };
                                return { ...prev, projects: next };
                              });
                            }}
                            className="w-full px-2 py-1 text-xs rounded bg-black/60 border border-white/10 text-[var(--text)]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-[var(--muted)]">GitHub URL</label>
                          <input
                            type="text"
                            value={proj.githubUrl}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateContent((prev) => {
                                const next = [...prev.projects];
                                next[idx] = { ...next[idx], githubUrl: val };
                                return { ...prev, projects: next };
                              });
                            }}
                            className="w-full px-2 py-1 text-xs rounded bg-black/60 border border-white/10 text-[var(--text)]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-[var(--muted)]">
                          Tech Tags (Comma-separated)
                        </label>
                        <input
                          type="text"
                          value={proj.techTags.join(', ')}
                          onChange={(e) => {
                            const tags = e.target.value.split(',').map((t) => t.trim()).filter(Boolean);
                            updateContent((prev) => {
                              const next = [...prev.projects];
                              next[idx] = { ...next[idx], techTags: tags };
                              return { ...prev, projects: next };
                            });
                          }}
                          className="w-full px-2 py-1 text-xs rounded bg-black/60 border border-white/10 text-[var(--text)]"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 6A: EXPERIENCE */}
          {activeTab === 'experience' && (
            <div className="space-y-4">
              {/* Section Header Controls */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--secondary)]">
                  Section Header
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-mono text-[var(--muted)]">Badge</label>
                    <input
                      type="text"
                      value={content.experienceSection?.badge ?? 'Career History'}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateContent((prev) => ({
                          ...prev,
                          experienceSection: {
                            ...(prev.experienceSection || { badge: 'Career History', heading: 'Experience', subtitle: 'Work, leadership roles, and professional contributions.' }),
                            badge: val,
                          },
                        }));
                      }}
                      className="w-full px-2 py-1 text-xs rounded bg-black/60 border border-white/10 text-[var(--text)]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-[var(--muted)]">Heading</label>
                    <input
                      type="text"
                      value={content.experienceSection?.heading ?? 'Experience'}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateContent((prev) => ({
                          ...prev,
                          experienceSection: {
                            ...(prev.experienceSection || { badge: 'Career History', heading: 'Experience', subtitle: 'Work, leadership roles, and professional contributions.' }),
                            heading: val,
                          },
                        }));
                      }}
                      className="w-full px-2 py-1 text-xs rounded bg-black/60 border border-white/10 text-[var(--text)]"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-mono text-[var(--muted)]">Subtitle</label>
                  <input
                    type="text"
                    value={content.experienceSection?.subtitle ?? ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateContent((prev) => ({
                        ...prev,
                        experienceSection: {
                          ...(prev.experienceSection || { badge: 'Career History', heading: 'Experience', subtitle: 'Work, leadership roles, and professional contributions.' }),
                          subtitle: val,
                        },
                      }));
                    }}
                    className="w-full px-2 py-1 text-xs rounded bg-black/60 border border-white/10 text-[var(--text)]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--muted)]">
                  Experience Entries ({content.experience?.length || 0})
                </span>
                <button
                  onClick={() => {
                    const newItem: TimelineEntry = {
                      id: `exp-${Date.now()}`,
                      period: '2025 — Present',
                      title: 'Role Title',
                      place: 'Company / Organization',
                      location: 'City, Country',
                      description: 'Key responsibilities, leadership, and notable achievements.',
                    };
                    updateContent((prev) => ({
                      ...prev,
                      experience: [newItem, ...(prev.experience || [])],
                    }));
                  }}
                  className="flex items-center gap-1 text-xs font-mono text-[var(--secondary)] hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Experience</span>
                </button>
              </div>

              <div className="space-y-3">
                {(content.experience || []).map((item, idx) => {
                  const itemKey = item.id || `exp-item-${idx}`;
                  const isConfirming = deleteConfirmId === itemKey;
                  return (
                    <div
                      key={itemKey}
                      className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold font-heading text-[var(--text)] truncate max-w-[200px]">
                          #{idx + 1} {item.title || 'Untitled Role'}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              updateContent((prev) => ({
                                ...prev,
                                experience: moveItem(prev.experience || [], idx, 'up'),
                              }));
                            }}
                            disabled={idx === 0}
                            className="p-1 hover:text-[var(--text)] disabled:opacity-20"
                            title="Move Up"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              updateContent((prev) => ({
                                ...prev,
                                experience: moveItem(prev.experience || [], idx, 'down'),
                              }));
                            }}
                            disabled={idx === (content.experience?.length || 0) - 1}
                            className="p-1 hover:text-[var(--text)] disabled:opacity-20"
                            title="Move Down"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>

                          {isConfirming ? (
                            <div className="flex items-center gap-1 bg-rose-500/20 px-2 py-0.5 rounded text-[10px] text-rose-300">
                              <span>Delete?</span>
                              <button
                                onClick={() => {
                                  updateContent((prev) => ({
                                    ...prev,
                                    experience: (prev.experience || []).filter((_, i) => i !== idx),
                                  }));
                                  setDeleteConfirmId(null);
                                }}
                                className="font-bold underline ml-1 text-rose-200"
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="ml-1 text-[var(--muted)]"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(itemKey)}
                              className="p-1 text-rose-400 hover:text-rose-300"
                              title="Delete Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-mono text-[var(--muted)]">Period</label>
                          <input
                            type="text"
                            value={item.period}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateContent((prev) => {
                                const next = [...(prev.experience || [])];
                                next[idx] = { ...next[idx], period: val };
                                return { ...prev, experience: next };
                              });
                            }}
                            className="w-full px-2 py-1 text-xs rounded bg-black/60 border border-white/10 text-[var(--text)]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-[var(--muted)]">Location (optional)</label>
                          <input
                            type="text"
                            value={item.location ?? ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateContent((prev) => {
                                const next = [...(prev.experience || [])];
                                next[idx] = { ...next[idx], location: val };
                                return { ...prev, experience: next };
                              });
                            }}
                            placeholder="e.g. Dhaka, Bangladesh"
                            className="w-full px-2 py-1 text-xs rounded bg-black/60 border border-white/10 text-[var(--text)]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-mono text-[var(--muted)]">Role / Title</label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateContent((prev) => {
                                const next = [...(prev.experience || [])];
                                next[idx] = { ...next[idx], title: val };
                                return { ...prev, experience: next };
                              });
                            }}
                            className="w-full px-2 py-1 text-xs rounded bg-black/60 border border-white/10 text-[var(--text)]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-[var(--muted)]">Company / Org</label>
                          <input
                            type="text"
                            value={item.place}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateContent((prev) => {
                                const next = [...(prev.experience || [])];
                                next[idx] = { ...next[idx], place: val };
                                return { ...prev, experience: next };
                              });
                            }}
                            className="w-full px-2 py-1 text-xs rounded bg-black/60 border border-white/10 text-[var(--text)]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-[var(--muted)]">Description</label>
                        <textarea
                          rows={2}
                          value={item.description}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateContent((prev) => {
                              const next = [...(prev.experience || [])];
                              next[idx] = { ...next[idx], description: val };
                              return { ...prev, experience: next };
                            });
                          }}
                          className="w-full px-2 py-1 text-xs rounded bg-black/60 border border-white/10 text-[var(--text)]"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 6B: EDUCATION */}
          {activeTab === 'education' && (
            <div className="space-y-4">
              {/* Section Header Controls */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--secondary)]">
                  Section Header
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-mono text-[var(--muted)]">Badge</label>
                    <input
                      type="text"
                      value={content.educationSection?.badge ?? 'Academic Background'}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateContent((prev) => ({
                          ...prev,
                          educationSection: {
                            ...(prev.educationSection || { badge: 'Academic Background', heading: 'Education', subtitle: 'Formal degrees, institutional studies, and foundations.' }),
                            badge: val,
                          },
                        }));
                      }}
                      className="w-full px-2 py-1 text-xs rounded bg-black/60 border border-white/10 text-[var(--text)]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-[var(--muted)]">Heading</label>
                    <input
                      type="text"
                      value={content.educationSection?.heading ?? 'Education'}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateContent((prev) => ({
                          ...prev,
                          educationSection: {
                            ...(prev.educationSection || { badge: 'Academic Background', heading: 'Education', subtitle: 'Formal degrees, institutional studies, and foundations.' }),
                            heading: val,
                          },
                        }));
                      }}
                      className="w-full px-2 py-1 text-xs rounded bg-black/60 border border-white/10 text-[var(--text)]"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-mono text-[var(--muted)]">Subtitle</label>
                  <input
                    type="text"
                    value={content.educationSection?.subtitle ?? ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateContent((prev) => ({
                        ...prev,
                        educationSection: {
                          ...(prev.educationSection || { badge: 'Academic Background', heading: 'Education', subtitle: 'Formal degrees, institutional studies, and foundations.' }),
                          subtitle: val,
                        },
                      }));
                    }}
                    className="w-full px-2 py-1 text-xs rounded bg-black/60 border border-white/10 text-[var(--text)]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--muted)]">
                  Education Entries ({content.education?.length || 0})
                </span>
                <button
                  onClick={() => {
                    const newItem: TimelineEntry = {
                      id: `edu-${Date.now()}`,
                      period: '2022 — Present',
                      title: 'Degree / Certificate',
                      place: 'Institution / University',
                      location: 'City, Country',
                      description: 'Field of study, major topics, and academic achievements.',
                    };
                    updateContent((prev) => ({
                      ...prev,
                      education: [newItem, ...(prev.education || [])],
                    }));
                  }}
                  className="flex items-center gap-1 text-xs font-mono text-[var(--secondary)] hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Education</span>
                </button>
              </div>

              <div className="space-y-3">
                {(content.education || []).map((item, idx) => {
                  const itemKey = item.id || `edu-item-${idx}`;
                  const isConfirming = deleteConfirmId === itemKey;
                  return (
                    <div
                      key={itemKey}
                      className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold font-heading text-[var(--text)] truncate max-w-[200px]">
                          #{idx + 1} {item.title || 'Untitled Degree'}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              updateContent((prev) => ({
                                ...prev,
                                education: moveItem(prev.education || [], idx, 'up'),
                              }));
                            }}
                            disabled={idx === 0}
                            className="p-1 hover:text-[var(--text)] disabled:opacity-20"
                            title="Move Up"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              updateContent((prev) => ({
                                ...prev,
                                education: moveItem(prev.education || [], idx, 'down'),
                              }));
                            }}
                            disabled={idx === (content.education?.length || 0) - 1}
                            className="p-1 hover:text-[var(--text)] disabled:opacity-20"
                            title="Move Down"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>

                          {isConfirming ? (
                            <div className="flex items-center gap-1 bg-rose-500/20 px-2 py-0.5 rounded text-[10px] text-rose-300">
                              <span>Delete?</span>
                              <button
                                onClick={() => {
                                  updateContent((prev) => ({
                                    ...prev,
                                    education: (prev.education || []).filter((_, i) => i !== idx),
                                  }));
                                  setDeleteConfirmId(null);
                                }}
                                className="font-bold underline ml-1 text-rose-200"
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="ml-1 text-[var(--muted)]"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(itemKey)}
                              className="p-1 text-rose-400 hover:text-rose-300"
                              title="Delete Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-mono text-[var(--muted)]">Period</label>
                          <input
                            type="text"
                            value={item.period}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateContent((prev) => {
                                const next = [...(prev.education || [])];
                                next[idx] = { ...next[idx], period: val };
                                return { ...prev, education: next };
                              });
                            }}
                            className="w-full px-2 py-1 text-xs rounded bg-black/60 border border-white/10 text-[var(--text)]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-[var(--muted)]">Location (optional)</label>
                          <input
                            type="text"
                            value={item.location ?? ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateContent((prev) => {
                                const next = [...(prev.education || [])];
                                next[idx] = { ...next[idx], location: val };
                                return { ...prev, education: next };
                              });
                            }}
                            placeholder="e.g. Dhaka, Bangladesh"
                            className="w-full px-2 py-1 text-xs rounded bg-black/60 border border-white/10 text-[var(--text)]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-mono text-[var(--muted)]">Degree / Program</label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateContent((prev) => {
                                const next = [...(prev.education || [])];
                                next[idx] = { ...next[idx], title: val };
                                return { ...prev, education: next };
                              });
                            }}
                            className="w-full px-2 py-1 text-xs rounded bg-black/60 border border-white/10 text-[var(--text)]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-[var(--muted)]">Institution / College</label>
                          <input
                            type="text"
                            value={item.place}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateContent((prev) => {
                                const next = [...(prev.education || [])];
                                next[idx] = { ...next[idx], place: val };
                                return { ...prev, education: next };
                              });
                            }}
                            className="w-full px-2 py-1 text-xs rounded bg-black/60 border border-white/10 text-[var(--text)]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-[var(--muted)]">Description</label>
                        <textarea
                          rows={2}
                          value={item.description}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateContent((prev) => {
                              const next = [...(prev.education || [])];
                              next[idx] = { ...next[idx], description: val };
                              return { ...prev, education: next };
                            });
                          }}
                          className="w-full px-2 py-1 text-xs rounded bg-black/60 border border-white/10 text-[var(--text)]"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 7: CONTACT & SOCIAL */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[var(--muted)] mb-1.5">
                  Section Main Heading
                </label>
                <input
                  type="text"
                  value={content.contact.heading}
                  onChange={(e) => {
                    const heading = e.target.value;
                    updateContent((prev) => ({
                      ...prev,
                      contact: { ...prev.contact, heading },
                    }));
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/10 text-[var(--text)]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[var(--muted)] mb-1.5">
                  Contact Email (Public & Copyable)
                </label>
                <input
                  type="email"
                  value={content.contact.email}
                  onChange={(e) => {
                    const email = e.target.value;
                    updateContent((prev) => ({
                      ...prev,
                      contact: { ...prev.contact, email, formTargetEmail: email },
                    }));
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/10 text-[var(--text)]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[var(--muted)] mb-1.5">
                  Phone (Optional)
                </label>
                <input
                  type="text"
                  value={content.contact.phone}
                  onChange={(e) => {
                    const phone = e.target.value;
                    updateContent((prev) => ({
                      ...prev,
                      contact: { ...prev.contact, phone },
                    }));
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/10 text-[var(--text)]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[var(--muted)] mb-1.5">
                  Footer Copyright String
                </label>
                <input
                  type="text"
                  value={content.contact.footerCopyright}
                  onChange={(e) => {
                    const footerCopyright = e.target.value;
                    updateContent((prev) => ({
                      ...prev,
                      contact: { ...prev.contact, footerCopyright },
                    }));
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/10 text-[var(--text)]"
                />
              </div>

              {/* Socials List */}
              <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-[var(--muted)]">
                    Social Networks ({content.contact.socials.length})
                  </span>
                  <button
                    onClick={() => {
                      const newSocial: SocialLink = { label: 'GitHub', url: 'https://github.com' };
                      updateContent((prev) => ({
                        ...prev,
                        contact: {
                          ...prev.contact,
                          socials: [...prev.contact.socials, newSocial],
                        },
                      }));
                    }}
                    className="flex items-center gap-1 text-[11px] font-mono text-[var(--secondary)] hover:underline"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Network</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {content.contact.socials.map((soc, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={soc.label}
                        placeholder="Platform"
                        onChange={(e) => {
                          const val = e.target.value;
                          updateContent((prev) => {
                            const next = [...prev.contact.socials];
                            next[idx] = { ...next[idx], label: val };
                            return { ...prev, contact: { ...prev.contact, socials: next } };
                          });
                        }}
                        className="w-28 px-2 py-1.5 text-xs rounded bg-black/60 border border-white/10 text-[var(--text)]"
                      />
                      <input
                        type="url"
                        value={soc.url}
                        placeholder="https://..."
                        onChange={(e) => {
                          const val = e.target.value;
                          updateContent((prev) => {
                            const next = [...prev.contact.socials];
                            next[idx] = { ...next[idx], url: val };
                            return { ...prev, contact: { ...prev.contact, socials: next } };
                          });
                        }}
                        className="flex-1 px-2 py-1.5 text-xs rounded bg-black/60 border border-white/10 text-[var(--text)]"
                      />
                      <button
                        onClick={() => {
                          updateContent((prev) => ({
                            ...prev,
                            contact: {
                              ...prev.contact,
                              socials: prev.contact.socials.filter((_, i) => i !== idx),
                            },
                          }));
                        }}
                        className="p-1 text-rose-400 hover:text-rose-300"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: THEME & SEO */}
          {activeTab === 'theme' && (
            <div className="space-y-6">
              {/* Theme Colors */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-[var(--secondary)] block mb-1">
                    Cosmic Theme Palette (Live CSS Variables)
                  </span>
                  <p className="text-[11px] text-[var(--muted)]">
                    Color adjustments take effect instantly across all 3D shaders, glass panels, gradients, and typography.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    { key: 'primary', label: 'Primary Brand / Violet', desc: '--primary' },
                    { key: 'secondary', label: 'Secondary / Neon Cyan', desc: '--secondary' },
                    { key: 'accent', label: 'Accent / Hot Pink', desc: '--accent' },
                    { key: 'bg', label: 'Deep Space Background', desc: '--bg' },
                    { key: 'text', label: 'Text / Heading Tone', desc: '--text' },
                  ].map(({ key, label, desc }) => {
                    const currentColor = content.theme[key as keyof typeof content.theme] || '#ffffff';
                    return (
                      <div key={key} className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-white/5">
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={currentColor}
                            onChange={(e) => {
                              const hex = e.target.value;
                              updateContent((prev) => ({
                                ...prev,
                                theme: { ...prev.theme, [key]: hex },
                              }));
                            }}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                          />
                          <div>
                            <div className="text-xs font-semibold text-[var(--text)]">{label}</div>
                            <div className="text-[10px] font-mono text-[var(--muted)]">{desc}</div>
                          </div>
                        </div>

                        <input
                          type="text"
                          value={currentColor}
                          onChange={(e) => {
                            const hex = e.target.value;
                            updateContent((prev) => ({
                              ...prev,
                              theme: { ...prev.theme, [key]: hex },
                            }));
                          }}
                          className="w-24 px-2 py-1 text-xs font-mono rounded bg-black/60 border border-white/10 text-[var(--text)] uppercase text-center"
                        />
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => {
                    updateContent((prev) => ({
                      ...prev,
                      theme: {
                        primary: '#7C3AED',
                        secondary: '#22D3EE',
                        accent: '#F472B6',
                        bg: '#05060F',
                        text: '#F8FAFC',
                      },
                    }));
                  }}
                  className="text-xs text-[var(--muted)] hover:text-[var(--secondary)] font-mono underline"
                >
                  Reset Palette to Original Defaults
                </button>
              </div>

              {/* SEO Tags */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-[var(--muted)] mb-1.5">
                    SEO Browser Page Title (&lt;title&gt;)
                  </label>
                  <input
                    type="text"
                    value={content.seo.pageTitle}
                    onChange={(e) => {
                      const pageTitle = e.target.value;
                      updateContent((prev) => ({
                        ...prev,
                        seo: { ...prev.seo, pageTitle },
                      }));
                    }}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-black/40 border border-white/10 text-[var(--text)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[var(--muted)] mb-1.5">
                    SEO Meta Description
                  </label>
                  <textarea
                    rows={3}
                    value={content.seo.metaDescription}
                    onChange={(e) => {
                      const metaDescription = e.target.value;
                      updateContent((prev) => ({
                        ...prev,
                        seo: { ...prev.seo, metaDescription },
                      }));
                    }}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-black/40 border border-white/10 text-[var(--text)]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
