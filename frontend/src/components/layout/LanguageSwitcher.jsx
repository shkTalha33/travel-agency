'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function LanguageSwitcher({ className = '' }) {
  const { locale, setLocale, isEn } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Language selection"
      className={`flex items-center p-0.5 rounded-xl bg-sand-100 border border-sand-200 text-xs font-bold select-none ${className}`}
    >
      <button
        type="button"
        onClick={() => setLocale('es')}
        className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
          !isEn
            ? 'bg-ocean-600 text-white font-bold shadow-xs'
            : 'text-navy-600 hover:text-navy-950'
        }`}
      >
        <span>ES</span>
      </button>
      <button
        type="button"
        onClick={() => setLocale('en')}
        className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
          isEn
            ? 'bg-ocean-600 text-white font-bold shadow-xs'
            : 'text-navy-600 hover:text-navy-950'
        }`}
      >
        <span>EN</span>
      </button>
    </div>
  );
}
