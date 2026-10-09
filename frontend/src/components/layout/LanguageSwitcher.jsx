'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function LanguageSwitcher({ className = '' }) {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div
      role="group"
      aria-label={t('language.label')}
      className={`inline-flex rounded-full border border-sand-200 bg-sand-50 p-0.5 text-xs font-semibold ${className}`}
    >
      {['es', 'en'].map((code) => {
        const active = locale === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            aria-pressed={active}
            className={`rounded-full px-2.5 py-1 text-xs font-bold transition-all duration-200 cursor-pointer select-none ${
              active
                ? 'bg-ocean-600 text-white shadow-soft'
                : 'text-slate-500 hover:text-navy-900'
            }`}
          >
            {t(`language.${code}`)}
          </button>
        );
      })}
    </div>
  );
}
