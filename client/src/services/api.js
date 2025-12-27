import axios from 'axios';
import { Capacitor } from '@capacitor/core';

// API Configuration for different environments (matches config/api.js)
// In Capacitor (iOS/Android), always use production URL unless explicitly set
const getApiBaseURL = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // Default to production Render server for all platforms
  return 'https://sarthiai.onrender.com';
};

const API_BASE_URL = getApiBaseURL();

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      // Use window.location for web, hash routing for iOS/Capacitor
      if (window.location.hash) {
        window.location.hash = '#/';
      } else {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
