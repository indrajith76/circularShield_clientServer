/**
 * CircularShield API Core Architecture
 * Central re-export of HTTP client, configuration, endpoints, types, and error handlers.
 */

export { apiClient, default as ApiClient } from './client';
export { tokenStorage } from './tokenStorage';
export {
  ApiError,
  ERROR_CODES,
  mapStatusToErrorCode,
  normalizeError,
  getUserFriendlyErrorMessage,
} from './errors';
export { ENDPOINTS } from './endpoints';
export { API_CONFIG, API_BASE_URL, DEFAULT_TIMEOUT_MS, MAX_UPLOAD_BYTES } from './config';
export {
  createApiResponse,
  createPaginatedResponse,
  createErrorResponse,
  RISK_LEVEL,
  VERIFICATION_STATUS,
  SCAM_REPORT_STATUS,
  USER_SYSTEM_ROLE,
  INPUT_TYPE,
} from './types';
