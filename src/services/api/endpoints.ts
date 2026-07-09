// Normalize base URL (remove trailing slashes) to avoid accidental double-slashes
export const BASE_URL = (import.meta.env.VITE_REACT_APP_MTSTUDIO_ENDPOINT || '').replace(/\/+$/, '');
// NOTE: above removes trailing slashes from the configured base URL.

export const ENDPOINTS = {
  // Auth
  AUTH_LOGIN: `/auth/login`,
  AUTH_REGISTER: `/auth/register`,
  AUTH_RESET_PASSWORD_TOKEN: `/auth/reset-password-token`,
  AUTH_RESET_PASSWORD: `/auth/reset-password`,
  AUTH_REFRESH: `/auth/refresh`,

  // Upload
  UPLOAD_CSV: `/services/upload`,

  // Translation
  TRANSLATE: `/services/translate/`,
  TRANSLATE_STATUS: (jobId: string) =>
    `/services/translate/translation-status?job_id=${jobId}`,

  // Export/Results
  EXPORT_CSV: (jobId: string) => `/services/results/job/${jobId}/download`,
  GET_TRANSLATION_RESULT: (jobId: string) => `/services/results/job/${jobId}/result`,

  // Models
  MODELS: `/services/model/models`,
  MODEL_BY_ID: (modelId: string) => `/services/model/models/${modelId}`,

  // Languages
  LANGUAGES: `/services/lang/languages`,

  // Account
  ACCOUNT: `/account`,
  ACCOUNT_PROFILE: `/account/profile`,

  // Utility
  COUNTRIES_STATES: "static/countries-states.json",
};
