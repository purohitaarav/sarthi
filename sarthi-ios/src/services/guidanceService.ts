import api from './api';

export interface GuidanceRequest {
  query: string;
  maxVerses?: number;
  context?: string;
}

export interface VerseReference {
  reference: string;
  translation: string;
  purport?: string;
}

export interface GuidanceResponse {
  success: boolean;
  query: string;
  guidance: string;
  verses_referenced: VerseReference[];
  timestamp: string;
  latency_ms?: number;
}

export const guidanceService = {
  async askGuidance(request: GuidanceRequest): Promise<GuidanceResponse> {
    const response = await api.post<GuidanceResponse>('/guidance/ask', {
      query: request.query,
      maxVerses: request.maxVerses || 5,
      context: request.context,
    });
    return response.data;
  },
};

