/**
 * CircularShield Job Circular Analysis Service
 * HTTP client for submitting circular verification requests to the AI backend.
 *
 * This service contains NO fraud detection or risk scoring logic.
 * All determination is performed by the backend AI model.
 */

import { apiClient } from '../api/client';
import { ENDPOINTS } from '../api/endpoints';
import { INPUT_TYPE } from '../api/types';

export const analysisService = {
  /**
   * Submit a file-based circular analysis (PDF or Image)
   * @param {File} file - PDF or image file
   * @param {Object} options - Optional parameters: { inputType, signal, onProgress }
   */
  async submitFileAnalysis(file, options = {}) {
    const { inputType = INPUT_TYPE.PDF, signal } = options;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('inputType', inputType);

    return apiClient.upload(ENDPOINTS.ANALYSIS.FILE, formData, {
      signal,
      timeout: 60000, // 60s timeout for heavy OCR/multimodal processing
    });
  },

  /**
   * Submit raw circular text for NLP fraud analysis
   * @param {string} text - Job circular body text
   * @param {Object} options - Optional parameters: { signal }
   */
  async submitTextAnalysis(text, options = {}) {
    const { signal } = options;

    return apiClient.post(
      ENDPOINTS.ANALYSIS.TEXT,
      {
        text,
        inputType: INPUT_TYPE.TEXT,
      },
      {
        signal,
        timeout: 30000,
      }
    );
  },

  /**
   * Submit job circular web link for URL inspection & verification
   * @param {string} url - Target job posting URL
   * @param {Object} options - Optional parameters: { signal }
   */
  async submitUrlAnalysis(url, options = {}) {
    const { signal } = options;

    return apiClient.post(
      ENDPOINTS.ANALYSIS.URL,
      {
        url,
        inputType: INPUT_TYPE.URL,
      },
      {
        signal,
        timeout: 30000,
      }
    );
  },

  /**
   * Poll analysis progress state
   * @param {string} analysisId
   * @param {Object} options - Optional parameters: { signal }
   */
  async getAnalysisStatus(analysisId, options = {}) {
    return apiClient.get(ENDPOINTS.ANALYSIS.STATUS(analysisId), options);
  },

  /**
   * Fetch completed analysis report by ID
   * @param {string} analysisId
   * @param {Object} options - Optional parameters: { signal }
   */
  async getAnalysisResult(analysisId, options = {}) {
    return apiClient.get(ENDPOINTS.ANALYSIS.RESULT(analysisId), options);
  },

  /**
   * Cancel an in-progress analysis task
   * @param {string} analysisId
   */
  async cancelAnalysis(analysisId) {
    return apiClient.post(ENDPOINTS.ANALYSIS.CANCEL(analysisId));
  },

  /**
   * Check health and availability of the analysis engine
   */
  async checkHealth() {
    return apiClient.get(ENDPOINTS.ANALYSIS.HEALTH, { skipAuth: true });
  },
};

export default analysisService;
