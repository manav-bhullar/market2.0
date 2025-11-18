import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===== AUTHENTICATION API =====

export const authAPI = {
  // Google OAuth login
  googleLogin: (token) => api.post('/auth/google', { token }),

  // Get current user profile
  getCurrentUser: () => api.get('/auth/me'),

  // Get specific user's profile
  getUserProfile: (userId) => api.get(`/auth/profile/${userId}`),
};

// ===== ITEMS/LISTINGS API =====

export const itemsAPI = {
  // Get all items with filters
  getAllItems: (params) => api.get('/items', { params }),

  // Get single item details
  getItemById: (itemId) => api.get(`/items/${itemId}`),

  // Create new item (with image upload)
  createItem: (formData) =>
    api.post('/items', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Update item
  updateItem: (itemId, formData) =>
    api.put(`/items/${itemId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Delete item
  deleteItem: (itemId) => api.delete(`/items/${itemId}`),

  // Get user's items
  getUserItems: () => api.get('/items/user/my-items'),
};

// ===== REVIEWS API =====

export const reviewsAPI = {
  // Add review for an item
  addReview: (itemId, data) => api.post(`/reviews/${itemId}`, data),

  // Get reviews for an item
  getItemReviews: (itemId) => api.get(`/reviews/item/${itemId}`),

  // Get seller's stats
  getSellerStats: (sellerId) => api.get(`/reviews/seller/${sellerId}`),
};

export default api;
