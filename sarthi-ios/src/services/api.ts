import axios from 'axios';
import { useState, useCallback } from 'react';

const API_URL = 'https://sarthiai.onrender.com/api';

// Shared axios instance used across services
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 180000, // 3 minutes for AI responses
});

export const guidanceApi = {
  async ask(query: string) {
    const response = await api.post('/guidance/ask', {
      query,
      maxVerses: 5,
    });
    return response.data;
  },
};

export function useGuidanceApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);

  const ask = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const result = await guidanceApi.ask(query);
      setResponse(result);
      return result;
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to get guidance.'
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, response, ask };
}

// Default export used by guidanceService and other API callers
export default api;
