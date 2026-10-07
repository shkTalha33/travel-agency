'use client';

import React from 'react';
import PublicShell from '@/components/layout/PublicShell';
import { AccentRule } from '@/components/common/Linework';
import { ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function LegalPage({ title, children }) {
  const { copy } = useLanguage();
  const leg = copy.legal || {};

  return (
    <PublicShell>
      <section className="bg-sand-50 py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-sand-200/90 bg-white p-8 shadow-card sm:p-14">
            <div className="flex items-center gap-2 text-ocean-700">
              <ShieldCheck size={18} aria-hidden="true" />
              <span className="text-xs font-bold uppercase tracking-widest text-ocean-700">
                {leg.docOfficial || 'Documento Oficial & Legal'}
              </span>
            </div>
            <h1 className="mt-3 font-serif text-3xl font-bold text-navy-900 sm:text-4xl">{title}</h1>
            <AccentRule className="mt-4 mb-8" />
            <div className="prose prose-slate max-w-none space-y-6 text-sm leading-relaxed text-slate-700 sm:text-base">
              {children}
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
