/**
 * CircularShield useSubmitLock Hook
 * Form submission guard that eliminates accidental duplicate submissions
 * caused by rapid button double-clicks or key repeats.
 */

import { useState, useCallback, useRef, useEffect } from 'react';

export const useSubmitLock = (options = {}) => {
  const { cooldownMs = 300 } = options;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const lockRef = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  /**
   * Wraps an async form submission in a lock
   * @param {Function} asyncFn - Async function returning a promise
   * @returns {Promise} - Resolves with result, or rejects if duplicate/error
   */
  const submitWithLock = useCallback(
    async (asyncFn) => {
      // If already submitting, ignore the duplicate event
      if (lockRef.current) {
        return null;
      }

      lockRef.current = true;
      if (isMountedRef.current) {
        setIsSubmitting(true);
      }

      try {
        const result = await asyncFn();
        return result;
      } finally {
        // Optional debounce cooldown before allowing next submission
        if (cooldownMs > 0) {
          setTimeout(() => {
            lockRef.current = false;
            if (isMountedRef.current) {
              setIsSubmitting(false);
            }
          }, cooldownMs);
        } else {
          lockRef.current = false;
          if (isMountedRef.current) {
            setIsSubmitting(false);
          }
        }
      }
    },
    [cooldownMs]
  );

  return {
    isSubmitting,
    submitWithLock,
  };
};

export default useSubmitLock;
