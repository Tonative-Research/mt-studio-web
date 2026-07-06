export const BASE_URL = import.meta.env.VITE_REACT_APP_MTSTUDIO_ENDPOINT;
export const API_PREFIX = "api/v1";

export const ENDPOINTS = {
  // Auth
  AUTH_LOGIN: `${API_PREFIX}/auth/login`,
  AUTH_REGISTER: `${API_PREFIX}/auth/register`,
  AUTH_RESET_PASSWORD_TOKEN: `${API_PREFIX}/auth/reset-password-token`,
  AUTH_RESET_PASSWORD: `${API_PREFIX}/auth/reset-password`,
  AUTH_REFRESH: `${API_PREFIX}/auth/refresh`,

  // Upload
  UPLOAD_CSV: `${API_PREFIX}/upload/csv`,

  // Translation
  TRANSLATE: `${API_PREFIX}/translate`,
  TRANSLATE_STATUS: (jobId: string) =>
    `${API_PREFIX}/translate/${jobId}/status`,

  // Export
  EXPORT_CSV: (jobId: string) => `${API_PREFIX}/export/${jobId}/csv`,

  // Models
  MODELS: `${API_PREFIX}/models`,

  // Account
  ACCOUNT: `${API_PREFIX}/account`,
  ACCOUNT_PROFILE: `${API_PREFIX}/account/profile`,

  // Utility
  COUNTRIES_STATES: "static/countries-states.json",
};
