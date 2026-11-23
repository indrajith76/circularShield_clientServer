/**
 * CircularShield Centralized API Errors
 * Normalized error hierarchy and classification for all network, HTTP,
 * and client-side validation failures.
 */

export const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  RATE_LIMITED: 'RATE_LIMITED',
  SERVER_ERROR: 'SERVER_ERROR',
  REQUEST_CANCELLED: 'REQUEST_CANCELLED',
  DUPLICATE_SUBMISSION: 'DUPLICATE_SUBMISSION',
  BAD_REQUEST: 'BAD_REQUEST',
  UNSUPPORTED_MEDIA: 'UNSUPPORTED_MEDIA',
  UNKNOWN: 'UNKNOWN_ERROR',
};

/**
 * Standardized API Error representation
 */
export class ApiError extends Error {
  constructor(message, code = ERROR_CODES.UNKNOWN, status = 0, details = null) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
    this.timestamp = new Date().toISOString();

    // Classification helpers
    this.isNetworkError = code === ERROR_CODES.NETWORK_ERROR;
    this.isTimeout = code === ERROR_CODES.TIMEOUT;
    this.isUnauthorized = code === ERROR_CODES.UNAUTHORIZED || status === 401;
    this.isForbidden = code === ERROR_CODES.FORBIDDEN || status === 403;
    this.isValidationError = code === ERROR_CODES.VALIDATION_ERROR || status === 422 || status === 400;
    this.isDuplicate = code === ERROR_CODES.DUPLICATE_SUBMISSION;
    this.isNotFound = code === ERROR_CODES.NOT_FOUND || status === 404;
    this.isCancelled = code === ERROR_CODES.REQUEST_CANCELLED;
  }
}

/**
 * Maps an HTTP status code to an ApiError code
 */
export const mapStatusToErrorCode = (status) => {
  switch (status) {
    case 400:
      return ERROR_CODES.BAD_REQUEST;
    case 401:
      return ERROR_CODES.UNAUTHORIZED;
    case 403:
      return ERROR_CODES.FORBIDDEN;
    case 404:
      return ERROR_CODES.NOT_FOUND;
    case 409:
      return ERROR_CODES.CONFLICT;
    case 413:
      return ERROR_CODES.VALIDATION_ERROR;
    case 415:
      return ERROR_CODES.UNSUPPORTED_MEDIA;
    case 422:
      return ERROR_CODES.VALIDATION_ERROR;
    case 429:
      return ERROR_CODES.RATE_LIMITED;
    case 500:
    case 502:
    case 503:
      return ERROR_CODES.SERVER_ERROR;
    case 504:
      return ERROR_CODES.TIMEOUT;
    default:
      return status >= 500 ? ERROR_CODES.SERVER_ERROR : ERROR_CODES.UNKNOWN;
  }
};

/**
 * Formats technical error codes into user-friendly, non-technical English messages
 */
export const getUserFriendlyErrorMessage = (error) => {
  if (!error) return 'An unexpected error occurred. Please try again.';

  if (typeof error === 'string') return error;

  switch (error.code) {
    case ERROR_CODES.NETWORK_ERROR:
      return 'Unable to reach the server. Please check your internet connection and try again.';
    case ERROR_CODES.TIMEOUT:
      return 'The request took too long to complete. Please try again later.';
    case ERROR_CODES.UNAUTHORIZED:
      return 'Your session has expired. Please sign in again to continue.';
    case ERROR_CODES.FORBIDDEN:
      return 'You do not have permission to perform this action.';
    case ERROR_CODES.NOT_FOUND:
      return 'The requested record or resource could not be found.';
    case ERROR_CODES.CONFLICT:
      return error.message || 'This record already exists or conflicts with current state.';
    case ERROR_CODES.VALIDATION_ERROR:
      return error.message || 'Please check your inputs and correct the highlighted fields.';
    case ERROR_CODES.RATE_LIMITED:
      return 'Too many requests. Please wait a few moments before trying again.';
    case ERROR_CODES.SERVER_ERROR:
      return 'A server error occurred. Our engineering team has been alerted.';
    case ERROR_CODES.DUPLICATE_SUBMISSION:
      return 'A submission is already in progress. Please wait a moment.';
    case ERROR_CODES.REQUEST_CANCELLED:
      return 'The request was cancelled.';
    default:
      return error.message || 'An error occurred while processing your request.';
  }
};

/**
 * Normalizes any error object (Network, DOMException, HTTP response, Error) into ApiError
 */
export const normalizeError = (err) => {
  if (err instanceof ApiError) return err;

  if (err?.name === 'AbortError') {
    return new ApiError(
      'The request was cancelled or timed out.',
      ERROR_CODES.REQUEST_CANCELLED,
      0,
      err
    );
  }

  if (err instanceof TypeError && err.message.toLowerCase().includes('fetch')) {
    return new ApiError(
      'Network error: Failed to connect to CircularShield API server.',
      ERROR_CODES.NETWORK_ERROR,
      0,
      err
    );
  }

  return new ApiError(
    err?.message || 'An unexpected error occurred.',
    ERROR_CODES.UNKNOWN,
    err?.status || 0,
    err
  );
};
