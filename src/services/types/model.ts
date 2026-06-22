export enum EGeminiModel {
  Flash15 = 'gemini-1.5-flash',
  Pro15 = 'gemini-1.5-pro',
  Flash20 = 'gemini-2.0-flash',
}

export interface IGeminiModel {
  id: string;
  name: string;
  description: string;
  speedLabel: string;    // e.g. "Fast", "Balanced", "Thorough"
  qualityLabel: string;  // e.g. "Good", "Better", "Best"
  costLabel: string;     // e.g. "Low", "Medium", "High"
  maxTokens: number;
  isAvailable: boolean;
}
