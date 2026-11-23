/**
 * CircularShield Whistleblower Scam Report Service
 * Submission of recruitment fraud alerts, evidence upload, and status tracking.
 */

import { apiClient } from '../api/client';
import { ENDPOINTS } from '../api/endpoints';

export const scamReportService = {
  /**
   * Fetch public or authenticated scam reports with search & status filters
   * @param {Object} params { category, status, query, page, limit }
   */
  async getScamReports(params = {}) {
    return apiClient.get(ENDPOINTS.SCAM_REPORTS.LIST, { params });
  },

  /**
   * Fetch single scam report by ID
   * @param {string} reportId
   */
  async getReportById(reportId) {
    return apiClient.get(ENDPOINTS.SCAM_REPORTS.DETAIL(reportId));
  },

  /**
   * Submit a new whistleblower scam report
   * @param {Object} reportData
   */
  async submitScamReport(reportData) {
    return apiClient.post(ENDPOINTS.SCAM_REPORTS.SUBMIT, reportData);
  },

  /**
   * Upload evidence screenshot or documentation for a scam report
   * @param {File} file
   */
  async uploadEvidence(file) {
    const formData = new FormData();
    formData.append('evidence', file);
    return apiClient.upload(ENDPOINTS.SCAM_REPORTS.EVIDENCE, formData);
  },

  /**
   * Withdraw a submitted scam report
   * @param {string} reportId
   * @param {string} reason
   */
  async withdrawReport(reportId, reason = '') {
    return apiClient.delete(ENDPOINTS.SCAM_REPORTS.WITHDRAW(reportId), {
      data: { reason },
    });
  },
};

export default scamReportService;
