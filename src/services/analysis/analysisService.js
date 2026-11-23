/**
 * CircularShield Analysis Service
 * HTTP client for submitting job circular analysis requests to the backend.
 *
 * Responsibilities:
 * - Build and dispatch analysis requests (multipart for files, JSON for text/url)
 * - Apply request timeout
 * - Normalize HTTP/network errors into a consistent error shape
 *
 * This service contains NO fraud detection, keyword matching, or risk scoring logic.
 * All determination is performed by the backend AI model.
 */

import {
  API_ENDPOINTS,
  ANALYSIS_CONFIG,
  INPUT_TYPES,
} from '../../config/api.config';

/**
 * Normalized analysis error shape consumed by the UI layer.
 */
export class AnalysisError extends Error {
  constructor(message, code, status, details) {
    super(message);
    this.name = 'AnalysisError';
    this.code = code; // e.g. VALIDATION_ERROR, FILE_TOO_LARGE, NETWORK_ERROR, TIMEOUT, PROCESSING_FAILED, UNSUPPORTED_FORMAT
    this.status = status; // HTTP status code when available
    this.details = details; // raw backend payload when available
  }
}

/**
 * AbortController-backed fetch with timeout.
 */
const fetchWithTimeout = async (url, options, timeoutMs) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new AnalysisError(
        'Analysis request timed out. Please try again.',
        'TIMEOUT',
        504,
      );
    }
    throw new AnalysisError(
      err.message || 'Network error. Unable to reach the analysis service.',
      'NETWORK_ERROR',
      0,
    );
  } finally {
    clearTimeout(timeoutId);
  }
};

/**
 * Parse a backend response into a normalized result or throw AnalysisError.
 */
const parseResponse = async (response) => {
  const status = response.status;
  let body;
  const contentType = response.headers.get('content-type') || '';

  try {
    if (contentType.includes('application/json')) {
      body = await response.json();
    } else {
      body = { rawText: await response.text() };
    }
  } catch {
    body = null;
  }

  if (!response.ok) {
    const backendError = body && body.error ? body.error : {};
    throw new AnalysisError(
      backendError.message || `Request failed with status ${status}`,
      backendError.code || 'PROCESSING_FAILED',
      status,
      body,
    );
  }

  return body;
};

/**
 * Submit a file-based analysis request (PDF or image) using multipart/form-data.
 * The file is NOT assumed to be successfully uploaded until the backend responds.
 */
export const submitFileAnalysis = async (file, inputType) => {
  const formData = new FormData();
  formData.append('input_type', inputType);
  formData.append('file', file);

  const response = await fetchWithTimeout(
    API_ENDPOINTS.ANALYZE,
    {
      method: 'POST',
      body: formData,
      // Do NOT set Content-Type header; the browser sets the multipart boundary automatically.
    },
    ANALYSIS_CONFIG.timeout,
  );

  return parseResponse(response);
};

/**
 * Submit a text-based analysis request using JSON.
 */
export const submitTextAnalysis = async (text) => {
  const response = await fetchWithTimeout(
    API_ENDPOINTS.ANALYZE,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        input_type: INPUT_TYPES.TEXT,
        text,
      }),
    },
    ANALYSIS_CONFIG.timeout,
  );

  return parseResponse(response);
};

/**
 * Submit a URL-based analysis request using JSON.
 */
export const submitUrlAnalysis = async (url) => {
  const response = await fetchWithTimeout(
    API_ENDPOINTS.ANALYZE,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        input_type: INPUT_TYPES.URL,
        url,
      }),
    },
    ANALYSIS_CONFIG.timeout,
  );

  return parseResponse(response);
};

/**
 * Dispatch the appropriate analysis request based on input type.
 * This is the single entry point used by the useAnalysis hook.
 */
export const submitAnalysis = async ({ inputType, file, text, url }) => {
  switch (inputType) {
    case INPUT_TYPES.PDF:
    case INPUT_TYPES.IMAGE:
      if (!file) {
        throw new AnalysisError('No file provided for analysis.', 'VALIDATION_ERROR', 400);
      }
      return submitFileAnalysis(file, inputType);
    case INPUT_TYPES.TEXT:
      return submitTextAnalysis(text);
    case INPUT_TYPES.URL:
      return submitUrlAnalysis(url);
    default:
      throw new AnalysisError(
        `Unsupported input type: ${inputType}`,
        'UNSUPPORTED_FORMAT',
        400,
      );
  }
};

export default {
  submitAnalysis,
  submitFileAnalysis,
  submitTextAnalysis,
  submitUrlAnalysis,
  AnalysisError,
};
