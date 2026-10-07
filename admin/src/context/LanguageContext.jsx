'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import enTranslations from '@/locales/en.json';
import espTranslations from '@/locales/esp.json';

const LanguageContext = createContext(null);
const STORAGE_KEY = 'admin_language_locale';

const translations = {
  en: enTranslations,
  es: espTranslations,
  esp: espTranslations,
};

function getNestedValue(obj, path) {
  if (!obj || !path) return null;
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : null), obj);
}

export function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState('es'); // Default to Spanish for Caribbean platform

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'es' || saved === 'esp') {
        setLocaleState(saved === 'esp' ? 'es' : saved);
      }
    } catch (_) {
      /* ignore */
    }
  }, []);

  const setLocale = useCallback((newLocale) => {
    const validLocale = newLocale === 'en' ? 'en' : 'es';
    setLocaleState(validLocale);
    try {
      localStorage.setItem(STORAGE_KEY, validLocale);
    } catch (_) {
      /* ignore */
    }
  }, []);

  const t = useCallback(
    (path, fallback) => {
      const currentDict = translations[locale] || translations.es;
      const val = getNestedValue(currentDict, path);
      if (val !== null && val !== undefined) return val;

      // Fallback to Spanish or English dictionary
      const fallbackVal = getNestedValue(translations.es, path) || getNestedValue(translations.en, path);
      return fallbackVal || fallback || path;
    },
    [locale]
  );

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t,
      isEn: locale === 'en',
      isEs: locale === 'es' || locale === 'esp',
      messages: translations[locale] || translations.es,
    }),
    [locale, setLocale, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
