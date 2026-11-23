/**
 * CircularShield Safety Tips Service
 * Public safety education articles and administrative content management.
 */

import { apiClient } from '../api/client';
import { ENDPOINTS } from '../api/endpoints';

export const safetyTipService = {
  /**
   * Fetch public safety articles with category and search filters
   * @param {Object} params { category, tag, search, page, limit }
   */
  async getSafetyTips(params = {}) {
    return apiClient.get(ENDPOINTS.SAFETY_TIPS.LIST, {
      params,
      skipAuth: true,
    });
  },

  /**
   * Fetch single safety guide article by ID
   * @param {string} tipId
   */
  async getSafetyTipById(tipId) {
    return apiClient.get(ENDPOINTS.SAFETY_TIPS.DETAIL(tipId), {
      skipAuth: true,
    });
  },

  /**
   * Create a new safety guide article (Admin only)
   * @param {Object} tipData
   */
  async createSafetyTip(tipData) {
    return apiClient.post(ENDPOINTS.SAFETY_TIPS.CREATE, tipData);
  },

  /**
   * Update an existing safety article (Admin only)
   * @param {string} tipId
   * @param {Object} tipData
   */
  async updateSafetyTip(tipId, tipData) {
    return apiClient.put(ENDPOINTS.SAFETY_TIPS.UPDATE(tipId), tipData);
  },

  /**
   * Delete a safety article (Admin only)
   * @param {string} tipId
   */
  async deleteSafetyTip(tipId) {
    return apiClient.delete(ENDPOINTS.SAFETY_TIPS.DELETE(tipId));
  },

  /**
   * Toggle published/draft state of an article (Admin only)
   * @param {string} tipId
   */
  async togglePublishStatus(tipId) {
    return apiClient.patch(ENDPOINTS.SAFETY_TIPS.TOGGLE_PUBLISH(tipId));
  },
};

export default safetyTipService;
