import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { SITE_CONTENT, SiteContent } from '../content';

interface SiteContentContextType {
  content: SiteContent;
}

const SiteContentContext = createContext<SiteContentContextType>({
  content: SITE_CONTENT,
});

export const SiteContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const content = SITE_CONTENT;

  // Apply theme CSS variables
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

  return (
    <SiteContentContext.Provider value={{ content }}>
      {children}
    </SiteContentContext.Provider>
  );
};

export const useSiteContent = (): SiteContentContextType => {
  return useContext(SiteContentContext);
};
