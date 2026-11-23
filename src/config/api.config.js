/**
 * CircularShield API Configuration
 * All backend integration settings are driven by environment variables.
 * No AI/fraud-detection logic lives here — this is purely the HTTP contract layer.
 */

// Resolve Vite env variables (VITE_ prefixed are exposed to client code)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const ANALYSIS_TIMEOUT_MS = parseInt(import.meta.env.VITE_ANALYSIS_TIMEOUT_MS || '30000', 10);

// Configurable maximum file size (bytes). Default 10 MB.
const MAX_FILE_SIZE_BYTES = parseInt(import.meta.env.VITE_MAX_FILE_SIZE_BYTES || '10485760', 10);

// Allowed file extensions and MIME types for circular uploads.
const ALLOWED_FILE_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png'];
const ALLOWED_FILE_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
];

export const API_ENDPOINTS = {
  ANALYZE: `${API_BASE_URL}/analysis`,
  ANALYZE_HEALTH: `${API_BASE_URL}/analysis/health`,
};

export const ANALYSIS_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: ANALYSIS_TIMEOUT_MS,
  maxFileSizeBytes: MAX_FILE_SIZE_BYTES,
  allowedExtensions: ALLOWED_FILE_EXTENSIONS,
  allowedMimeTypes: ALLOWED_FILE_MIME_TYPES,
};

export const INPUT_TYPES = {
  PDF: 'pdf',
  IMAGE: 'image',
  TEXT: 'text',
  URL: 'url',
};

export const ANALYSIS_STATES = {
  IDLE: 'idle',
  VALIDATING: 'validating',
  UPLOADING: 'uploading',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
};

export const PROCESSING_MESSAGES = {
  RECEIVING: 'Receiving job circular.',
  EXTRACTING: 'Extracting circular information.',
  ANALYZING: 'Analyzing recruitment details.',
  FRAUD_CHECK: 'Checking fraud indicators.',
  RISK_ASSESSMENT: 'Preparing risk assessment.',
};

export default {
  API_ENDPOINTS,
  ANALYSIS_CONFIG,
  INPUT_TYPES,
  ANALYSIS_STATES,
  PROCESSING_MESSAGES,
};
