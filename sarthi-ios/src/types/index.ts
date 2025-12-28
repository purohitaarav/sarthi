// Common types for the app

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

export type RootStackParamList = {
  Home: undefined;
  Guidance: undefined;
  About: undefined;
  Response: { response: GuidanceResponse; query: string; askedAt: string };
  History: undefined;
  Users: undefined;
  Reflections: undefined;
  Spiritual: undefined;
};
