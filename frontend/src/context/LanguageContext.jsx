'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { FAQ_I18N, messages } from '@/i18n/messages';

const LanguageContext = createContext(null);
const STORAGE_KEY = 'vd_locale';

function getPath(obj, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

export function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState('en');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'es') {
        setLocaleState(saved);
      }
    } catch (_) { /* ignore */ }
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const setLocale = useCallback((next) => {
    const value = next === 'es' ? 'es' : 'en';
    setLocaleState(value);
    try { localStorage.setItem(STORAGE_KEY, value); } catch (_) { /* ignore */ }
  }, []);

  const t = useCallback((path) => {
    const value = getPath(messages[locale], path);
    if (value == null) return getPath(messages.en, path) ?? path;
    return value;
  }, [locale]);

  const value = useMemo(() => ({
    locale,
    setLocale,
    t,
    copy: messages[locale] || messages.en,
    faqs: FAQ_I18N[locale] || FAQ_I18N.en,
  }), [locale, setLocale, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
