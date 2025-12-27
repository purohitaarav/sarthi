// API Configuration for different environments
import { Capacitor } from '@capacitor/core';

// In Capacitor (iOS/Android), always use production URL unless explicitly set
const getApiBaseURL = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // Default to production Render server for all platforms
  return 'https://sarthiai.onrender.com';
};

const API_BASE_URL = getApiBaseURL();

// Longer timeout for iOS/Capacitor due to network differences
const getTimeout = () => {
  if (Capacitor.isNativePlatform()) {
    return 180000; // 3 minutes for iOS/Android
  }
  return 120000; // 2 minutes for web
};

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: getTimeout(),
  headers: {
    'Content-Type': 'application/json',
  }
};

export const API_ENDPOINTS = {
  // Health
  health: '/api/health',

  // Guidance
  guidanceAsk: '/api/guidance/ask',
  guidanceChat: '/api/guidance/chat',
  guidanceVerses: '/api/guidance/verses',
  guidanceTopics: '/api/guidance/topics',

  // Gita
  gitaChapters: '/api/gita/chapters',
  gitaVerses: '/api/gita/verses',
  gitaSearch: '/api/gita/search',
  gitaRandom: '/api/gita/random',
  gitaStats: '/api/gita/stats',

  // Spiritual
  spiritualAsk: '/api/spiritual/ask',
  spiritualChat: '/api/spiritual/chat',
  spiritualHealth: '/api/spiritual/health',
};

export default API_CONFIG;
