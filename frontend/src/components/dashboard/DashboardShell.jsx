'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Network, Coins, Gift, User, Compass, LogOut, Menu, X, Plane } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import Dropdown from '@/components/ui/Dropdown';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { PANEL_NAV } from '@/data/navigation';

const ICONS = { dashboard: LayoutDashboard, offers: Plane, network: Network, points: Coins, redeem: Gift, profile: User };

const DEMO_IDS = ['member', 'active_member', 'ambassador', 'elite_ambassador'];

export default function DashboardShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, currentMembership, isAuthenticated, ready, logout, switchDemoAccount } = useAuth();
  const { t, copy } = useLanguage();
  const [open, setOpen] = useState(false);

  useEffect(() => { if (ready && !isAuthenticated) router.replace('/login'); }, [ready, isAuthenticated, router]);
  useEffect(() => setOpen(false), [pathname]);

  if (!ready || !isAuthenticated || !currentUser) return null;

  const doLogout = () => { logout(); router.push('/'); };

  const sidebar = (
    <div className="flex h-full flex-col">
      <Link href="/" className="flex h-16 items-center gap-2 border-b border-white/10 px-5 font-serif text-lg font-bold text-white">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-500 text-navy-950"><Compass size={18} aria-hidden="true" /></span>
        {t('brand')}
      </Link>
      <nav className="flex-1 space-y-1 p-3" aria-label={t('panel.memberNav')}>
        {PANEL_NAV.map(({ key, href, icon }) => {
          const Icon = ICONS[icon];
          const active = pathname === href;
          return (
            <Link key={href} href={href} aria-current={active ? 'page' : undefined} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${active ? 'bg-white/10 text-gold-400' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}>
              <Icon size={18} aria-hidden="true" />{t(`panel.${key}`)}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-3">
        <p className="mb-2 px-3 text-[11px] uppercase tracking-wider text-slate-400">{t('panel.demo')}</p>
        <div className="mb-3 grid grid-cols-2 gap-1.5">
          {DEMO_IDS.map((k) => (
            <button key={k} onClick={() => switchDemoAccount(k)} aria-pressed={currentUser.membershipId === k} className={`rounded-lg border px-2 py-1.5 text-[11px] transition-colors ${currentUser.membershipId === k ? 'border-gold-400 text-gold-400' : 'border-white/10 text-slate-300 hover:text-white'}`}>{copy.levels[k].name}</button>
          ))}
        </div>
        <button onClick={doLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-300 hover:bg-white/5">
          <LogOut size={18} aria-hidden="true" />{t('auth.logout')}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-sand-50 lg:flex">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 bg-navy-900 lg:block">{sidebar}</aside>

      {open && <div className="fixed inset-0 z-40 bg-navy-950/60 animate-fade-in lg:hidden" onClick={() => setOpen(false)} aria-hidden="true" />}
      <aside id="panel-drawer" aria-hidden={!open} className={`fixed inset-y-0 left-0 z-50 w-72 bg-navy-900 transition-transform duration-300 lg:hidden ${open ? 'translate-x-0' : '-translate-x-full'}`}>{open && sidebar}</aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-sand-200 bg-sand-50/90 px-4 backdrop-blur sm:px-8">
          <button className="-ml-2 rounded-lg p-2 hover:bg-slate-100 lg:hidden" onClick={() => setOpen(!open)} aria-label={open ? t('auth.closeMenu') : t('auth.openMenu')} aria-expanded={open} aria-controls="panel-drawer">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
          <p className="hidden text-sm text-slate-500 lg:block">{t('auth.hello')} <strong className="text-navy-900">{currentUser.name}</strong></p>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Badge variant={currentMembership.id}>{copy.levels[currentMembership.id]?.name || currentMembership.name}</Badge>
            <Dropdown label={t('auth.userMenu')} trigger={<Avatar src={currentUser.avatar} name={currentUser.name} size="sm" />} items={[{ label: t('auth.profile'), href: '/dashboard/profile' }, { label: t('auth.publicSite'), href: '/' }, { label: t('auth.logout'), onClick: doLogout }]} />
          </div>
        </header>
        <main id="contenido" tabIndex={-1} className="max-w-6xl p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
