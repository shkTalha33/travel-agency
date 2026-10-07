'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Compass, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';
import MobileNav from './MobileNav';
import LanguageSwitcher from './LanguageSwitcher';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { MAIN_NAV } from '@/data/navigation';

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hash, setHash] = useState('');
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    const onHash = () => setHash(window.location.hash);
    onScroll(); onHash();
    window.addEventListener('scroll', onScroll);
    window.addEventListener('hashchange', onHash);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('hashchange', onHash); };
  }, []);

  useEffect(() => { setOpen(false); setHash(window.location.hash); }, [pathname]);

  const isActive = (href) => {
    if (href.includes('#')) return pathname === '/' && hash === `#${href.split('#')[1]}`;
    return href === '/' ? pathname === '/' && !hash : pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className={`sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-shadow duration-300 ${scrolled ? 'shadow-soft' : ''}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2.5 font-serif text-xl font-bold text-navy-900 tracking-tight">
          <img
            src="/logo.jpg"
            alt="Círculo Wingding Logo"
            className="h-9 w-9 rounded-xl object-cover shadow-sm border border-sand-200 group-hover:scale-105 transition-all"
          />
          <span className="group-hover:text-ocean-600 transition-colors">{t('brand', 'Círculo Wingding')}</span>
        </Link>

        {/* Center Nav Pills */}
        <nav className="hidden items-center gap-1 rounded-full border border-slate-200/80 bg-slate-100/90 p-1 backdrop-blur-md lg:flex" aria-label={t('nav.main')}>
          {MAIN_NAV.map((n) => {
            const active = isActive(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? 'page' : undefined}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-200 ${
                  active
                    ? 'bg-ocean-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-ocean-600 hover:bg-white/80'
                }`}
              >
                {t(`nav.${n.key}`)}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="hidden items-center gap-2.5 lg:flex">
          <LanguageSwitcher />
          {isAuthenticated ? (
            <Link href="/dashboard">
              <Button variant="primary" className="rounded-full px-4 py-2 text-xs font-bold shadow-soft">
                {t('auth.dashboard')}
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="rounded-full px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-navy-900 hover:bg-slate-100/80">
                  {t('auth.login')}
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" className="rounded-full px-4 py-2 text-xs font-bold shadow-sm hover:shadow-md transition-all">
                  <Sparkles size={13} className="shrink-0 text-white" />
                  <span>{t('auth.join')}</span>
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-1 lg:hidden">
          <LanguageSwitcher />
          <button
            className="rounded-xl p-2 text-navy-900 hover:bg-slate-100 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label={open ? t('auth.closeMenu') : t('auth.openMenu')}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      <MobileNav open={open} isAuthenticated={isAuthenticated} pathname={pathname} />
    </header>
  );
}
