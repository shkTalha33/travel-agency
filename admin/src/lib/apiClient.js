const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_access_token');
};

export const setAuthToken = (token) => {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('admin_access_token', token);
  } else {
    localStorage.removeItem('admin_access_token');
  }
};

export const getAdminUser = () => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('admin_user_data');
  return user ? JSON.parse(user) : null;
};

export const setAdminUser = (userData) => {
  if (typeof window === 'undefined') return;
  if (userData) {
    localStorage.setItem('admin_user_data', JSON.stringify(userData));
  } else {
    localStorage.removeItem('admin_user_data');
  }
};

export const removeAdminSession = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('admin_access_token');
  localStorage.removeItem('admin_refresh_token');
  localStorage.removeItem('admin_user_data');
};

export async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await res.json();

    if (!res.ok) {
      // If unauthorized on admin route, clear session and redirect
      if (res.status === 401 && typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        removeAdminSession();
        window.location.href = '/login';
      }
      const errorMsg = data?.message || data?.error || 'Ha ocurrido un error en la solicitud';
      throw new Error(errorMsg);
    }

    return data;
  } catch (err) {
    throw err;
  }
}

export const adminApi = {
  // Auth
  login: (credentials) =>
    apiRequest('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  getMe: () => apiRequest('/auth/me'),

  // Dashboard Stats
  getDashboardStats: () => apiRequest('/users/admin/dashboard-stats'),

  // Users
  getUsers: (params = '') => apiRequest(`/users/admin/all${params ? `?${params}` : ''}`),
  updateUserStatus: (id, payload) =>
    apiRequest(`/users/admin/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteUser: (id) =>
    apiRequest(`/users/admin/${id}`, {
      method: 'DELETE',
    }),

  // Offers
  getOffers: (params = '') => apiRequest(`/offers${params ? `?${params}` : ''}`),
  getOffer: (id) => apiRequest(`/offers/${id}`),
  createOffer: (payload) =>
    apiRequest('/offers', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateOffer: (id, payload) =>
    apiRequest(`/offers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteOffer: (id) =>
    apiRequest(`/offers/${id}`, {
      method: 'DELETE',
    }),

  // FAQs
  getFaqs: () => apiRequest('/faqs'),
  createFaq: (payload) =>
    apiRequest('/faqs', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateFaq: (id, payload) =>
    apiRequest(`/faqs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteFaq: (id) =>
    apiRequest(`/faqs/${id}`, {
      method: 'DELETE',
    }),

  // Points & Purchases
  assignPurchasePoints: (payload) =>
    apiRequest('/points/admin/assign-purchase-points', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getTransactions: (params = '') =>
    apiRequest(`/points/admin/transactions${params ? `?${params}` : ''}`),

  // Redemptions
  getRedemptions: (params = '') =>
    apiRequest(`/redemptions/admin/all${params ? `?${params}` : ''}`),
  updateRedemptionStatus: (id, payload) =>
    apiRequest(`/redemptions/admin/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  // Contacts
  getContacts: (params = '') =>
    apiRequest(`/contact/admin/all${params ? `?${params}` : ''}`),
  updateContactStatus: (id, payload) =>
    apiRequest(`/contact/admin/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  // Upload to Firebase Storage
  uploadImage: (base64OrData, filename = 'image.jpg', folder = 'offers') =>
    apiRequest('/upload/image', {
      method: 'POST',
      body: JSON.stringify({
        image: base64OrData,
        filename,
        folder,
      }),
    }),

  // Membership Tiers Management
  getMembershipTiers: () => apiRequest('/membership-tiers'),
  getAvailableTierCategories: () => apiRequest('/membership-tiers/available-categories'),
  getMembershipTier: (id) => apiRequest(`/membership-tiers/${id}`),
  createMembershipTier: (payload) =>
    apiRequest('/membership-tiers', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateMembershipTier: (id, payload) =>
    apiRequest(`/membership-tiers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteMembershipTier: (id) =>
    apiRequest(`/membership-tiers/${id}`, {
      method: 'DELETE',
    }),
};
