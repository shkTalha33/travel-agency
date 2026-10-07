'use client';

import React from 'react';
import Link from 'next/link';
import PublicShell from '@/components/layout/PublicShell';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/context/LanguageContext';

export default function NotFound() {
  const { locale, copy } = useLanguage();

  const isEn = locale === 'en';

  return (
    <PublicShell>
      <section className="mx-auto max-w-xl px-4 py-24 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-ocean-600">Error 404</p>
        <h1 className="mt-3 text-4xl font-bold text-navy-900">
          {isEn ? 'Page Not Found' : 'No encontramos esta página'}
        </h1>
        <p className="mt-3 text-slate-600">
          {isEn ? 'The link you followed may be broken or the page may have been moved.' : 'Es posible que el enlace haya cambiado o ya no esté disponible.'}
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/"><Button>{copy.nav?.home || 'Inicio'}</Button></Link>
          <Link href="/offers"><Button variant="secondary">{copy.common?.viewOffers || 'Ver ofertas'}</Button></Link>
        </div>
      </section>
    </PublicShell>
  );
}
