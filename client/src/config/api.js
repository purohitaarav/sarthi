// API Configuration for different environments

const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://sarthi-backend.onrender.com'
    : 'http://localhost:5001');

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 120000, // 2 minutes for AI responses
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
