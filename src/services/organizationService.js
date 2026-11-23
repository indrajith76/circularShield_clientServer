/**
 * CircularShield Organization Service
 * Directory search, accreditation profile lookup, and verification applications.
 */

import { apiClient } from '../api/client';
import { ENDPOINTS } from '../api/endpoints';

export const organizationService = {
  /**
   * Fetch verified organizations directory with filters and pagination
   * @param {Object} params { query, category, page, limit, sort }
   */
  async getOrganizations(params = {}) {
    return apiClient.get(ENDPOINTS.ORGANIZATIONS.LIST, {
      params,
      skipAuth: true,
    });
  },

  /**
   * Fetch single organization profile by ID
   * @param {string} organizationId
   */
  async getOrganizationById(organizationId) {
    return apiClient.get(ENDPOINTS.ORGANIZATIONS.DETAIL(organizationId), {
      skipAuth: true,
    });
  },

  /**
   * Fast search query for verified organizations
   * @param {string} query
   */
  async searchOrganizations(query) {
    return apiClient.get(ENDPOINTS.ORGANIZATIONS.SEARCH, {
      params: { q: query },
      skipAuth: true,
    });
  },

  /**
   * Submit corporate accreditation / verification application
   * @param {Object|FormData} requestData
   */
  async submitVerificationRequest(requestData) {
    if (typeof FormData !== 'undefined' && requestData instanceof FormData) {
      return apiClient.upload(ENDPOINTS.ORGANIZATIONS.VERIFY_REQUEST, requestData);
    }
    return apiClient.post(ENDPOINTS.ORGANIZATIONS.VERIFY_REQUEST, requestData);
  },

  /**
   * Check status of a submitted accreditation application
   * @param {string} requestId
   */
  async getVerificationStatus(requestId) {
    return apiClient.get(ENDPOINTS.ORGANIZATIONS.VERIFICATION_STATUS(requestId));
  },
};

export default organizationService;
