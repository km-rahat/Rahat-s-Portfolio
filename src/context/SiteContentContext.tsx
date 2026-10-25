import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { SITE_CONTENT, SiteContent, ENABLE_EDITOR } from '../content';

const STORAGE_KEY = 'site_portfolio_content_v2';

interface SiteContentContextType {
  content: SiteContent;
  updateContent: (updater: SiteContent | ((prev: SiteContent) => SiteContent)) => void;
  isEditorOpen: boolean;
  setIsEditorOpen: (open: boolean) => void;
  openEditor: () => void;
  closeEditor: () => void;
  hasUnsavedChanges: boolean;
  saveChanges: () => void;
  resetDefaults: () => void;
  exportJson: () => void;
  importJson: (jsonString: string) => { success: boolean; error?: string };
  enableEditor: boolean;
}

const SiteContentContext = createContext<SiteContentContextType | null>(null);

export const SiteContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // If ENABLE_EDITOR is false, strictly never read from localStorage
  const [content, setContent] = useState<SiteContent>(() => {
    if (!ENABLE_EDITOR) {
      return SITE_CONTENT;
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);

        // Migration: If old localStorage still has single timeline array, split it by type
        if (parsed.timeline && Array.isArray(parsed.timeline) && (!parsed.experience || !parsed.education)) {
          const expItems = parsed.timeline
            .filter((item: any) => item.type === 'experience' || !item.type)
            .map((item: any, i: number) => ({
              id: item.id || `exp-migrated-${i}`,
              period: item.period || '',
              title: item.title || item.role || '',
              place: item.place || item.organization || '',
              description: item.description || '',
            }));
          const eduItems = parsed.timeline
            .filter((item: any) => item.type === 'education')
            .map((item: any, i: number) => ({
              id: item.id || `edu-migrated-${i}`,
              period: item.period || '',
              title: item.title || item.role || '',
              place: item.place || item.organization || '',
              description: item.description || '',
            }));
          parsed.experience = expItems.length ? expItems : SITE_CONTENT.experience;
          parsed.education = eduItems.length ? eduItems : SITE_CONTENT.education;
        }

        // Deep merge with default SITE_CONTENT so any newly added keys are preserved
        return {
          ...SITE_CONTENT,
          ...parsed,
          profile: { ...SITE_CONTENT.profile, ...(parsed.profile || {}) },
          hero: { ...SITE_CONTENT.hero, ...(parsed.hero || {}) },
          about: { ...SITE_CONTENT.about, ...(parsed.about || {}) },
          skills: parsed.skills?.length ? parsed.skills : SITE_CONTENT.skills,
          projects: parsed.projects?.length ? parsed.projects : SITE_CONTENT.projects,
          experienceSection: { ...SITE_CONTENT.experienceSection, ...(parsed.experienceSection || {}) },
          experience: parsed.experience?.length ? parsed.experience : SITE_CONTENT.experience,
          educationSection: { ...SITE_CONTENT.educationSection, ...(parsed.educationSection || {}) },
          education: parsed.education?.length ? parsed.education : SITE_CONTENT.education,
          contact: { ...SITE_CONTENT.contact, ...(parsed.contact || {}) },
          seo: { ...SITE_CONTENT.seo, ...(parsed.seo || {}) },
          theme: { ...SITE_CONTENT.theme, ...(parsed.theme || {}) },
        };
      }
    } catch {
      // Fallback
    }
    return SITE_CONTENT;
  });

  const [lastSavedContent, setLastSavedContent] = useState<SiteContent>(() => content);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const hasUnsavedChanges = ENABLE_EDITOR && JSON.stringify(content) !== JSON.stringify(lastSavedContent);

  // Apply theme CSS variables whenever content.theme changes
  useEffect(() => {
    if (!content.theme) return;
    const root = document.documentElement;
    if (content.theme.primary) root.style.setProperty('--primary', content.theme.primary);
    if (content.theme.secondary) root.style.setProperty('--secondary', content.theme.secondary);
    if (content.theme.accent) root.style.setProperty('--accent', content.theme.accent);
    if (content.theme.bg) root.style.setProperty('--bg', content.theme.bg);
    if (content.theme.text) root.style.setProperty('--text', content.theme.text);
  }, [content.theme]);

  // Apply SEO Page Title and Meta Description
  useEffect(() => {
    if (content.seo?.pageTitle) {
      document.title = content.seo.pageTitle;
    }
    if (content.seo?.metaDescription) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) {
        meta.setAttribute('content', content.seo.metaDescription);
      }
    }
  }, [content.seo]);

  const updateContent = useCallback((updater: SiteContent | ((prev: SiteContent) => SiteContent)) => {
    if (!ENABLE_EDITOR) return;
    setContent((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      return next;
    });
  }, []);

  const saveChanges = useCallback(() => {
    if (!ENABLE_EDITOR) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
      setLastSavedContent(content);
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [content]);

  const resetDefaults = useCallback(() => {
    if (!ENABLE_EDITOR) return;
    try {
      localStorage.removeItem(STORAGE_KEY);
      setContent(SITE_CONTENT);
      setLastSavedContent(SITE_CONTENT);
    } catch {
      // Ignore
    }
  }, []);

  const exportJson = useCallback(() => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(content, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `portfolio-content-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [content]);

  const importJson = useCallback((jsonString: string) => {
    if (!ENABLE_EDITOR) return { success: false, error: 'Editor is disabled' };
    try {
      const parsed = JSON.parse(jsonString);

      // Support migration if importing an older exported backup that has single timeline
      if (parsed.timeline && Array.isArray(parsed.timeline) && (!parsed.experience || !parsed.education)) {
        parsed.experience = parsed.timeline
          .filter((item: any) => item.type === 'experience' || !item.type)
          .map((item: any, i: number) => ({
            id: item.id || `exp-${i}`,
            period: item.period || '',
            title: item.title || item.role || '',
            place: item.place || item.organization || '',
            description: item.description || '',
          }));
        parsed.education = parsed.timeline
          .filter((item: any) => item.type === 'education')
          .map((item: any, i: number) => ({
            id: item.id || `edu-${i}`,
            period: item.period || '',
            title: item.title || item.role || '',
            place: item.place || item.organization || '',
            description: item.description || '',
          }));
      }

      if (!parsed.profile || !parsed.hero || !parsed.skills || !parsed.projects) {
        return { success: false, error: 'Invalid portfolio content structure.' };
      }
      setContent((prev) => ({
        ...prev,
        ...parsed,
        experienceSection: { ...prev.experienceSection, ...(parsed.experienceSection || {}) },
        educationSection: { ...prev.educationSection, ...(parsed.educationSection || {}) },
      }));
      return { success: true };
    } catch {
      return { success: false, error: 'Invalid JSON file format.' };
    }
  }, []);

  const openEditor = useCallback(() => {
    if (ENABLE_EDITOR) {
      setIsEditorOpen(true);
    }
  }, []);

  const closeEditor = useCallback(() => {
    setIsEditorOpen(false);
  }, []);

  return (
    <SiteContentContext.Provider
      value={{
        content,
        updateContent,
        isEditorOpen,
        setIsEditorOpen,
        openEditor,
        closeEditor,
        hasUnsavedChanges,
        saveChanges,
        resetDefaults,
        exportJson,
        importJson,
        enableEditor: ENABLE_EDITOR,
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
};

export function useSiteContent(): SiteContentContextType {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error('useSiteContent must be used within a SiteContentProvider');
  }
  return context;
}
