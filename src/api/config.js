/**
 * CircularShield API Configuration
 * Central environment settings and client defaults.
 */

// Strip trailing slashes from base URL
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '');

// Default HTTP request timeout (milliseconds)
export const DEFAULT_TIMEOUT_MS = parseInt(
  import.meta.env.VITE_API_TIMEOUT_MS || '30000',
  10
);

// Maximum allowed upload size (bytes) - default 10MB
export const MAX_UPLOAD_BYTES = parseInt(
  import.meta.env.VITE_MAX_FILE_SIZE_BYTES || '10485760',
  10
);

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeoutMs: DEFAULT_TIMEOUT_MS,
  maxUploadBytes: MAX_UPLOAD_BYTES,
  isProduction: import.meta.env.PROD,
  isDevelopment: import.meta.env.DEV,
  clientHeaders: {
    'X-Client-Platform': 'CircularShield-Web',
    'X-Client-Version': '1.0.0',
  },
};

export default API_CONFIG;
