/**
 * CircularShield Analysis Adapters
 *
 * Request adapters: build payloads the backend expects.
 * Response adapters: normalize backend responses into a UI-friendly shape,
 * safely handling missing or optional fields.
 *
 * These adapters contain NO detection logic. They only translate data shapes.
 */

import { INPUT_TYPES, PROCESSING_MESSAGES } from '../../config/api.config';

// ---------------------------------------------------------------------------
// Request Adapters
// ---------------------------------------------------------------------------

/**
 * Build the request payload for a file-based analysis.
 * Returns FormData ready for multipart/submission.
 */
export const buildFileRequest = (file, inputType) => ({
  inputType,
  file,
});

/**
 * Build the request payload for a text-based analysis.
 */
export const buildTextRequest = (text) => ({
  inputType: INPUT_TYPES.TEXT,
  text,
});

/**
 * Build the request payload for a URL-based analysis.
 */
export const buildUrlRequest = (url) => ({
  inputType: INPUT_TYPES.URL,
  url,
});

// ---------------------------------------------------------------------------
// Response Adapters
// ---------------------------------------------------------------------------

/**
 * Safely extract a value, returning a default when missing/undefined/null.
 */
const safe = (value, defaultValue = null) =>
  value === undefined || value === null ? defaultValue : value;

/**
 * Normalize a risk score to a 0–100 integer, safely handling missing values.
 */
const normalizeScore = (value) => {
  const num = Number(value);
  if (Number.isNaN(num)) return null;
  return Math.min(100, Math.max(0, Math.round(num)));
};

/**
 * Normalize a risk level string. Falls back to 'unknown' when absent.
 */
const normalizeRiskLevel = (value) => {
  const valid = ['low', 'medium', 'high', 'critical'];
  const normalized = String(value || '').toLowerCase().trim();
  return valid.includes(normalized) ? normalized : 'unknown';
};

/**
 * Normalize a final status string. Falls back to 'unknown' when absent.
 */
const normalizeStatus = (value) => {
  const valid = ['verified', 'suspicious', 'unverified', 'unknown'];
  const normalized = String(value || '').toLowerCase().trim();
  return valid.includes(normalized) ? normalized : 'unknown';
};

/**
 * Ensure an array value is always an array.
 */
const ensureArray = (value) => (Array.isArray(value) ? value : []);

/**
 * Ensure an object value is always an object.
 */
const ensureObject = (value) =>
  value && typeof value === 'object' && !Array.isArray(value) ? value : {};

/**
 * Adapt a raw backend analysis response into a UI-friendly shape.
 * All fields are optional and safely defaulted.
 *
 * Expected backend shape (example):
 * {
 *   success: true,
 *   data: {
 *     id: 'str',
 *     input_type: 'pdf',
 *     risk_score: 72,
 *     risk_level: 'high',
 *     final_status: 'suspicious',
 *     fraud_indicators: [{ id, title, severity, description }],
 *     evidence: {...},
 *     organization_verification: { verified, orgName, confidence },
 *     url_verification: { valid, domain, matchesOfficial },
 *     suspicious_contact_details: [{ type, value, reason }],
 *     explanations: { bn: '...', en: '...' },
 *     recommended_safety_actions: ['...'],
 *     processing_time_ms: 1234
 *   }
 * }
 */
export const adaptAnalysisResponse = (rawResponse) => {
  const data = ensureObject(rawResponse && rawResponse.data);

  const fraudIndicators = ensureArray(
    data.fraud_indicators || data.fraudIndicators || data.indicators,
  ).map((indicator) => ({
    id: safe(indicator.id, `indicator-${Math.random().toString(36).slice(2, 9)}`),
    title: safe(indicator.title, 'Unnamed indicator'),
    severity: safe(indicator.severity, 'medium'),
    description: safe(indicator.description, ''),
  }));

  const suspiciousContacts = ensureArray(
    data.suspicious_contact_details || data.suspiciousContactDetails || data.contacts,
  ).map((contact) => ({
    type: safe(contact.type, 'contact'),
    value: safe(contact.value, ''),
    reason: safe(contact.reason, ''),
  }));

  const recommendedActions = ensureArray(
    data.recommended_safety_actions ||
      data.recommendedSafetyActions ||
      data.recommendations,
  ).filter(Boolean);

  const explanations = ensureObject(data.explanations || data.bilingual);

  const organizationVerification = ensureObject(
    data.organization_verification || data.organizationVerification,
  );

  const urlVerification = ensureObject(
    data.url_verification || data.urlVerification,
  );

  const evidence = ensureObject(data.evidence);

  return {
    id: safe(data.id, `ANA-${Date.now()}`),
    inputType: safe(data.input_type || data.inputType),
    riskScore: normalizeScore(data.risk_score || data.riskScore),
    riskLevel: normalizeRiskLevel(data.risk_level || data.riskLevel),
    finalStatus: normalizeStatus(data.final_status || data.finalStatus || data.status),
    fraudIndicators,
    evidence,
    organizationVerification,
    urlVerification,
    suspiciousContactDetails: suspiciousContacts,
    explanations: {
      bn: safe(explanations.bn || explanations.bangla, ''),
      en: safe(explanations.en || explanations.english || explanations.explanation, ''),
    },
    recommendedSafetyActions: recommendedActions,
    processingTimeMs: normalizeScore(data.processing_time_ms || data.processingTimeMs),
    raw: data, // preserve raw backend payload for debugging
  };
};

/**
 * Adapt a backend analysis error into a user-friendly message and code.
 */
export const adaptAnalysisError = (error) => {
  if (!error) {
    return {
      code: 'UNKNOWN_ERROR',
      message: 'An unexpected error occurred. Please try again.',
      retryable: true,
    };
  }

  // AnalysisError thrown by the service layer already carries code/message.
  if (error.code) {
    const retryableCodes = ['NETWORK_ERROR', 'TIMEOUT', 'PROCESSING_FAILED'];
    return {
      code: error.code,
      message: error.message || 'Analysis failed. Please try again.',
      retryable: retryableCodes.includes(error.code),
      status: error.status,
    };
  }

  // Generic fallback
  return {
    code: 'UNKNOWN_ERROR',
    message: error.message || 'An unexpected error occurred. Please try again.',
    retryable: true,
  };
};

/**
 * Ordered list of UI-only processing step messages.
 * These are display representations only — they do NOT reflect the backend
 * AI model's internal steps. Only show actual backend progress when the API
 * supports it (see `raw.backendProgress`).
 */
export const UI_PROCESSING_STEPS = [
  { key: 'receiving', message: PROCESSING_MESSAGES.RECEIVING },
  { key: 'extracting', message: PROCESSING_MESSAGES.EXTRACTING },
  { key: 'analyzing', message: PROCESSING_MESSAGES.ANALYZING },
  { key: 'fraudCheck', message: PROCESSING_MESSAGES.FRAUD_CHECK },
  { key: 'riskAssessment', message: PROCESSING_MESSAGES.RISK_ASSESSMENT },
];

export default {
  buildFileRequest,
  buildTextRequest,
  buildUrlRequest,
  adaptAnalysisResponse,
  adaptAnalysisError,
  UI_PROCESSING_STEPS,
};
