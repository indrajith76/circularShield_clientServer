/**
 * CircularShield Centralized API Client
 * Enterprise Fetch-based HTTP client with:
 * - Dynamic environment base URL resolution
 * - Automatic Authorization header injection
 * - In-flight duplicate mutation prevention
 * - AbortController timeout & cancellation support
 * - Centralized 401 Unauthorized handling & dispatching
 * - Normalized ApiError hierarchy
 */

import { API_CONFIG } from './config';
import { tokenStorage } from './tokenStorage';
import { ApiError, ERROR_CODES, mapStatusToErrorCode, normalizeError } from './errors';

class ApiClient {
  constructor(config = {}) {
    this.baseURL = config.baseURL || API_CONFIG.baseURL;
    this.timeoutMs = config.timeoutMs || API_CONFIG.timeoutMs;
    this.defaultHeaders = {
      Accept: 'application/json',
      ...API_CONFIG.clientHeaders,
      ...config.headers,
    };

    // Active in-flight requests map to prevent duplicate mutations: Map<hash, Promise>
    this.inFlightMutations = new Map();

    // Active abort controllers for bulk cancellation support
    this.activeControllers = new Set();
  }

  /**
   * Generates a unique fingerprint for a mutating request
   */
  getRequestHash(method, url, data) {
    let serializedData = '';
    if (data) {
      if (typeof FormData !== 'undefined' && data instanceof FormData) {
        serializedData = 'FormData';
      } else {
        try {
          serializedData = JSON.stringify(data);
        } catch {
          serializedData = String(data);
        }
      }
    }
    return `${method.toUpperCase()}:${url}:${serializedData}`;
  }

  /**
   * Builds an absolute URL from an endpoint path, merging query parameters if provided
   */
  buildUrl(endpoint, params = null) {
    let fullUrl = endpoint.startsWith('http://') || endpoint.startsWith('https://')
      ? endpoint
      : `${this.baseURL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

    if (params && typeof params === 'object') {
      const urlObj = new URL(fullUrl);
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          urlObj.searchParams.append(key, String(val));
        }
      });
      fullUrl = urlObj.toString();
    }

    return fullUrl;
  }

  /**
   * Core request dispatcher with interceptors, timeouts, and duplicate protection
   */
  async request(endpoint, options = {}) {
    const {
      method = 'GET',
      data = null,
      params = null,
      headers = {},
      timeout = this.timeoutMs,
      signal: externalSignal = null,
      preventDuplicate = true,
      skipAuth = false,
      responseType = 'json',
    } = options;

    const normalizedMethod = method.toUpperCase();
    const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(normalizedMethod);
    const targetUrl = this.buildUrl(endpoint, params);

    // Prevent duplicate in-flight mutations
    let requestHash = null;
    if (isMutation && preventDuplicate) {
      requestHash = this.getRequestHash(normalizedMethod, targetUrl, data);
      if (this.inFlightMutations.has(requestHash)) {
        throw new ApiError(
          'A submission is already in progress. Please wait a moment.',
          ERROR_CODES.DUPLICATE_SUBMISSION,
          409,
          { url: targetUrl, method: normalizedMethod }
        );
      }
    }

    // Set up AbortController for timeout and cancellation
    const controller = new AbortController();
    this.activeControllers.add(controller);

    // If external signal fires, forward abort
    if (externalSignal) {
      if (externalSignal.aborted) {
        controller.abort();
      } else {
        externalSignal.addEventListener('abort', () => controller.abort(), { once: true });
      }
    }

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);

    // Build headers
    const requestHeaders = new Headers();
    Object.entries(this.defaultHeaders).forEach(([k, v]) => requestHeaders.set(k, v));
    Object.entries(headers).forEach(([k, v]) => requestHeaders.set(k, v));

    // Token injection
    if (!skipAuth) {
      const token = tokenStorage.getAccessToken();
      if (token) {
        requestHeaders.set('Authorization', `Bearer ${token}`);
      }
    }

    // Determine payload body and Content-Type
    let body = undefined;
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;

    if (data !== null && data !== undefined) {
      if (isFormData) {
        // Native fetch will automatically set multipart/form-data with the correct boundary
        requestHeaders.delete('Content-Type');
        body = data;
      } else if (typeof data === 'object') {
        requestHeaders.set('Content-Type', 'application/json');
        body = JSON.stringify(data);
      } else {
        body = String(data);
      }
    }

    const fetchPromise = (async () => {
      try {
        const response = await fetch(targetUrl, {
          method: normalizedMethod,
          headers: requestHeaders,
          body,
          signal: controller.signal,
        });

        // 401 Unauthorized handling
        if (response.status === 401) {
          tokenStorage.triggerUnauthorized({
            url: targetUrl,
            status: 401,
            message: 'Session has expired or is invalid.',
          });
          throw new ApiError(
            'Your session has expired. Please sign in again.',
            ERROR_CODES.UNAUTHORIZED,
            401
          );
        }

        // Parse response content
        let parsedData = null;
        if (responseType === 'blob') {
          parsedData = await response.blob();
        } else if (responseType === 'text') {
          parsedData = await response.text();
        } else {
          const contentType = response.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            try {
              parsedData = await response.json();
            } catch {
              parsedData = null;
            }
          } else {
            parsedData = await response.text();
          }
        }

        // Handle non-2xx responses
        if (!response.ok) {
          const status = response.status;
          const errorCode = mapStatusToErrorCode(status);

          let errorMessage = `Request failed with status ${status}`;
          let errorDetails = null;

          if (parsedData && typeof parsedData === 'object') {
            if (parsedData.error) {
              errorMessage = parsedData.error.message || errorMessage;
              errorDetails = parsedData.error.details || parsedData.error;
            } else if (parsedData.message) {
              errorMessage = parsedData.message;
              errorDetails = parsedData.details || null;
            }
          }

          throw new ApiError(errorMessage, errorCode, status, errorDetails);
        }

        return parsedData;
      } catch (err) {
        if (err.name === 'AbortError') {
          throw new ApiError(
            'The request timed out or was cancelled.',
            ERROR_CODES.TIMEOUT,
            504,
            err
          );
        }
        throw normalizeError(err);
      } finally {
        clearTimeout(timeoutId);
        this.activeControllers.delete(controller);
        if (requestHash) {
          this.inFlightMutations.delete(requestHash);
        }
      }
    })();

    if (requestHash) {
      this.inFlightMutations.set(requestHash, fetchPromise);
    }

    return fetchPromise;
  }

  // Convenience methods
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, data = null, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', data });
  }

  put(endpoint, data = null, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', data });
  }

  patch(endpoint, data = null, options = {}) {
    return this.request(endpoint, { ...options, method: 'PATCH', data });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  upload(endpoint, formData, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      data: formData,
    });
  }

  /**
   * Abort all active in-flight requests created by this client
   */
  cancelAllRequests() {
    this.activeControllers.forEach((controller) => {
      try {
        controller.abort();
      } catch {
        // ignore
      }
    });
    this.activeControllers.clear();
    this.inFlightMutations.clear();
  }
}

// Export singleton default instance and class for custom instances
export const apiClient = new ApiClient();
export default apiClient;
