export enum ETranslationStatus {
  Idle = 'idle',
  Pending = 'pending',
  Processing = 'processing',
  Completed = 'completed',
  Failed = 'failed',
}

export interface ITranslateRequest {
  jobId?: string;
  csvBase64: string;
  fileName: string;
  textColumn: string;
  sourceLanguage: string;
  targetLanguage: string;
  modelId: string;
}

export interface ITranslationJob {
  id: string;
  fileName: string;
  textColumn: string;
  sourceLanguage: string;
  targetLanguage: string;
  modelId: string;
  status: ETranslationStatus;
  totalRows: number;
  translatedRows: number;
  createdAt: string;
}

export interface ITranslationStatus {
  jobId: string;
  status: ETranslationStatus;
  progress: number; // 0–100
  translatedRows: number;
  totalRows: number;
  error?: string;
}
