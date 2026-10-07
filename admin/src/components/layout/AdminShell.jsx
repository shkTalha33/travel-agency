'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { adminApi } from '@/lib/apiClient';
import {
  LayoutDashboard,
  Palmtree,
  HelpCircle,
  Users,
  Award,
  Coins,
  Gift,
  Mail,
  LogOut,
  Menu,
  X,
  Compass,
  ChevronRight,
  ShieldCheck,
  Bell,
  Globe,
  CheckCheck,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export default function AdminShell({ children, title, subtitle, actionButton }) {
  const { admin, logout, isLoading } = useAdminAuth();
  const { locale, setLocale, t, isEn } = useLanguage();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef(null);

  // Dynamic Navigation Items with Translations
  const NAV_ITEMS = [
    { name: t('nav.dashboard', 'Panel General'), href: '/', icon: LayoutDashboard },
    { name: t('nav.offers', 'Ofertas de Viaje'), href: '/offers', icon: Palmtree },
    { name: t('nav.faqs', 'Preguntas Frecuentes'), href: '/faqs', icon: HelpCircle },
    { name: t('nav.users', 'Gestión de Usuarios'), href: '/users', icon: Users },
    { name: t('nav.memberships', 'Niveles de Membresía'), href: '/memberships', icon: Award },
    { name: t('nav.points', 'Asignar Puntos / Ventas'), href: '/points', icon: Coins },
    { name: t('nav.redemptions', 'Redención de Puntos'), href: '/redemptions', icon: Gift },
    { name: t('nav.contacts', 'Bandeja de Contactos'), href: '/contacts', icon: Mail },
  ];

  // Fetch live notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await adminApi.getDashboardStats();
        if (res.data) {
          const stats = res.data;
          const items = [];

          if (stats.counts?.pendingRedemptions > 0) {
            items.push({
              id: 'redemptions',
              title: isEn ? 'Pending Redemptions' : 'Redenciones Pendientes',
              message: isEn
                ? `${stats.counts.pendingRedemptions} point redemption requests awaiting review.`
                : `${stats.counts.pendingRedemptions} solicitudes de redención de puntos pendientes de aprobación.`,
              href: '/redemptions',
              type: 'urgent',
              time: isEn ? 'Action needed' : 'Acción requerida',
            });
          }

          if (stats.counts?.newContacts > 0) {
            items.push({
              id: 'contacts',
              title: isEn ? 'New Contact Messages' : 'Nuevas Consultas de Contacto',
              message: isEn
                ? `${stats.counts.newContacts} new customer messages in the inbox.`
                : `${stats.counts.newContacts} nuevos mensajes de viajeros en la bandeja de entrada.`,
              href: '/contacts',
              type: 'info',
              time: isEn ? 'New' : 'Nuevo',
            });
          }

          if (stats.recentUsers && stats.recentUsers.length > 0) {
            items.push({
              id: 'users',
              title: isEn ? 'Recent Member Signups' : 'Nuevos Miembros Registrados',
              message: isEn
                ? `${stats.recentUsers[0].fullname} registered recently.`
                : `${stats.recentUsers[0].fullname} se registró recientemente en la plataforma.`,
              href: '/users',
              type: 'success',
              time: new Date(stats.recentUsers[0].createdAt).toLocaleDateString(),
            });
          }

          setNotifications(items);
          setUnreadCount(items.length);
        }
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };

    fetchNotifications();
  }, [isEn, pathname]);

  // Click outside to close notification dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotificationOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-sand-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs uppercase tracking-widest text-navy-800 font-semibold">
            {t('common.loading', 'Cargando Panel Administrativo...')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-sand-50 text-navy-950 font-sans">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-navy-950/70 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-30 w-72 bg-navy-950 text-white flex flex-col transition-transform duration-300 ease-in-out border-r border-navy-850 shadow-2xl lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-navy-850/80 bg-navy-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-gold-600 via-gold-500 to-gold-400 flex items-center justify-center shadow-lg shadow-gold-500/20 text-navy-950">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold tracking-[0.2em] text-gold-400 uppercase block">
                {t('common.masterPortal', 'Portal Máster')}
              </span>
              <h1 className="text-sm font-serif font-bold text-white tracking-wide">Viajes Dominicana</h1>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden text-sand-300 hover:text-white p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Admin User Profile Snippet */}
        <div className="px-6 py-4 border-b border-navy-850/60 bg-navy-950/80 flex items-center gap-3">
          <div className="relative">
            <img
              src={admin?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
              alt={admin?.fullname || 'Admin'}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-gold-500/50"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-navy-950"></span>
          </div>
          <div className="overflow-hidden">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-bold text-white truncate max-w-[130px]">{admin?.fullname || 'Administrador'}</p>
              <ShieldCheck className="w-3.5 h-3.5 text-gold-400 shrink-0" />
            </div>
            <p className="text-[11px] text-gold-400/90 tracking-wider uppercase font-semibold">
              {t('common.superAdmin', 'Super Admin')}
            </p>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5">
          <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-sand-400/60 mb-2">
            {t('nav.mainModules', 'Módulos Principales')}
          </p>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-gold-500/20 to-gold-500/5 text-gold-400 border border-gold-500/30 shadow-sm'
                    : 'text-sand-300 hover:text-white hover:bg-navy-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-gold-400' : 'text-sand-400 group-hover:text-gold-400'
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-gold-400 animate-pulse" />}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-navy-850/80 bg-navy-900/40">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-950/50 border border-rose-900/40 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('common.logout', 'Cerrar Sesión')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Top Bar Header */}
        <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur-md border-b border-sand-200 px-6 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-navy-900 hover:bg-sand-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2 text-xs text-navy-600 font-medium">
              <span className="text-navy-950 font-bold">{t('common.admin', 'Admin')}</span>
              <ChevronRight className="w-3 h-3 text-navy-400" />
              <span className="text-ocean-700 font-semibold">{title || t('nav.dashboard', 'Panel')}</span>
            </div>
          </div>

          {/* Right Header: Language Switcher & Notifications */}
          <div className="flex items-center gap-3">
            {/* Language Switcher (EN / ES) */}
            <div className="flex items-center p-0.5 rounded-xl bg-sand-100 border border-sand-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setLocale('es')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  !isEn
                    ? 'bg-navy-950 text-gold-400 shadow-xs'
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
                    ? 'bg-navy-950 text-gold-400 shadow-xs'
                    : 'text-navy-600 hover:text-navy-950'
                }`}
              >
                <span>EN</span>
              </button>
            </div>

            {/* Notification Bell with Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="relative p-2 rounded-xl text-navy-700 hover:text-navy-950 hover:bg-sand-100 border border-sand-200 transition-colors cursor-pointer"
                title={t('notifications.title', 'Notificaciones del Sistema')}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
                )}
              </button>

              {/* Notification Popover Dropdown */}
              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-sand-200 shadow-2xl z-50 overflow-hidden animate-scale-in">
                  <div className="p-4 border-b border-sand-200 bg-sand-50/70 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-gold-600" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-navy-950">
                        {t('notifications.title', 'Notificaciones del Sistema')}
                      </h4>
                    </div>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                        {unreadCount} {isEn ? 'Pending' : 'Pendientes'}
                      </span>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-sand-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-navy-500">
                        <CheckCheck className="w-8 h-8 text-emerald-600 mx-auto mb-2 opacity-60" />
                        <p className="font-semibold text-navy-800">
                          {t('notifications.noNotifications', 'No hay nuevas notificaciones')}
                        </p>
                        <p className="text-[11px] text-navy-400 mt-0.5">
                          {isEn ? 'All requests are up to date' : 'Todas las solicitudes están al día'}
                        </p>
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <Link
                          key={n.id}
                          href={n.href}
                          onClick={() => setNotificationOpen(false)}
                          className="p-3.5 hover:bg-sand-50 block transition-colors group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-bold text-navy-950 group-hover:text-gold-700">
                              {n.title}
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-sand-100 text-navy-600 shrink-0">
                              {n.time}
                            </span>
                          </div>
                          <p className="text-xs text-navy-600 mt-1 leading-relaxed">{n.message}</p>
                        </Link>
                      ))
                    )}
                  </div>

                  {notifications.length > 0 && (
                    <div className="p-2.5 bg-sand-50 border-t border-sand-200 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setUnreadCount(0);
                          setNotificationOpen(false);
                        }}
                        className="text-[11px] font-bold text-ocean-700 hover:text-ocean-900 transition-colors cursor-pointer"
                      >
                        {t('notifications.markAllRead', 'Marcar todas como leídas')}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Page Title & Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-sand-200">
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-navy-950 tracking-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs md:text-sm text-navy-600 mt-1 font-medium">
                  {subtitle}
                </p>
              )}
            </div>
            {actionButton && <div>{actionButton}</div>}
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}
