'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Palmtree,
  Users,
  Coins,
  Gift,
  User,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import Dropdown from '@/components/ui/Dropdown';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';

export default function DashboardShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, currentMembership, isAuthenticated, ready, logout, refreshUser } = useAuth();
  const { t, copy, isEn } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => { 
    if (ready && !isAuthenticated) {
      router.replace('/login'); 
    }
  }, [ready, isAuthenticated, router]);

  // Run backend authentication verification once per route transition
  const lastCheckedPath = useRef('');
  useEffect(() => {
    if (ready && isAuthenticated && typeof refreshUser === 'function') {
      if (lastCheckedPath.current !== pathname) {
        lastCheckedPath.current = pathname;
        refreshUser().then((user) => {
          if (!user) {
            router.replace('/login');
          }
        });
      }
    }
  }, [pathname, ready, isAuthenticated, refreshUser, router]);

  useEffect(() => setMobileMenuOpen(false), [pathname]);

  if (!ready || !isAuthenticated || !currentUser) return null;

  const doLogout = () => { 
    logout(); 
    router.push('/login'); 
  };

  const membershipLabel = copy.levels?.[currentMembership?.id]?.name || currentMembership?.name || (isEn ? 'Member' : 'Miembro');

  const NAV_ITEMS = [
    { name: isEn ? 'Dashboard' : 'Panel General', href: '/dashboard', icon: LayoutDashboard },
    { name: isEn ? 'Travel Offers' : 'Ofertas de Viaje', href: '/dashboard/offers', icon: Palmtree },
    { name: isEn ? 'My Referral Network' : 'Mi Red de Referidos', href: '/dashboard/network', icon: Users },
    { name: isEn ? 'My Points Ledger' : 'Historial de Puntos', href: '/dashboard/points', icon: Coins },
    { name: isEn ? 'Redeem Points' : 'Redimir Puntos', href: '/dashboard/redeem', icon: Gift },
    { name: isEn ? 'My Profile & Settings' : 'Mi Perfil & Ajustes', href: '/dashboard/profile', icon: User },
  ];

  const currentNav = NAV_ITEMS.find((item) => pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href)));
  const pageTitle = currentNav?.name || (pathname.startsWith('/dashboard/offers') ? (isEn ? 'Travel Offers' : 'Ofertas de Viaje') : (isEn ? 'Dashboard' : 'Panel'));

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-navy-950 text-white">
      <div>
        {/* Brand Header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-navy-850/80 bg-navy-900/50">
          <div className="flex items-center gap-3">
            <img
              src="/logo.jpg"
              alt="Círculo Wingding Logo"
              className="w-10 h-10 rounded-xl object-cover shadow-lg border border-ocean-500/30"
            />
            <div>
              <span className="text-xs font-bold tracking-[0.2em] text-ocean-300 uppercase block">
                {isEn ? 'MEMBER PORTAL' : 'PORTAL MIEMBROS'}
              </span>
              <h1 className="text-sm font-serif font-bold text-white tracking-wide">Círculo Wingding</h1>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden text-sand-300 hover:text-white p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Member User Profile Snippet */}
        <div className="px-6 py-4 border-b border-navy-850/60 bg-navy-950/80 flex items-center gap-3">
          <div className="relative shrink-0">
            <Avatar
              src={currentUser?.avatar}
              name={currentUser?.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-ocean-500/50"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-navy-950"></span>
          </div>
          <div className="overflow-hidden">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-bold text-white truncate max-w-[130px]">{currentUser?.name}</p>
              <ShieldCheck className="w-3.5 h-3.5 text-ocean-400 shrink-0" />
            </div>
            <p className="text-[11px] text-ocean-300 tracking-wider uppercase font-semibold">
              {membershipLabel}
            </p>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="overflow-y-auto px-4 py-4 space-y-1.5">
          <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-sand-400/60 mb-2">
            {isEn ? 'MAIN MODULES' : 'MÓDULOS PRINCIPALES'}
          </p>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-ocean-600/30 to-ocean-600/10 text-white font-bold border border-ocean-500/40 shadow-sm'
                    : 'text-sand-300 hover:text-white hover:bg-navy-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-ocean-300' : 'text-sand-400 group-hover:text-ocean-300'
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-ocean-300 animate-pulse" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-navy-850/80 bg-navy-900/40">
        <button
          type="button"
          onClick={doLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-950/50 border border-rose-900/40 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>{isEn ? 'Sign Out' : 'Cerrar Sesión'}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-sand-50 text-navy-950 font-sans">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-navy-950/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-navy-950 text-white flex flex-col transition-transform duration-300 ease-in-out border-r border-navy-850 shadow-2xl lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Top Bar Header */}
        <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur-md border-b border-sand-200 px-6 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-navy-900 hover:bg-sand-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2 text-xs text-navy-600 font-medium">
              <span className="text-navy-950 font-bold">{isEn ? 'Member Portal' : 'Portal Miembros'}</span>
              <ChevronRight className="w-3 h-3 text-navy-400" />
              <span className="text-ocean-700 font-semibold">{pageTitle}</span>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Badge variant={currentMembership.id}>{membershipLabel}</Badge>
            <Dropdown
              label={t('auth.userMenu')}
              trigger={<Avatar src={currentUser.avatar} name={currentUser.name} size="sm" />}
              items={[
                { label: isEn ? 'My Profile' : 'Mi Perfil', href: '/dashboard/profile' },
                { label: isEn ? 'Sign Out' : 'Cerrar Sesión', onClick: doLogout },
              ]}
            />
          </div>
        </header>

        {/* Page Main Content */}
        <main id="contenido" tabIndex={-1} className="max-w-7xl w-full mx-auto p-4 sm:p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
