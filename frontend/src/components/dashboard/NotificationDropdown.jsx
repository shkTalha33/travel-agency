'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bell,
  Check,
  CheckCheck,
  Coins,
  Gift,
  Palmtree,
  Sparkles,
  Users,
  ShieldCheck,
  Compass,
  Trash2,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';
import { useLanguage } from '@/context/LanguageContext';

function formatRelativeTime(dateString, copy, isEn) {
  if (!dateString) return '';
  const now = Date.now();
  const date = new Date(dateString).getTime();
  const diffSec = Math.floor((now - date) / 1000);

  const nLoc = copy.notifications || {};
  if (diffSec < 60) return nLoc.justNow || (isEn ? 'Just now' : 'Justo ahora');
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return typeof nLoc.minutesAgo === 'function' ? nLoc.minutesAgo(diffMin) : `${diffMin}m`;
  }
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) {
    return typeof nLoc.hoursAgo === 'function' ? nLoc.hoursAgo(diffHours) : `${diffHours}h`;
  }
  const diffDays = Math.floor(diffHours / 24);
  return typeof nLoc.daysAgo === 'function' ? nLoc.daysAgo(diffDays) : `${diffDays}d`;
}

function getNotificationIcon(type) {
  switch (type) {
    case 'points':
      return {
        icon: Coins,
        bg: 'bg-amber-100 text-amber-600 ring-4 ring-amber-50',
      };
    case 'referral':
      return {
        icon: Users,
        bg: 'bg-ocean-100 text-ocean-600 ring-4 ring-ocean-50',
      };
    case 'redeem':
      return {
        icon: Gift,
        bg: 'bg-emerald-100 text-emerald-600 ring-4 ring-emerald-50',
      };
    case 'offer':
      return {
        icon: Palmtree,
        bg: 'bg-indigo-100 text-indigo-600 ring-4 ring-indigo-50',
      };
    case 'security':
      return {
        icon: ShieldCheck,
        bg: 'bg-sky-100 text-sky-600 ring-4 ring-sky-50',
      };
    case 'welcome':
    default:
      return {
        icon: Sparkles,
        bg: 'bg-gold-100 text-gold-700 ring-4 ring-gold-50',
      };
  }
}

export default function NotificationDropdown() {
  const router = useRouter();
  const { copy, isEn } = useLanguage();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll,
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'
  const dropdownRef = useRef(null);

  const nLoc = copy.notifications || {};

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const displayedNotifications = filter === 'unread'
    ? notifications.filter((n) => !n.read)
    : notifications;

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    setIsOpen(false);
    if (notification.link) {
      router.push(notification.link);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={nLoc.title || 'Notifications'}
        aria-expanded={isOpen}
        className={`relative p-2.5 rounded-full text-slate-600 hover:text-navy-950 hover:bg-sand-100/90 transition-all duration-200 cursor-pointer outline-none focus:outline-none focus:ring-2 focus:ring-ocean-500/30 ${
          isOpen ? 'bg-sand-100 text-navy-950 ring-2 ring-ocean-500/20' : ''
        }`}
      >
        <Bell className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-12' : ''}`} />

        {/* Unread dot indicator - ONLY displayed when there are unseen/unread messages */}
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 border border-white"></span>
          </span>
        )}
      </button>

      {/* Popover Card */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-3xl bg-white shadow-2xl border border-slate-200/90 z-50 overflow-hidden animate-fade-in divide-y divide-sand-100">
          {/* Header */}
          <div className="p-4 sm:p-5 bg-gradient-to-b from-sand-50/80 to-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-lg font-bold text-navy-950">
                {nLoc.title}
              </h2>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-[11px] font-bold">
                  {unreadCount} {nLoc.unread}
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="inline-flex items-center gap-1 text-xs font-bold text-ocean-700 hover:text-ocean-900 transition-colors cursor-pointer"
                title={nLoc.markAllRead}
              >
                <CheckCheck size={14} className="text-ocean-600" />
                <span>{nLoc.markAllRead}</span>
              </button>
            )}
          </div>

          {/* Filter Bar */}
          <div className="px-4 py-2 bg-sand-50/40 flex items-center justify-between gap-2 border-b border-sand-100">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  filter === 'all'
                    ? 'bg-navy-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-sand-200/70 hover:text-navy-900'
                }`}
              >
                {nLoc.all} ({notifications.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('unread')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  filter === 'unread'
                    ? 'bg-navy-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-sand-200/70 hover:text-navy-900'
                }`}
              >
                {nLoc.unread} ({unreadCount})
              </button>
            </div>

            {notifications.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="text-[11px] font-semibold text-slate-600 hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer"
                title={nLoc.clearAll}
              >
                <Trash2 size={12} />
                <span>{nLoc.clearAll}</span>
              </button>
            )}
          </div>

          {/* Notification Items List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-sand-100/80">
            {displayedNotifications.length === 0 ? (
              <div className="py-10 px-6 text-center">
                <div className="mx-auto w-12 h-12 rounded-2xl bg-sand-100 flex items-center justify-center text-slate-400 mb-3">
                  <Bell className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-navy-950">
                  {filter === 'unread' ? nLoc.noUnread : nLoc.noNotifications}
                </p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
                  {nLoc.noNotificationsDesc}
                </p>
              </div>
            ) : (
              displayedNotifications.map((n) => {
                const { icon: Icon, bg } = getNotificationIcon(n.type);
                return (
                  <div
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className={`group relative p-4 flex items-start gap-3.5 hover:bg-sand-50/90 transition-all cursor-pointer ${
                      !n.read ? 'bg-ocean-50/30' : 'bg-white'
                    }`}
                  >
                    {/* Activity Icon */}
                    <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${bg} shadow-xs`}>
                      <Icon size={16} />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-1.5">
                        <p className={`text-xs font-bold leading-tight ${!n.read ? 'text-navy-950 font-bold' : 'text-slate-800'}`}>
                          {n.title}
                        </p>
                        <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap shrink-0">
                          {formatRelativeTime(n.createdAt, copy, isEn)}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">
                        {n.message}
                      </p>

                      <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-ocean-700 group-hover:text-ocean-900 group-hover:translate-x-0.5 transition-all">
                        <span>{nLoc.viewDetails}</span>
                        <ChevronRight size={12} />
                      </div>
                    </div>

                    {/* Unread Dot on Item */}
                    {!n.read && (
                      <span className="shrink-0 w-2 h-2 rounded-full bg-ocean-600 mt-1.5 shadow-xs" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
