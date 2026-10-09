'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { notificationsApi, tokenStorage } from '@/lib/apiClient';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { currentUser } = useAuth();
  const { copy, isEn } = useLanguage();
  const [notifications, setNotifications] = useState([]);
  const [initialized, setInitialized] = useState(false);

  const userId = currentUser?._id || currentUser?.id || currentUser?.email || 'guest';
  const storageKey = `cw_notifications_${userId}`;

  // Fetch notifications from Backend API or fallback to localStorage
  const loadNotifications = useCallback(async () => {
    if (!currentUser) {
      setNotifications([]);
      setInitialized(false);
      return;
    }

    const token = tokenStorage.getAccessToken();
    if (token) {
      try {
        const res = await notificationsApi.getAll();
        if (res?.data?.notifications && Array.isArray(res.data.notifications)) {
          const list = res.data.notifications.map((n) => ({
            id: n._id || n.id,
            _id: n._id,
            type: n.type || 'general',
            title: n.title,
            message: n.message,
            link: n.link || '/dashboard',
            read: !!n.read,
            createdAt: n.createdAt || new Date().toISOString(),
          }));
          setNotifications(list);
          setInitialized(true);
          try {
            localStorage.setItem(storageKey, JSON.stringify(list));
          } catch (_) {}
          return;
        }
      } catch (apiErr) {
        console.warn('API notifications fetch failed, falling back to local store:', apiErr.message);
      }
    }

    // Fallback: Read from localStorage
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
    } catch (_) {}

    // Fallback: Generate initial seeded notifications
    const nLoc = copy.notifications || {};
    const now = Date.now();
    const defaults = [];

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
        createdAt: new Date(now - 1000 * 60 * 45).toISOString(),
      });
    }

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
        createdAt: new Date(now - 1000 * 60 * 60 * 3).toISOString(),
      });
    }

    defaults.push({
      id: 'notif-offer-1',
      type: 'offer',
      title: nLoc.offerDealTitle || (isEn ? 'New VIP Offer Available' : 'Nueva Oferta VIP Disponible'),
      message: nLoc.offerDealMsg || (isEn ? 'Discover new luxury packages and exclusive member rates.' : 'Descubre nuevas experiencias de lujo y tarifas para miembros.'),
      link: '/dashboard/offers',
      read: false,
      createdAt: new Date(now - 1000 * 60 * 60 * 18).toISOString(),
    });

    defaults.push({
      id: 'notif-welcome-1',
      type: 'welcome',
      title: nLoc.welcomeTitle || (isEn ? 'Welcome to Círculo Wingding!' : '¡Bienvenido a Círculo Wingding!'),
      message: nLoc.welcomeMsg || (isEn ? 'Explore our Caribbean resort catalog and start earning rewards.' : 'Explora el catálogo de ofertas y comienza a generar beneficios.'),
      link: '/dashboard/offers',
      read: true,
      createdAt: new Date(now - 1000 * 60 * 60 * 48).toISOString(),
    });

    setNotifications(defaults);
    setInitialized(true);
    try {
      localStorage.setItem(storageKey, JSON.stringify(defaults));
    } catch (_) {}
  }, [currentUser, storageKey, copy, isEn]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Mark single notification as read (Optimistic UI + API execution)
  const markAsRead = useCallback(async (id) => {
    setNotifications((prev) => {
      const next = prev.map((n) => (n.id === id || n._id === id ? { ...n, read: true } : n));
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch (_) {}
      return next;
    });

    if (tokenStorage.getAccessToken() && id && !id.startsWith('notif-')) {
      try {
        await notificationsApi.markAsRead(id);
      } catch (err) {
        console.warn('API markAsRead error:', err.message);
      }
    }
  }, [storageKey]);

  // Mark all notifications as read (Optimistic UI + API execution)
  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => {
      const next = prev.map((n) => ({ ...n, read: true }));
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch (_) {}
      return next;
    });

    if (tokenStorage.getAccessToken()) {
      try {
        await notificationsApi.markAllAsRead();
      } catch (err) {
        console.warn('API markAllAsRead error:', err.message);
      }
    }
  }, [storageKey]);

  // Add a new activity notification (Optimistic UI + API execution)
  const addNotification = useCallback(async ({ title, message, type = 'general', link = '/dashboard', read = false }) => {
    const tempId = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newNotif = {
      id: tempId,
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

    if (tokenStorage.getAccessToken()) {
      try {
        const res = await notificationsApi.create({ title, message, type, link, read });
        if (res?.data?._id) {
          const serverId = res.data._id;
          setNotifications((prev) => {
            const next = prev.map((n) => (n.id === tempId ? { ...n, id: serverId, _id: serverId } : n));
            try {
              localStorage.setItem(storageKey, JSON.stringify(next));
            } catch (_) {}
            return next;
          });
        }
      } catch (err) {
        console.warn('API addNotification error:', err.message);
      }
    }
    return newNotif;
  }, [storageKey]);

  // Delete a notification (Optimistic UI + API execution)
  const removeNotification = useCallback(async (id) => {
    setNotifications((prev) => {
      const next = prev.filter((n) => n.id !== id && n._id !== id);
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch (_) {}
      return next;
    });

    if (tokenStorage.getAccessToken() && id && !id.startsWith('notif-')) {
      try {
        await notificationsApi.deleteNotification(id);
      } catch (err) {
        console.warn('API deleteNotification error:', err.message);
      }
    }
  }, [storageKey]);

  // Clear all notifications (Optimistic UI + API execution)
  const clearAll = useCallback(async () => {
    setNotifications([]);
    try {
      localStorage.setItem(storageKey, JSON.stringify([]));
    } catch (_) {}

    if (tokenStorage.getAccessToken()) {
      try {
        await notificationsApi.clearAll();
      } catch (err) {
        console.warn('API clearAll error:', err.message);
      }
    }
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
    loadNotifications,
    initialized,
  }), [notifications, unreadCount, markAsRead, markAllAsRead, addNotification, removeNotification, clearAll, loadNotifications, initialized]);

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
