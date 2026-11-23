/**
 * CircularShield User Profile Service
 * Manages personal profile details, notification preferences, and account security.
 */

import { apiClient } from '../api/client';
import { ENDPOINTS } from '../api/endpoints';

export const userProfileService = {
  /**
   * Retrieve current user profile
   */
  async getProfile() {
    return apiClient.get(ENDPOINTS.USER_PROFILE.ME);
  },

  /**
   * Update personal profile information
   * @param {Object} profileData { name, phone, bio, organization }
   */
  async updateProfile(profileData) {
    return apiClient.put(ENDPOINTS.USER_PROFILE.UPDATE, profileData);
  },

  /**
   * Change account password
   * @param {Object} payload { currentPassword, newPassword }
   */
  async changePassword({ currentPassword, newPassword }) {
    return apiClient.put(ENDPOINTS.USER_PROFILE.CHANGE_PASSWORD, {
      currentPassword,
      newPassword,
    });
  },

  /**
   * Update notification and alert preferences
   * @param {Object} preferences { emailAlerts, smsAlerts, pushNotifications }
   */
  async updatePreferences(preferences) {
    return apiClient.patch(ENDPOINTS.USER_PROFILE.PREFERENCES, preferences);
  },

  /**
   * Upload user profile avatar photo
   * @param {File} file
   */
  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);
    return apiClient.upload(ENDPOINTS.USER_PROFILE.AVATAR, formData);
  },

  /**
   * Request permanent account deletion
   */
  async deleteAccount() {
    return apiClient.delete(ENDPOINTS.USER_PROFILE.DELETE_ACCOUNT);
  },
};

export default userProfileService;
