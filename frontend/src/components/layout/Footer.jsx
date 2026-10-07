'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { FOOTER_COLUMNS } from '@/data/navigation';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-sand-200/80 bg-navy-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-5 lg:px-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5 font-serif text-2xl font-bold text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-400 text-navy-950 shadow-md">
              <Compass size={20} aria-hidden="true" />
            </span>
            {t('brand')}
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
            {t('footer.blurb')}
          </p>
          <div className="mt-6 flex items-center gap-3 text-xs text-slate-400" aria-label={t('footer.social')}>
            <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 transition-colors hover:border-gold-400 hover:text-gold-300 cursor-pointer">
              <Instagram size={14} /> Instagram
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 transition-colors hover:border-gold-400 hover:text-gold-300 cursor-pointer">
              <Facebook size={14} /> Facebook
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 transition-colors hover:border-gold-400 hover:text-gold-300 cursor-pointer">
              <MessageCircle size={14} /> WhatsApp
            </span>
          </div>
        </div>
        {FOOTER_COLUMNS.map((c) => (
          <nav key={c.titleKey} aria-label={t(`footer.${c.titleKey}`)}>
            <h2 className="mb-4 font-serif text-base font-bold text-white tracking-wide">{t(`footer.${c.titleKey}`)}</h2>
            <ul className="space-y-3">
              {c.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-slate-400 transition-colors hover:text-gold-400">
                    {t(l.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} {t('brand')}. {t('footer.rights')}
      </div>
    </footer>
  );
}
