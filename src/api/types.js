/**
 * CircularShield Standard API Types & Schemas
 * Type contracts and response envelope builders for client-server communication.
 */

/**
 * Standard API Response Envelope
 */
export const createApiResponse = ({
  success = true,
  data = null,
  message = '',
  meta = null,
}) => ({
  success,
  data,
  message,
  meta,
  timestamp: new Date().toISOString(),
});

/**
 * Standard Paginated Response Envelope
 */
export const createPaginatedResponse = ({
  data = [],
  page = 1,
  limit = 10,
  total = 0,
  message = '',
}) => ({
  success: true,
  data,
  meta: {
    page: Number(page),
    limit: Number(limit),
    total: Number(total),
    totalPages: Math.ceil(total / limit) || 1,
    hasNext: Number(page) * Number(limit) < Number(total),
    hasPrev: Number(page) > 1,
  },
  message,
  timestamp: new Date().toISOString(),
});

/**
 * Standard Error Envelope
 */
export const createErrorResponse = ({
  code = 'UNKNOWN_ERROR',
  message = 'An unexpected error occurred.',
  status = 500,
  details = null,
}) => ({
  success: false,
  error: {
    code,
    message,
    status,
    details,
  },
  timestamp: new Date().toISOString(),
});

// Domain Enums
export const RISK_LEVEL = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
  UNKNOWN: 'unknown',
};

export const VERIFICATION_STATUS = {
  VERIFIED: 'verified',
  SUSPICIOUS: 'suspicious',
  UNVERIFIED: 'unverified',
  FLAGGED: 'flagged',
  PENDING: 'pending',
};

export const SCAM_REPORT_STATUS = {
  INVESTIGATING: 'investigating',
  CONFIRMED_SCAM: 'confirmed_scam',
  DISMISSED: 'dismissed',
  RESOLVED: 'resolved',
};

export const USER_SYSTEM_ROLE = {
  USER: 'USER',
  ADMIN: 'ADMIN',
};

export const INPUT_TYPE = {
  PDF: 'pdf',
  IMAGE: 'image',
  TEXT: 'text',
  URL: 'url',
};
