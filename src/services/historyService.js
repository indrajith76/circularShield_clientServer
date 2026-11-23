/**
 * CircularShield Analysis History Service
 * Access to user's previously analyzed circulars and export functionality.
 */

import { apiClient } from '../api/client';
import { ENDPOINTS } from '../api/endpoints';

export const historyService = {
  /**
   * Fetch user's personal circular analysis history with pagination & filters
   * @param {Object} params { page, limit, status, riskLevel, dateFrom, dateTo }
   */
  async getAnalysisHistory(params = {}) {
    return apiClient.get(ENDPOINTS.HISTORY.ANALYSES, { params });
  },

  /**
   * Fetch detailed report of a historical analysis
   * @param {string} analysisId
   */
  async getHistoryItem(analysisId) {
    return apiClient.get(ENDPOINTS.HISTORY.ANALYSIS_DETAIL(analysisId));
  },

  /**
   * Delete a historical scan from user records
   * @param {string} analysisId
   */
  async deleteHistoryItem(analysisId) {
    return apiClient.delete(ENDPOINTS.HISTORY.ANALYSIS_DETAIL(analysisId));
  },

  /**
   * Export historical checks as CSV or JSON file download
   * @param {Object} options { format: 'csv' | 'json' }
   */
  async exportHistory(options = {}) {
    const { format = 'csv' } = options;
    return apiClient.get(ENDPOINTS.HISTORY.EXPORT, {
      params: { format },
      responseType: 'blob',
    });
  },

  /**
   * Clear all historical scans for the authenticated user
   */
  async clearHistory() {
    return apiClient.delete(ENDPOINTS.HISTORY.CLEAR);
  },
};

export default historyService;
