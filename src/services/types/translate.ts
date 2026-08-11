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
  percent?: number;
  message?: string;
  hasErrors?: boolean;
  fetchFailed?: boolean; // network/poll failure, distinct from a job-level error
  createdAt: string;
}

// Raw shape returned by POST /services/translate/ (job creation)
// Confirmed via a live job (2026-07-10):
// { job_id, status, source_lang, target_lang, inference_mode, model_name, message }
export interface ITranslationStartResponse {
  job_id: string;
  status: ETranslationStatus;
  source_lang: string;
  target_lang: string;
  inference_mode: string;
  model_name: string;
  message: string;
}

// Raw shape returned by GET /services/translate/translation-status
// CONFIRMED VIA REDUX DEVTOOLS + NETWORK TAB (2026-07-11) — this endpoint
// returns two DIFFERENT shapes depending on status. Do not trust Swagger or
// the /services/translate/ (job creation) response for this shape — they're
// a different endpoint entirely.
//
// While pending/processing (flat):
// { job_id, status, inference_mode, target_lang, total, completed, failed, percent }
//
// Once completed (nested):
// {
//   job_id, status,
//   results: { message, rows_processed, output_file, target_language_code, expires_at, has_errors },
//   data: { status, inference_mode, target_lang, total, completed, failed, percent }
// }
//
// NEVER present on this endpoint in either shape: model_name, source_lang.
// Model must come from currentJob (set at job creation); same for source language.
export interface ITranslationStatusResponse {
  job_id: string;
  status: ETranslationStatus;
  inference_mode?: string;
  target_lang?: string;
  total?: number;
  completed?: number;
  failed?: number;
  percent?: number;
  results?: {
    message?: string;
    rows_processed?: number;
    output_file?: string;
    target_language_code?: string;
    expires_at?: string;
    has_errors?: boolean;
  };
  data?: {
    status?: ETranslationStatus;
    inference_mode?: string;
    target_lang?: string;
    total?: number;
    completed?: number;
    failed?: number;
    percent?: number;
  };
}

// Normalized shape the app actually renders — flattens both API variants above.
export interface ITranslationStatus {
  jobId: string;
  status: ETranslationStatus;
  targetLanguage: string;
  inferenceMode: string;
  totalRows: number;
  completedRows: number;
  failedRows: number;
  percent: number;
  message?: string;
  outputFile?: string;
  expiresAt?: string;
  hasErrors?: boolean;
}

// Raw shape returned by GET /services/results/job/{jobId}/result
// CONFIRMED via live curl (2026-07-11):
// { job_id, status, preview: [{...dynamic columns...}], download_url, expires_at, rows_processed, total_rows }
//
// IMPORTANT: `preview` rows are NOT a fixed { original, translated } pair —
// columns are whatever was in the uploaded CSV, dynamic per job. Render
// column headers from Object.keys() of the actual rows, don't hardcode them.
//
// `total_rows` can be null. It's unconfirmed whether `preview` is ever
// truncated for larger files — treat it as possibly-partial until verified
// against a bigger dataset.
export interface ITranslationResultResponse {
  job_id: string;
  status: ETranslationStatus;
  preview: Record<string, string>[];
  download_url: string;
  expires_at: string;
  rows_processed: number;
  total_rows: number | null;
}

export interface ITranslationResult {
  jobId: string;
  status: ETranslationStatus;
  columns: string[];
  rows: Record<string, string>[];
  expiresAt: string;
  rowsProcessed: number;
  totalRows: number | null;
  // True when we can't confirm `rows` is the complete set (rows_processed
  // exists but total_rows is unknown/null, or rows.length < rows_processed).
  mayBeTruncated: boolean;
}