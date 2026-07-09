export enum ETranslationStatus {
  Idle = 'idle',
  Pending = 'pending',
  Processing = 'processing',
  Completed = 'completed',
  Failed = 'failed',
}

export interface ITranslateRequest {
  sourceLanguage: string;
  targetLanguage: string;
  inferenceMode?: string;
  modelId: string;
  fileId: string;
  email?: string;
  targetColumnIndex: number;
}

export interface ITranslationJob {
  id: string;
  fileName: string;
  textColumn: string;
  sourceLanguage: string;
  targetLanguage: string;
  modelId: string;
  fileId?: string;
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
