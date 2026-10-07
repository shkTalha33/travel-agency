/**
 * Production-ready API Client with automatic JWT Access & Refresh Token rotation.
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const ACCESS_TOKEN_KEY = 'vd_access_token';
const REFRESH_TOKEN_KEY = 'vd_refresh_token';

export const tokenStorage = {
  getAccessToken: () => {
    if (typeof window === 'undefined') return null;
    return (
      localStorage.getItem(ACCESS_TOKEN_KEY) ||
      sessionStorage.getItem(ACCESS_TOKEN_KEY)
    );
  },
  getRefreshToken: () => {
    if (typeof window === 'undefined') return null;
    return (
      localStorage.getItem(REFRESH_TOKEN_KEY) ||
      sessionStorage.getItem(REFRESH_TOKEN_KEY)
    );
  },
  setTokens: (accessToken, refreshToken, remember = true) => {
    if (typeof window === 'undefined') return;
    const storage = remember ? localStorage : sessionStorage;
    if (accessToken) storage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
  clearTokens: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (newAccessToken) => {
  refreshSubscribers.forEach((cb) => cb(newAccessToken));
  refreshSubscribers = [];
};

/**
 * Universal fetch wrapper with auto-retry and JWT token rotation
 */
export async function apiClient(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  const currentLang = typeof window !== 'undefined' ? (localStorage.getItem('vd_locale') || 'en') : 'en';
  const accessToken = tokenStorage.getAccessToken();

  const headers = {
    'Content-Type': 'application/json',
    'Accept-Language': currentLang,
    'x-language': currentLang,
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    // Handle 401 Unauthorized -> Attempt token refresh
    if (response.status === 401 && !options._retry && !endpoint.includes('/auth/signin') && !endpoint.includes('/auth/refresh-token')) {
      const refreshToken = tokenStorage.getRefreshToken();

      if (!refreshToken) {
        tokenStorage.clearTokens();
        return Promise.reject(new Error('Sesión no autorizada'));
      }

      if (isRefreshing) {
        // Queue the request until refresh completes
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken) => {
            options._retry = true;
            options.headers = {
              ...options.headers,
              Authorization: `Bearer ${newToken}`,
            };
            resolve(apiClient(endpoint, options));
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        const refreshData = await refreshResponse.json();

        if (refreshResponse.ok && refreshData.data?.accessToken) {
          const newAccessToken = refreshData.data.accessToken;
          const newRefreshToken = refreshData.data.refreshToken || refreshToken;

          tokenStorage.setTokens(newAccessToken, newRefreshToken);
          onRefreshed(newAccessToken);
          isRefreshing = false;

          options._retry = true;
          options.headers = {
            ...options.headers,
            Authorization: `Bearer ${newAccessToken}`,
          };
          return apiClient(endpoint, options);
        } else {
          tokenStorage.clearTokens();
          isRefreshing = false;
          return Promise.reject(new Error('La sesión ha expirado'));
        }
      } catch (refreshErr) {
        tokenStorage.clearTokens();
        isRefreshing = false;
        return Promise.reject(refreshErr);
      }
    }

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.message || 'Error en la solicitud al servidor';
      const error = new Error(errorMsg);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    throw err;
  }
}

// ----------------------------------------------------
// Specialized Domain APIs
// ----------------------------------------------------

export const authApi = {
  signup: (userData) =>
    apiClient('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  verifyRegisterOtp: (data) =>
    apiClient('/auth/verify-register-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  resendRegisterOtp: (email) =>
    apiClient('/auth/resend-register-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  signin: (credentials) =>
    apiClient('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getMe: () => apiClient('/auth/me'),

  logout: () =>
    apiClient('/auth/logout', {
      method: 'POST',
    }),

  forgotPassword: (email) =>
    apiClient('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: ({ email, otp, newPassword }) =>
    apiClient('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, otp, newPassword }),
    }),

  verifyEmail: (token) => apiClient(`/auth/verify-email?token=${token}`),

  resendVerification: () =>
    apiClient('/auth/resend-verification', {
      method: 'POST',
    }),
};

export const userApi = {
  getProfile: () => apiClient('/users/profile'),

  updateProfile: (profileData) =>
    apiClient('/users/update-details', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),

  updateAvatar: (avatar) =>
    apiClient('/users/update-avatar', {
      method: 'PUT',
      body: JSON.stringify({ avatar }),
    }),

  changePassword: (oldPassword, newPassword) =>
    apiClient('/users/update-password', {
      method: 'PUT',
      body: JSON.stringify({ oldPassword, newPassword }),
    }),

  changeEmail: (email) =>
    apiClient('/users/update-email', {
      method: 'PUT',
      body: JSON.stringify({ email }),
    }),

  getNetwork: () => apiClient('/users/network'),

  deactivate: () =>
    apiClient('/users/deactivate', {
      method: 'PUT',
    }),
};

export const offersApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient(`/offers${query ? `?${query}` : ''}`);
  },

  getBySlugOrId: (idOrSlug) => apiClient(`/offers/${idOrSlug}`),
};

export const pointsApi = {
  getSummary: () => apiClient('/points/summary'),
  getTransactions: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient(`/points/transactions${query ? `?${query}` : ''}`);
  },
};

export const redemptionApi = {
  createRequest: (data) =>
    apiClient('/redemptions/request', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getMyRedemptions: () => apiClient('/redemptions/my'),
};

export const faqsApi = {
  getAll: () => apiClient('/faqs'),
};

export const contactApi = {
  submit: (contactData) =>
    apiClient('/contact', {
      method: 'POST',
      body: JSON.stringify(contactData),
    }),
};
