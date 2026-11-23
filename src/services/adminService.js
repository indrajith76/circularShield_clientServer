/**
 * CircularShield Admin Management Service
 * Administrative operations: user management, verification queue, scam reports review,
 * threat statistics, and activity audit logging.
 */

import { apiClient } from '../api/client';
import { ENDPOINTS } from '../api/endpoints';

export const adminService = {
  /**
   * Fetch high-level admin dashboard operational metrics
   */
  async getDashboardMetrics() {
    return apiClient.get(ENDPOINTS.ADMIN.METRICS);
  },

  // --------------------------------------------------------------------------
  // USER MANAGEMENT
  // --------------------------------------------------------------------------

  /**
   * List platform users with search, role, and status filters
   * @param {Object} params { page, limit, search, role, status }
   */
  async getUsers(params = {}) {
    return apiClient.get(ENDPOINTS.ADMIN.USERS, { params });
  },

  /**
   * Get single user account details
   * @param {string} userId
   */
  async getUserById(userId) {
    return apiClient.get(ENDPOINTS.ADMIN.USER_DETAIL(userId));
  },

  /**
   * Provision a new user account
   * @param {Object} userData
   */
  async createUser(userData) {
    return apiClient.post(ENDPOINTS.ADMIN.USERS, userData);
  },

  /**
   * Update user details
   * @param {string} userId
   * @param {Object} userData
   */
  async updateUser(userId, userData) {
    return apiClient.put(ENDPOINTS.ADMIN.USER_DETAIL(userId), userData);
  },

  /**
   * Toggle user active/deactivated status
   * @param {string} userId
   * @param {string} status 'active' | 'deactivated'
   */
  async toggleUserStatus(userId, status) {
    return apiClient.patch(ENDPOINTS.ADMIN.USER_STATUS(userId), { status });
  },

  /**
   * Delete user account permanently
   * @param {string} userId
   */
  async deleteUser(userId) {
    return apiClient.delete(ENDPOINTS.ADMIN.USER_DETAIL(userId));
  },

  // --------------------------------------------------------------------------
  // ORGANIZATION VERIFICATION QUEUE
  // --------------------------------------------------------------------------

  /**
   * Fetch verification requests waiting for auditor triage
   * @param {Object} params { page, limit, status }
   */
  async getVerificationQueue(params = {}) {
    return apiClient.get(ENDPOINTS.ADMIN.VERIFICATIONS, { params });
  },

  /**
   * Approve or reject an organization accreditation request
   * @param {string} queueId
   * @param {Object} reviewData { decision: 'approved' | 'rejected', notes, reason }
   */
  async reviewVerification(queueId, reviewData) {
    return apiClient.post(
      ENDPOINTS.ADMIN.REVIEW_VERIFICATION(queueId),
      reviewData
    );
  },

  // --------------------------------------------------------------------------
  // SCAM REPORT TRIAGE
  // --------------------------------------------------------------------------

  /**
   * Fetch whistleblower scam reports for administrative review
   * @param {Object} params { page, limit, status, priority }
   */
  async getScamReports(params = {}) {
    return apiClient.get(ENDPOINTS.ADMIN.SCAM_REPORTS, { params });
  },

  /**
   * Review scam report (confirm as verified fraud alert or dismiss)
   * @param {string} reportId
   * @param {Object} reviewData { status: 'confirmed_scam' | 'dismissed', notes }
   */
  async reviewScamReport(reportId, reviewData) {
    return apiClient.post(
      ENDPOINTS.ADMIN.REVIEW_SCAM_REPORT(reportId),
      reviewData
    );
  },

  // --------------------------------------------------------------------------
  // ORGANIZATION MANAGEMENT
  // --------------------------------------------------------------------------

  /**
   * Fetch managed organizations directory
   * @param {Object} params { page, limit, search, status }
   */
  async getOrganizations(params = {}) {
    return apiClient.get(ENDPOINTS.ADMIN.ORGANIZATIONS, { params });
  },

  /**
   * Update organization profile and accreditation records
   * @param {string} orgId
   * @param {Object} orgData
   */
  async updateOrganization(orgId, orgData) {
    return apiClient.put(ENDPOINTS.ADMIN.ORGANIZATION_DETAIL(orgId), orgData);
  },

  // --------------------------------------------------------------------------
  // INTELLIGENCE & AUDIT LOGS
  // --------------------------------------------------------------------------

  /**
   * Fetch fraud detection metrics scaled by timeframe
   * @param {Object} params { timeframe: '7d' | '30d' | '90d' | 'all' }
   */
  async getDetectionStats(params = {}) {
    return apiClient.get(ENDPOINTS.ADMIN.DETECTION_STATS, { params });
  },

  /**
   * Fetch immutable admin audit log entries
   * @param {Object} params { page, limit, action, adminId }
   */
  async getActivityLogs(params = {}) {
    return apiClient.get(ENDPOINTS.ADMIN.ACTIVITY_LOGS, { params });
  },
};

export default adminService;
