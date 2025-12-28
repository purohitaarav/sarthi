import axios from 'axios';

// API Configuration - points to existing Render API
const API_BASE_URL = 'https://sarthiai.onrender.com';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 180000, // 3 minutes for AI responses
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    // TODO: Implement secure storage for tokens
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
      // TODO: Implement logout/navigation
    }
    return Promise.reject(error);
  }
);

export default api;

