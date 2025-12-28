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
  Response: { response: GuidanceResponse };
  History: undefined;
  Guidance: undefined;
  Users: undefined;
  Reflections: undefined;
  Spiritual: undefined;
  About: undefined;
};

