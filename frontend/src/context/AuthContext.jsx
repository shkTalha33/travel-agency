'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MOCK_USERS } from '@/data/demo-users';
import { MEMBERSHIP_LEVELS } from '@/data/memberships';
import { authApi, tokenStorage } from '@/lib/apiClient';

const AuthContext = createContext(null);
const STORAGE_KEY = 'vd_session';

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [ready, setReady] = useState(false);

  // Listen for unauthorized 401 events globally
  useEffect(() => {
    function handleUnauthorized() {
      tokenStorage.clearTokens();
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(STORAGE_KEY);
        setCurrentUser(null);
        if (window.location.pathname.startsWith('/dashboard')) {
          window.location.href = '/login';
        }
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('auth:unauthorized', handleUnauthorized);
      return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
    }
  }, []);

  // Restore session on initial load
  useEffect(() => {
    async function initAuth() {
      const accessToken = tokenStorage.getAccessToken();

      // If token exists, fetch fresh user from Backend
      if (accessToken) {
        try {
          const res = await authApi.getMe();
          if (res?.data) {
            const user = res.data;
            user.name = user.fullname || user.name;
            if (user.pointsStats && !user.stats) {
              user.stats = {
                availablePoints: user.pointsStats.availablePoints || 0,
                totalEarnedPoints: user.pointsStats.totalEarnedPoints || 0,
                redeemedPoints: user.pointsStats.redeemedPoints || 0,
                level1Points: user.pointsStats.level1Points || 0,
                level2Points: user.pointsStats.level2Points || 0,
                directReferralsCount: 0,
                secondLevelReferralsCount: 0,
                totalNetworkCount: 0,
              };
            }
            setCurrentUser(user);
            setReady(true);
            return;
          }
        } catch (_) {
          tokenStorage.clearTokens();
          if (typeof window !== 'undefined') sessionStorage.removeItem(STORAGE_KEY);
          setCurrentUser(null);
          setReady(true);
          return;
        }
      }

      // If no token exists, do not keep stale session
      if (typeof window !== 'undefined') sessionStorage.removeItem(STORAGE_KEY);
      setCurrentUser(null);
      setReady(true);
    }

    initAuth();
  }, []);

  // Sync session storage
  useEffect(() => {
    if (!ready) return;
    try {
      if (currentUser) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
      else sessionStorage.removeItem(STORAGE_KEY);
    } catch (_) {
      /* ignore */
    }
  }, [currentUser, ready]);

  const switchDemoAccount = useCallback((roleKey) => {
    tokenStorage.clearTokens();
    if (MOCK_USERS[roleKey]) {
      setCurrentUser(MOCK_USERS[roleKey]);
    }
  }, []);

  /**
   * Real backend login:
   * Authenticates against MongoDB with bcrypt.
   * If credentials are valid, saves tokens and user session.
   * If user is NOT registered or password invalid, throws error.
   */
  const login = useCallback(async (identifier, password, remember = true) => {
    try {
      const res = await authApi.signin({ identifier, password });
      if (res?.data?.user && res?.data?.accessToken) {
        tokenStorage.setTokens(res.data.accessToken, res.data.refreshToken, remember);
        const user = res.data.user;
        user.name = user.fullname || user.name;
        if (user.pointsStats && !user.stats) {
          user.stats = {
            availablePoints: user.pointsStats.availablePoints || 0,
            totalEarnedPoints: user.pointsStats.totalEarnedPoints || 0,
            redeemedPoints: user.pointsStats.redeemedPoints || 0,
            level1Points: user.pointsStats.level1Points || 0,
            level2Points: user.pointsStats.level2Points || 0,
            directReferralsCount: 0,
            secondLevelReferralsCount: 0,
            totalNetworkCount: 0,
          };
        }
        setCurrentUser(user);
        return { success: true, user };
      }
      throw new Error(res?.message || 'Login failed');
    } catch (apiErr) {
      // If backend is down or unreachable (network error), allow seeded demo account logins
      if (apiErr.message && (apiErr.message.includes('fetch') || apiErr.message.includes('Failed to fetch') || apiErr.message.includes('NetworkError'))) {
        const found = Object.values(MOCK_USERS).find(
          (u) =>
            u.email.toLowerCase() === identifier?.toLowerCase() ||
            u.name.toLowerCase() === identifier?.toLowerCase()
        );
        if (found) {
          setCurrentUser(found);
          return { success: true, user: found };
        }
      }

      // Real failure: user not registered or invalid password -> throw to display error
      throw apiErr;
    }
  }, []);

  /**
   * Real backend register Step 1:
   * Validates details and triggers 6-digit OTP code to user's email.
   */
  const register = useCallback(async ({ name, email, password, referralCode }) => {
    const res = await authApi.signup({
      fullname: name,
      email,
      password: password || 'Password123!',
      referralCode,
    });
    return res;
  }, []);

  /**
   * Real backend register Step 2:
   * Verifies 6-digit OTP code and creates active user session with JWT tokens.
   */
  const verifyOtpAndRegister = useCallback(async ({ email, otp }) => {
    const res = await authApi.verifyRegisterOtp({ email, otp });

    if (res?.data?.user && res?.data?.accessToken) {
      tokenStorage.setTokens(res.data.accessToken, res.data.refreshToken, true);
      const user = res.data.user;
      user.name = user.fullname || user.name;
      if (user.pointsStats && !user.stats) {
        user.stats = {
          availablePoints: user.pointsStats.availablePoints || 0,
          totalEarnedPoints: user.pointsStats.totalEarnedPoints || 0,
          redeemedPoints: user.pointsStats.redeemedPoints || 0,
          level1Points: user.pointsStats.level1Points || 0,
          level2Points: user.pointsStats.level2Points || 0,
          directReferralsCount: 0,
          secondLevelReferralsCount: 0,
          totalNetworkCount: 0,
        };
      }
      setCurrentUser(user);
      return { success: true, user };
    }
    throw new Error(res?.message || 'OTP verification failed');
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (_) {
      /* ignore */
    } finally {
      tokenStorage.clearTokens();
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(STORAGE_KEY);
      }
      setCurrentUser(null);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const accessToken = tokenStorage.getAccessToken();
    if (!accessToken) {
      setCurrentUser(null);
      return null;
    }
    try {
      const res = await authApi.getMe();
      if (res?.data) {
        const user = res.data;
        user.name = user.fullname || user.name;
        if (user.pointsStats) {
          user.stats = {
            availablePoints: user.pointsStats.availablePoints || 0,
            totalEarnedPoints: user.pointsStats.totalEarnedPoints || 0,
            redeemedPoints: user.pointsStats.redeemedPoints || 0,
            level1Points: user.pointsStats.level1Points || 0,
            level2Points: user.pointsStats.level2Points || 0,
            directReferralsCount: 0,
            secondLevelReferralsCount: 0,
            totalNetworkCount: 0,
          };
        }
        setCurrentUser((prev) => {
          if (prev && prev._id === user._id && JSON.stringify(prev) === JSON.stringify(user)) {
            return prev;
          }
          return user;
        });
        return user;
      }
    } catch (err) {
      if (err?.status === 401 || err?.message?.toLowerCase().includes('unauthorized') || err?.message?.toLowerCase().includes('sesión')) {
        tokenStorage.clearTokens();
        if (typeof window !== 'undefined') sessionStorage.removeItem(STORAGE_KEY);
        setCurrentUser(null);
      }
    }
    return null;
  }, []);

  const membershipKey = currentUser?.membershipId
    ? currentUser.membershipId.toUpperCase()
    : 'MEMBER';

  const currentMembership =
    MEMBERSHIP_LEVELS[membershipKey] || MEMBERSHIP_LEVELS.MEMBER;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        ready,
        isAuthenticated: !!currentUser,
        currentMembership,
        switchDemoAccount,
        login,
        register,
        verifyOtpAndRegister,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
