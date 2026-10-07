'use client';

import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { MAIN_NAV } from '@/data/navigation';
import { useLanguage } from '@/context/LanguageContext';

export default function MobileNav({ open, isAuthenticated, pathname }) {
  const { t } = useLanguage();
  return (
    <div id="mobile-nav" className={`overflow-hidden border-t border-slate-100 bg-sand-50 transition-all duration-300 lg:hidden ${open ? 'max-h-[32rem] opacity-100' : 'max-h-0 opacity-0'}`} aria-hidden={!open}>
      <nav className="flex flex-col px-4 py-3" aria-label={t('auth.openMenu')}>
        {MAIN_NAV.map((n) => (
          <Link key={n.href} href={n.href} tabIndex={open ? 0 : -1} aria-current={n.href === pathname ? 'page' : undefined} className={`rounded-lg px-3 py-3.5 text-base font-medium ${n.href === pathname ? 'bg-ocean-50 text-ocean-600' : 'text-slate-700 hover:bg-slate-50'}`}>
            {t(`nav.${n.key}`)}
          </Link>
        ))}
        <div className="grid grid-cols-2 gap-2 pt-3">
          {isAuthenticated ? (
            <Link href="/dashboard" tabIndex={open ? 0 : -1} className="col-span-2"><Button size="lg" className="w-full">{t('auth.dashboard')}</Button></Link>
          ) : (
            <>
              <Link href="/login" tabIndex={open ? 0 : -1}><Button variant="secondary" size="lg" className="w-full">{t('auth.login')}</Button></Link>
              <Link href="/register" tabIndex={open ? 0 : -1}><Button variant="gold" size="lg" className="w-full">{t('auth.join')}</Button></Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
