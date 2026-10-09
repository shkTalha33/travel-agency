'use client';

import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import { MAIN_NAV } from '@/data/navigation';
import { useLanguage } from '@/context/LanguageContext';

export default function MobileNav({ open, isAuthenticated, currentUser, logout, pathname }) {
  const { t } = useLanguage();
  return (
    <div id="mobile-nav" className={`overflow-hidden border-t border-slate-100 bg-sand-50 transition-all duration-300 lg:hidden ${open ? 'max-h-[36rem] opacity-100' : 'max-h-0 opacity-0'}`} aria-hidden={!open}>
      <nav className="flex flex-col px-4 py-3" aria-label={t('auth.openMenu')}>
        {isAuthenticated && currentUser && (
          <div className="flex items-center gap-3 p-3 mb-2 rounded-xl bg-white border border-slate-200/80 shadow-xs">
            <Avatar
              src={currentUser.avatar}
              name={currentUser.name || currentUser.fullname}
              size="sm"
              className="ring-2 ring-ocean-500/30"
            />
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-navy-950 truncate">
                {currentUser.name || currentUser.fullname}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {currentUser.email}
              </p>
            </div>
          </div>
        )}
        {MAIN_NAV.map((n) => (
          <Link key={n.href} href={n.href} tabIndex={open ? 0 : -1} aria-current={n.href === pathname ? 'page' : undefined} className={`rounded-lg px-3 py-3 text-sm font-medium ${n.href === pathname ? 'bg-ocean-50 text-ocean-600' : 'text-slate-700 hover:bg-slate-50'}`}>
            {t(`nav.${n.key}`)}
          </Link>
        ))}
        <div className="pt-3 border-t border-slate-200/60 mt-2 flex flex-col gap-2">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" tabIndex={open ? 0 : -1}>
                <Button size="md" className="w-full">
                  {t('auth.dashboard')}
                </Button>
              </Link>
              <Link
                href="/dashboard/profile"
                tabIndex={open ? 0 : -1}
                className="w-full py-2 px-3 text-center text-xs font-semibold text-slate-700 hover:bg-white rounded-lg border border-slate-200"
              >
                {t('auth.profile', 'Mi Perfil')}
              </Link>
              <button
                type="button"
                onClick={() => logout?.()}
                className="w-full py-2 text-center text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
              >
                {t('auth.logout')}
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link href="/login" tabIndex={open ? 0 : -1}><Button variant="secondary" size="lg" className="w-full">{t('auth.login')}</Button></Link>
              <Link href="/register" tabIndex={open ? 0 : -1}><Button variant="primary" size="lg" className="w-full">{t('auth.join')}</Button></Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
