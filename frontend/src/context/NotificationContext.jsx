'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { currentUser } = useAuth();
  const { copy, isEn } = useLanguage();
  const [notifications, setNotifications] = useState([]);
  const [initialized, setInitialized] = useState(false);

  const userId = currentUser?._id || currentUser?.id || currentUser?.email || 'guest';
  const storageKey = `cw_notifications_${userId}`;

  // Initialize notifications from localStorage or generate defaults based on current user state
  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      setInitialized(false);
      return;
    }

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setNotifications(parsed);
          setInitialized(true);
          return;
        }
      }
    } catch (_) {
      // Fallback if localStorage parsing fails
    }

    // Generate initial seeded notifications tailored to user
    const nLoc = copy.notifications || {};
    const now = Date.now();
    const defaults = [];

    // Points notification if user has available points
    const pts = currentUser?.stats?.availablePoints || currentUser?.pointsStats?.availablePoints || 0;
    if (pts > 0) {
      defaults.push({
        id: 'notif-pts-1',
        type: 'points',
        title: nLoc.pointsRewardTitle || (isEn ? 'Points Credited!' : '¡Puntos Acreditados!'),
        message: typeof nLoc.pointsRewardMsg === 'function' 
          ? nLoc.pointsRewardMsg(pts, 'Punta Cana Resort') 
          : (isEn ? `You received +${pts} PTS from recent travel booking.` : `Recibiste +${pts} PTS por reciente reserva de viaje.`),
        link: '/dashboard/points',
        read: false,
        createdAt: new Date(now - 1000 * 60 * 45).toISOString(), // 45 mins ago
      });
    }

    // Referral notification if user has direct referrals
    const refCount = currentUser?.stats?.level1Count || currentUser?.networkStats?.level1Count || 0;
    if (refCount > 0) {
      defaults.push({
        id: 'notif-ref-1',
        type: 'referral',
        title: nLoc.referralJoinedTitle || (isEn ? 'New Member in Your Network' : 'Nuevo Miembro en tu Red'),
        message: typeof nLoc.referralJoinedMsg === 'function' 
          ? nLoc.referralJoinedMsg('Carlos Gómez') 
          : (isEn ? 'Carlos Gómez joined your referral network.' : 'Carlos Gómez se unió a tu red de afiliados.'),
        link: '/dashboard/network',
        read: false,
        createdAt: new Date(now - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
      });
    }

    // Featured VIP Offer alert
    defaults.push({
      id: 'notif-offer-1',
      type: 'offer',
      title: nLoc.offerDealTitle || (isEn ? 'New VIP Offer Available' : 'Nueva Oferta VIP Disponible'),
      message: nLoc.offerDealMsg || (isEn ? 'Discover new luxury packages and exclusive member rates.' : 'Descubre nuevas experiencias de lujo y tarifas para miembros.'),
      link: '/dashboard/offers',
      read: false,
      createdAt: new Date(now - 1000 * 60 * 60 * 18).toISOString(), // 18 hours ago
    });

    // Welcome notification
    defaults.push({
      id: 'notif-welcome-1',
      type: 'welcome',
      title: nLoc.welcomeTitle || (isEn ? 'Welcome to Círculo Wingding!' : '¡Bienvenido a Círculo Wingding!'),
      message: nLoc.welcomeMsg || (isEn ? 'Explore our Caribbean resort catalog and start earning rewards.' : 'Explora el catálogo de ofertas y comienza a generar beneficios.'),
      link: '/dashboard/offers',
      read: true,
      createdAt: new Date(now - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    });

    setNotifications(defaults);
    setInitialized(true);
    try {
      localStorage.setItem(storageKey, JSON.stringify(defaults));
    } catch (_) {}
  }, [currentUser, storageKey, copy, isEn]);

  // Persist notifications to localStorage on update
  const saveNotifications = useCallback((updatedList) => {
    setNotifications(updatedList);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedList));
    } catch (_) {}
  }, [storageKey]);

  // Mark single notification as read
  const markAsRead = useCallback((id) => {
    setNotifications((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch (_) {}
      return next;
    });
  }, [storageKey]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => {
      const next = prev.map((n) => ({ ...n, read: true }));
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch (_) {}
      return next;
    });
  }, [storageKey]);

  // Add a new activity notification
  const addNotification = useCallback(({ title, message, type = 'general', link = '/dashboard', read = false }) => {
    const newNotif = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      type,
      title,
      message,
      link,
      read,
      createdAt: new Date().toISOString(),
    };

    setNotifications((prev) => {
      const next = [newNotif, ...prev];
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch (_) {}
      return next;
    });
    return newNotif;
  }, [storageKey]);

  // Delete a notification
  const removeNotification = useCallback((id) => {
    setNotifications((prev) => {
      const next = prev.filter((n) => n.id !== id);
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch (_) {}
      return next;
    });
  }, [storageKey]);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
    try {
      localStorage.setItem(storageKey, JSON.stringify([]));
    } catch (_) {}
  }, [storageKey]);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const value = useMemo(() => ({
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification,
    clearAll,
    initialized,
  }), [notifications, unreadCount, markAsRead, markAllAsRead, addNotification, removeNotification, clearAll, initialized]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
