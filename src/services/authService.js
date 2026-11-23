/**
 * CircularShield Authentication Service
 * Communicates with backend authentication endpoints.
 * Handles login, registration, session checks, password reset, and token rotation.
 */

import { apiClient } from '../api/client';
import { ENDPOINTS } from '../api/endpoints';
import { tokenStorage } from '../api/tokenStorage';

export const authService = {
  /**
   * User Portal Login (/login)
   * @param {Object} credentials { email, password, role }
   * @returns {Promise<{ user: Object, token: string, refreshToken?: string }>}
   */
  async login({ email, password, role = 'seeker' }) {
    const response = await apiClient.post(
      ENDPOINTS.AUTH.LOGIN,
      { email, password, role },
      { skipAuth: true }
    );

    if (response?.token) {
      tokenStorage.setTokens({
        accessToken: response.token,
        refreshToken: response.refreshToken,
      });
    }

    return response;
  },

  /**
   * Admin Portal Login (/admin/login)
   * @param {Object} credentials { email, password }
   * @returns {Promise<{ user: Object, token: string }>}
   */
  async adminLogin({ email, password }) {
    const response = await apiClient.post(
      ENDPOINTS.AUTH.ADMIN_LOGIN,
      { email, password },
      { skipAuth: true }
    );

    if (response?.token) {
      tokenStorage.setTokens({
        accessToken: response.token,
        refreshToken: response.refreshToken,
      });
    }

    return response;
  },

  /**
   * Register a new user account (/register)
   * @param {Object} payload { name, email, password, role, phone }
   */
  async register({ name, email, password, role = 'seeker', phone = '' }) {
    const response = await apiClient.post(
      ENDPOINTS.AUTH.REGISTER,
      { name, email, password, role, phone },
      { skipAuth: true }
    );

    if (response?.token) {
      tokenStorage.setTokens({
        accessToken: response.token,
        refreshToken: response.refreshToken,
      });
    }

    return response;
  },

  /**
   * Log out of current session and invalidate server token
   */
  async logout() {
    try {
      await apiClient.post(ENDPOINTS.AUTH.LOGOUT, null, { timeout: 5000 });
    } catch {
      // Local cleanup occurs regardless of network outcome
    } finally {
      tokenStorage.clearTokens();
    }
  },

  /**
   * Rotate access token using the stored refresh token
   */
  async refreshToken() {
    const currentRefreshToken = tokenStorage.getRefreshToken();
    if (!currentRefreshToken) {
      throw new Error('No refresh token available.');
    }

    const response = await apiClient.post(
      ENDPOINTS.AUTH.REFRESH_TOKEN,
      { refreshToken: currentRefreshToken },
      { skipAuth: true }
    );

    if (response?.token) {
      tokenStorage.setTokens({
        accessToken: response.token,
        refreshToken: response.refreshToken || currentRefreshToken,
      });
    }

    return response;
  },

  /**
   * Request password reset instructions via email
   * @param {string} email
   */
  async forgotPassword(email) {
    return apiClient.post(
      ENDPOINTS.AUTH.FORGOT_PASSWORD,
      { email },
      { skipAuth: true }
    );
  },

  /**
   * Confirm password reset with token
   * @param {Object} payload { token, newPassword }
   */
  async resetPassword({ token, newPassword }) {
    return apiClient.post(
      ENDPOINTS.AUTH.RESET_PASSWORD,
      { token, newPassword },
      { skipAuth: true }
    );
  },

  /**
   * Fetch currently authenticated user session details
   */
  async getCurrentUser() {
    return apiClient.get(ENDPOINTS.AUTH.ME);
  },
};

export default authService;
