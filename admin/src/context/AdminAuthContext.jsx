'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  getAuthToken,
  setAuthToken,
  getAdminUser,
  setAdminUser,
  removeAdminSession,
  adminApi,
} from '@/lib/apiClient';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken();
      const savedUser = getAdminUser();

      if (!token) {
        setAdmin(null);
        setIsLoading(false);
        if (pathname !== '/login') {
          router.push('/login');
        }
        return;
      }

      if (savedUser && savedUser.role === 'admin') {
        setAdmin(savedUser);
      }

      try {
        const response = await adminApi.getMe();
        const userData = response.data;

        if (userData && userData.role === 'admin') {
          setAdmin(userData);
          setAdminUser(userData);
        } else {
          // User is not an admin, deny access
          removeAdminSession();
          setAdmin(null);
          if (pathname !== '/login') {
            router.push('/login?error=unauthorized');
          }
        }
      } catch (err) {
        console.error('Failed to verify admin auth:', err);
        removeAdminSession();
        setAdmin(null);
        if (pathname !== '/login') {
          router.push('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [pathname]);

  const login = async (identifier, password) => {
    setIsLoading(true);
    try {
      const res = await adminApi.login({ identifier, password });
      const { user, accessToken, refreshToken } = res.data;

      if (user.role !== 'admin') {
        throw new Error('Acceso denegado: Esta cuenta no tiene permisos de Administrador.');
      }

      setAuthToken(accessToken);
      if (typeof window !== 'undefined' && refreshToken) {
        localStorage.setItem('admin_refresh_token', refreshToken);
      }
      setAdminUser(user);
      setAdmin(user);

      router.push('/');
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Error al iniciar sesión' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    removeAdminSession();
    setAdmin(null);
    router.push('/login');
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isLoading,
        isAuthenticated: !!admin && admin.role === 'admin',
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
