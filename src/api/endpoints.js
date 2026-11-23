/**
 * CircularShield Centralized Endpoint Definitions
 * Single source of truth for all backend API routes.
 */

export const ENDPOINTS = {
  // Authentication & Session
  AUTH: {
    LOGIN: '/auth/login',
    ADMIN_LOGIN: '/auth/admin/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    ME: '/auth/me',
  },

  // User Profile & Account Settings
  USER_PROFILE: {
    ME: '/users/me',
    UPDATE: '/users/me',
    CHANGE_PASSWORD: '/users/me/password',
    PREFERENCES: '/users/me/preferences',
    AVATAR: '/users/me/avatar',
    DELETE_ACCOUNT: '/users/me',
  },

  // Job Circular Analysis
  ANALYSIS: {
    FILE: '/analysis/file',
    TEXT: '/analysis/text',
    URL: '/analysis/url',
    STATUS: (id) => `/analysis/${id}/status`,
    RESULT: (id) => `/analysis/${id}`,
    CANCEL: (id) => `/analysis/${id}/cancel`,
    HEALTH: '/analysis/health',
  },

  // Organizations & Accreditations
  ORGANIZATIONS: {
    LIST: '/organizations',
    DETAIL: (id) => `/organizations/${id}`,
    SEARCH: '/organizations/search',
    VERIFY_REQUEST: '/organizations/verify',
    VERIFICATION_STATUS: (id) => `/organizations/verification-status/${id}`,
    CATEGORIES: '/organizations/categories',
  },

  // Whistleblower Scam Reports
  SCAM_REPORTS: {
    LIST: '/scam-reports',
    DETAIL: (id) => `/scam-reports/${id}`,
    SUBMIT: '/scam-reports',
    EVIDENCE: '/scam-reports/evidence',
    WITHDRAW: (id) => `/scam-reports/${id}`,
    CATEGORIES: '/scam-reports/categories',
  },

  // User Analysis & Verification History
  HISTORY: {
    ANALYSES: '/history/analyses',
    ANALYSIS_DETAIL: (id) => `/history/analyses/${id}`,
    EXPORT: '/history/analyses/export',
    CLEAR: '/history/analyses',
    USER_REPORTS: '/history/reports',
  },

  // Admin Management & Operations
  ADMIN: {
    METRICS: '/admin/dashboard/metrics',
    USERS: '/admin/users',
    USER_DETAIL: (id) => `/admin/users/${id}`,
    USER_STATUS: (id) => `/admin/users/${id}/status`,
    VERIFICATIONS: '/admin/verifications',
    REVIEW_VERIFICATION: (id) => `/admin/verifications/${id}/review`,
    SCAM_REPORTS: '/admin/scam-reports',
    REVIEW_SCAM_REPORT: (id) => `/admin/scam-reports/${id}/review`,
    ORGANIZATIONS: '/admin/organizations',
    ORGANIZATION_DETAIL: (id) => `/admin/organizations/${id}`,
    DETECTION_STATS: '/admin/stats/detections',
    ACTIVITY_LOGS: '/admin/activity-logs',
  },

  // Public & Managed Safety Tips
  SAFETY_TIPS: {
    LIST: '/safety-tips',
    DETAIL: (id) => `/safety-tips/${id}`,
    CREATE: '/admin/safety-tips',
    UPDATE: (id) => `/admin/safety-tips/${id}`,
    DELETE: (id) => `/admin/safety-tips/${id}`,
    TOGGLE_PUBLISH: (id) => `/admin/safety-tips/${id}/publish`,
  },
};

export default ENDPOINTS;
