'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface SiteData {
  content: Record<string, string>;
  articles: any[];
  testimonials: any[];
  portfolio: any[];
  media: any[];
  leads?: any[];
  faqs?: any[];
  services?: any[];
}

interface ContentContextType {
  data: SiteData;
  loading: boolean;
  locale: 'ar' | 'en';
  setLocale: (l: 'ar' | 'en') => void;
  t: (key: string, enVal?: string) => string;
  refreshData: () => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children, initialLocale = 'ar' }: { children: React.ReactNode; initialLocale?: 'ar' | 'en' }) {
  const [data, setData] = useState<SiteData>({
    content: {},
    articles: [],
    testimonials: [],
    portfolio: [],
    media: [],
    leads: [],
    faqs: [],
    services: [],
  });
  const [loading, setLoading] = useState(true);
  const [locale, setLocale] = useState<'ar' | 'en'>(initialLocale);

  const refreshData = async () => {
    try {
      const res = await fetch('/api/content');
      const json = await res.json();
      if (json.status === 'success') {
        setData(json);
      }
    } catch (e) {
      console.error('Failed to load content context:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isEnglish = window.location.pathname.startsWith('/en') || window.location.pathname.includes('/en/');
      const currentLocale = isEnglish ? 'en' : 'ar';
      setLocale(currentLocale);
      document.documentElement.lang = currentLocale;
      document.documentElement.dir = currentLocale === 'ar' ? 'rtl' : 'ltr';
    }
  }, [locale]);

  const t = (key: string, enVal?: string): string => {
    const keyWithLocale = `${key}_${locale}`;
    if (data.content[keyWithLocale]) return data.content[keyWithLocale];
    if (data.content[key]) return data.content[key];
    if (locale === 'en' && enVal !== undefined) return enVal;
    return '';
  };

  const primaryColor = data.content['primary_color'] || '#00daf3';
  const secondaryColor = data.content['secondary_color'] || '#00e3fd';
  const bgColor = data.content['bg_color'] || '#011230';
  const surfaceColor = data.content['surface_color'] || '#0e1f3d';
  const fontAr = data.content['font_family_ar'] || 'Tajawal';
  const fontEn = data.content['font_family_en'] || 'Plus Jakarta Sans';

  const styleHtml = `
    :root {
      --primary-color: ${primaryColor};
      --secondary-color: ${secondaryColor};
      --bg-color: ${bgColor};
      --surface-color: ${surfaceColor};
      --font-family-ar: '${fontAr}', sans-serif;
      --font-family-en: '${fontEn}', sans-serif;
      --font-family: ${locale === 'ar' ? `'${fontAr}', sans-serif` : `'${fontEn}', sans-serif`};
    }
    body {
      background-color: var(--bg-color) !important;
      color: #ffffff;
      font-family: var(--font-family) !important;
      transition: background-color 0.5s ease;
    }
  `;

  return (
    <ContentContext.Provider value={{ data, loading, locale, setLocale, t, refreshData }}>
      <style dangerouslySetInnerHTML={{ __html: styleHtml }} />
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) throw new Error('useContent must be used within ContentProvider');
  return context;
}
