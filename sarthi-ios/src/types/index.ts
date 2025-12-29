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
  HomeMain: undefined;
  Reflection: undefined;
  History: undefined;
  About: undefined;

  Response: {
    query: string;
    verses: any[];
    response: string;
    timestamp?: string;
  };
  Guidance: undefined;
};
