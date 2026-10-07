'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/context/LanguageContext';

export default function ErrorState({ title, description, onRetry, className = '' }) {
  const { locale } = useLanguage();
  const isEn = locale === 'en';

  const defaultTitle = isEn ? 'We could not load this information.' : 'No pudimos cargar esta información.';
  const defaultDesc = isEn ? 'Please try again in a few moments.' : 'Intenta nuevamente en unos momentos.';
  const retryBtn = isEn ? 'Try again' : 'Reintentar';

  return (
    <div role="alert" className={`flex flex-col items-center rounded-3xl border border-rose-200 bg-rose-50/50 p-10 text-center ${className}`}>
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
        <AlertTriangle size={26} aria-hidden="true" />
      </div>
      <h2 className="font-serif text-xl font-bold text-navy-900">{title || defaultTitle}</h2>
      <p className="mt-2 max-w-md text-sm text-slate-600">{description || defaultDesc}</p>
      {onRetry && <Button className="mt-6" onClick={onRetry}>{retryBtn}</Button>}
    </div>
  );
}
