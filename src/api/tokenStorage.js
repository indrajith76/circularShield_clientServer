/**
 * CircularShield Token Storage Manager
 * Handles access and refresh tokens safely with fallback, expiration decoding,
 * and unauthorized session event broadcasting.
 */

const ACCESS_TOKEN_KEY = 'cs_auth_token';
const REFRESH_TOKEN_KEY = 'cs_refresh_token';
const USER_KEY = 'cs_auth_user';

// In-memory token storage fallback if localStorage is unavailable
const memoryStorage = new Map();

// Registered unauthorized handlers
const unauthorizedListeners = new Set();

/**
 * Check if localStorage is usable
 */
const isLocalStorageAvailable = () => {
  try {
    const testKey = '__cs_storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

const hasLocalStorage = typeof window !== 'undefined' && isLocalStorageAvailable();

/**
 * Safe local storage reader
 */
const getItem = (key) => {
  if (hasLocalStorage) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return memoryStorage.get(key) || null;
    }
  }
  return memoryStorage.get(key) || null;
};

/**
 * Safe local storage writer
 */
const setItem = (key, value) => {
  if (hasLocalStorage) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      memoryStorage.set(key, value);
    }
  } else {
    memoryStorage.set(key, value);
  }
};

/**
 * Safe local storage remover
 */
const removeItem = (key) => {
  if (hasLocalStorage) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      memoryStorage.delete(key);
    }
  } else {
    memoryStorage.delete(key);
  }
};

/**
 * Safely parse a JWT payload without external libraries
 */
export const parseJwtPayload = (token) => {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

/**
 * Check if a JWT token has expired
 * Adds a 15-second buffer to handle clock skew
 */
export const isTokenExpired = (token) => {
  const payload = parseJwtPayload(token);
  if (!payload || !payload.exp) {
    // If not a standard expiring JWT, treat as valid if present
    return false;
  }
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp <= currentTime + 15;
};

export const tokenStorage = {
  /**
   * Retrieve current access token
   */
  getAccessToken: () => getItem(ACCESS_TOKEN_KEY),

  /**
   * Retrieve current refresh token
   */
  getRefreshToken: () => getItem(REFRESH_TOKEN_KEY),

  /**
   * Set both access and optional refresh tokens
   */
  setTokens: ({ accessToken, refreshToken }) => {
    if (accessToken) {
      setItem(ACCESS_TOKEN_KEY, accessToken);
    }
    if (refreshToken) {
      setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  },

  /**
   * Clear all stored credentials and user session
   */
  clearTokens: () => {
    removeItem(ACCESS_TOKEN_KEY);
    removeItem(REFRESH_TOKEN_KEY);
    removeItem(USER_KEY);
  },

  /**
   * Check if an access token exists and is non-expired
   */
  hasValidToken: () => {
    const token = getItem(ACCESS_TOKEN_KEY);
    if (!token) return false;
    return !isTokenExpired(token);
  },

  /**
   * Subscribe to unauthorized / session expired events
   * @param {Function} callback (eventDetails) => void
   * @returns {Function} unsubscribe function
   */
  onUnauthorized: (callback) => {
    unauthorizedListeners.add(callback);
    return () => unauthorizedListeners.delete(callback);
  },

  /**
   * Trigger unauthorized session event across all listeners
   */
  triggerUnauthorized: (details = {}) => {
    tokenStorage.clearTokens();

    unauthorizedListeners.forEach((callback) => {
      try {
        callback(details);
      } catch (err) {
        console.error('[CircularShield Auth] Listener error:', err);
      }
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('circularshield:unauthorized', { detail: details })
      );
    }
  },
};

export default tokenStorage;
