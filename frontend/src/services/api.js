const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getToken = () => localStorage.getItem('token');

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// Auth API
export const authAPI = {
  register: (userData) => apiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  login: (credentials) => apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  logout: () => apiCall('/auth/logout'),

  getMe: () => apiCall('/auth/me'),
};

// Projects API
export const projectsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/projects?${queryString}`);
  },

  getById: (id) => apiCall(`/projects/${id}`),

  getFeatured: () => apiCall('/projects/featured'),

  // Updates
  getUpdates: (projectId) => apiCall(`/projects/${projectId}/updates`),

  addUpdate: (projectId, updateData) => apiCall(`/projects/${projectId}/updates`, {
    method: 'POST',
    body: JSON.stringify(updateData),
  }),

  updateUpdate: (projectId, updateId, updateData) => apiCall(`/projects/${projectId}/updates/${updateId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  }),

  deleteUpdate: (projectId, updateId) => apiCall(`/projects/${projectId}/updates/${updateId}`, {
    method: 'DELETE',
  }),
};

// Admin API
export const adminAPI = {
  getStats: () => apiCall('/admin/stats'),

  getAllProjects: () => apiCall('/admin/projects'),

  createProject: (projectData) => apiCall('/admin/projects', {
    method: 'POST',
    body: JSON.stringify(projectData),
  }),

  updateProject: (id, projectData) => apiCall(`/admin/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(projectData),
  }),

  deleteProject: (id) => apiCall(`/admin/projects/${id}`, {
    method: 'DELETE',
  }),
};

// Payment API
export const paymentAPI = {
  createIntent: (paymentData) => apiCall('/payments/create-intent', {
    method: 'POST',
    body: JSON.stringify(paymentData),
  }),

  confirmPayment: (paymentData) => apiCall('/payments/confirm', {
    method: 'POST',
    body: JSON.stringify(paymentData),
  }),

  getCertificate: (paymentId) => {
    const token = getToken();
    return fetch(`${API_URL}/payments/certificate/${paymentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

// Campaign Request API
export const campaignRequestAPI = {
  submit: (requestData) => apiCall('/campaign-requests', {
    method: 'POST',
    body: JSON.stringify(requestData),
  }),

  getMyRequests: () => apiCall('/campaign-requests/my-requests'),

  getById: (id) => apiCall(`/campaign-requests/${id}`),

  delete: (id) => apiCall(`/campaign-requests/${id}`, {
    method: 'DELETE',
  }),

  // Admin only
  getAll: (status) => {
    const queryString = status ? `?status=${status}` : '';
    return apiCall(`/campaign-requests${queryString}`);
  },

  approve: (id, adminNotes) => apiCall(`/campaign-requests/${id}/approve`, {
    method: 'PUT',
    body: JSON.stringify({ adminNotes }),
  }),

  reject: (id, adminNotes) => apiCall(`/campaign-requests/${id}/reject`, {
    method: 'PUT',
    body: JSON.stringify({ adminNotes }),
  }),

  getCertificate: (id) => {
    const token = getToken();
    return fetch(`${API_URL}/campaign-requests/certificate/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

// User API
export const userAPI = {
  getStats: () => apiCall('/user/stats'),
  
  getProjects: () => apiCall('/user/projects'),
  
  getBackedProjects: () => apiCall('/user/backed-projects'),
  
  getAnalytics: () => apiCall('/user/analytics'),

  updateProfile: (profileData) => apiCall('/user/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  }),

  updatePassword: (passwordData) => apiCall('/user/password', {
    method: 'PUT',
    body: JSON.stringify(passwordData),
  }),
};

// Auth helpers
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

export const getAuthToken = () => localStorage.getItem('token');

export const isAuthenticated = () => !!getAuthToken();
