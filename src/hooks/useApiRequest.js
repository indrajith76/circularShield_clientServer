/**
 * CircularShield useApiRequest Hook
 * Manages loading states, response data, errors, and automatic/manual request cancellation.
 * Automatically aborts in-flight requests when the component unmounts.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { ApiError, normalizeError } from '../api/errors';

export const useApiRequest = (apiFn, options = {}) => {
  const {
    initialData = null,
    onSuccess = null,
    onError = null,
  } = options;

  const [data, setData] = useState(initialData);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Store active AbortController to support cancellation
  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      // Abort any active request on unmount
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  /**
   * Cancel currently active in-flight request
   */
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  /**
   * Execute API call
   */
  const execute = useCallback(
    async (...args) => {
      // Abort any prior in-flight invocation
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsLoading(true);
      setError(null);
      setIsSuccess(false);

      try {
        // Pass signal as part of options if accepted
        const result = await apiFn(...args, { signal: controller.signal });

        if (isMountedRef.current) {
          setData(result);
          setIsSuccess(true);
          setIsLoading(false);
          if (onSuccess) onSuccess(result);
        }
        return result;
      } catch (err) {
        // If aborted, do not flag as error state
        if (err instanceof ApiError && err.isCancelled) {
          return null;
        }

        const normalized = normalizeError(err);
        if (isMountedRef.current) {
          setError(normalized);
          setIsLoading(false);
          setIsSuccess(false);
          if (onError) onError(normalized);
        }
        throw normalized;
      } finally {
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
      }
    },
    [apiFn, onSuccess, onError]
  );

  return {
    data,
    error,
    isLoading,
    isSuccess,
    isError: Boolean(error),
    execute,
    cancel,
    setData,
    setError,
  };
};

export default useApiRequest;
