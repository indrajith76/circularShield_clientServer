/**
 * CircularShield useAnalysis Hook
 * Manages the analysis state machine and input validation for the Job Circular
 * Analysis module. Delegates HTTP calls to analysisService.
 *
 * State machine: idle -> validating -> uploading/processing -> completed | failed
 *
 * Contains NO fraud detection, keyword matching, or risk scoring logic.
 * All determination is performed by the backend AI model.
 */

import { useState, useCallback, useRef } from 'react';
import {
  submitAnalysis,
  AnalysisError,
} from '../services/analysis/analysisService';
import {
  buildFileRequest,
  buildTextRequest,
  buildUrlRequest,
  adaptAnalysisResponse,
  adaptAnalysisError,
  UI_PROCESSING_STEPS,
} from '../services/analysis/analysisAdapter';
import {
  ANALYSIS_STATES,
  INPUT_TYPES,
  ANALYSIS_CONFIG,
} from '../config/api.config';

const { maxFileSizeBytes, allowedExtensions, allowedMimeTypes } =
  ANALYSIS_CONFIG;

/**
 * Extract file extension from filename (lowercase, without dot).
 */
const getFileExtension = (filename) => {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : '';
};

/**
 * Validate a file against extension, MIME type, and size constraints.
 * Returns { valid, error }.
 */
export const validateFile = (file) => {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  const extension = getFileExtension(file.name);
  if (!allowedExtensions.includes(extension)) {
    return {
      valid: false,
      error: `Unsupported file type (.${extension}). Allowed: ${allowedExtensions.join(', ').toUpperCase()}.`,
    };
  }

  if (!allowedMimeTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file format: ${file.type || 'unknown'}. Please upload a PDF or image (JPG, PNG).`,
    };
  }

  if (file.size > maxFileSizeBytes) {
    const maxMB = (maxFileSizeBytes / 1048576).toFixed(0);
    return {
      valid: false,
      error: `File too large (${(file.size / 1048576).toFixed(1)} MB). Maximum allowed size is ${maxMB} MB.`,
    };
  }

  return { valid: true, error: null };
};

/**
 * Validate a URL string.
 * Returns { valid, error }.
 */
export const validateUrl = (url) => {
  if (!url || !url.trim()) {
    return { valid: false, error: 'Please enter a website address.' };
  }

  try {
    const parsed = new URL(url.trim());
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { valid: false, error: 'URL must begin with http:// or https://' };
    }
    if (!parsed.hostname || parsed.hostname.length < 3) {
      return { valid: false, error: 'Please enter a valid domain (e.g. https://company.com/career).' };
    }
    return { valid: true, error: null };
  } catch {
    return { valid: false, error: 'Please enter a valid website address.' };
  }
};

/**
 * Validate text input.
 * Returns { valid, error }.
 */
export const validateText = (text) => {
  if (!text || !text.trim()) {
    return { valid: false, error: 'Please paste the circular text before submitting.' };
  }
  if (text.trim().length < 10) {
    return { valid: false, error: 'Please enter at least 10 characters of circular information.' };
  }
  return { valid: true, error: null };
};

export const useAnalysis = () => {
  // -------------------------------------------------------------------------
  // State
  // -------------------------------------------------------------------------
  const [state, setState] = useState(ANALYSIS_STATES.IDLE);
  const [inputType, setInputType] = useState(null); // 'pdf' | 'image' | 'text' | 'url'
  const [file, setFile] = useState(null); // File object
  const [text, setText] = useState(''); // pasted circular text
  const [url, setUrl] = useState(''); // website URL
  const [result, setResult] = useState(null); // adapted analysis result
  const [error, setError] = useState(null); // { code, message, retryable }
  const [currentStepIndex, setCurrentStepIndex] = useState(0); // UI step index
  const [fileError, setFileError] = useState(null);
  const [textError, setTextError] = useState(null);
  const [urlError, setUrlError] = useState(null);

  const abortControllerRef = useRef(null);
  const startTimeRef = useRef(null);

  // -------------------------------------------------------------------------
  // Input setters with validation
  // -------------------------------------------------------------------------

  const setActiveInput = useCallback((type) => {
    setInputType(type);
    setError(null);
    setResult(null);
    setFileError(null);
    setTextError(null);
    setUrlError(null);
    setCurrentStepIndex(0);
  }, []);

  const handleFileChange = useCallback((selectedFile) => {
    setFile(selectedFile);
    setFileError(null);
    setError(null);
    setResult(null);
    if (!selectedFile) return;
    const { valid, error } = validateFile(selectedFile);
    if (!valid) {
      setFileError(error);
    }
  }, []);

  const handleRemoveFile = useCallback(() => {
    setFile(null);
    setFileError(null);
    setResult(null);
    setError(null);
  }, []);

  const handleTextChange = useCallback((value) => {
    setText(value);
    setTextError(null);
    setError(null);
    setResult(null);
  }, []);

  const handleUrlChange = useCallback((value) => {
    setUrl(value);
    setUrlError(null);
    setError(null);
    setResult(null);
    if (!value.trim()) return;
    const { valid, error } = validateUrl(value);
    if (!valid) {
      setUrlError(error);
    }
  }, []);

  const clearText = useCallback(() => {
    setText('');
    setTextError(null);
    setError(null);
    setResult(null);
  }, []);

  const clearUrl = useCallback(() => {
    setUrl('');
    setUrlError(null);
    setError(null);
    setResult(null);
  }, []);

  // -------------------------------------------------------------------------
  // Reset
  // -------------------------------------------------------------------------
  const reset = useCallback(() => {
    setState(ANALYSIS_STATES.IDLE);
    setInputType(null);
    setFile(null);
    setText('');
    setUrl('');
    setResult(null);
    setError(null);
    setCurrentStepIndex(0);
    setFileError(null);
    setTextError(null);
    setUrlError(null);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    startTimeRef.current = null;
  }, []);

  // -------------------------------------------------------------------------
  // Submit analysis
  // -------------------------------------------------------------------------
  const submit = useCallback(async () => {
    // Clear previous results/errors
    setError(null);
    setResult(null);

    // Determine which input to validate based on selected type
    if (inputType === INPUT_TYPES.PDF || inputType === INPUT_TYPES.IMAGE) {
      if (!file) {
        setError(adaptAnalysisError(new AnalysisError('Please select a file to analyze.', 'VALIDATION_ERROR', 400)));
        setState(ANALYSIS_STATES.FAILED);
        return;
      }
      const { valid, error: fileErr } = validateFile(file);
      if (!valid) {
        setFileError(fileErr);
        setError(adaptAnalysisError(new AnalysisError(fileErr, 'VALIDATION_ERROR', 400)));
        setState(ANALYSIS_STATES.FAILED);
        return;
      }
    } else if (inputType === INPUT_TYPES.TEXT) {
      const { valid, error: textErr } = validateText(text);
      if (!valid) {
        setTextError(textErr);
        setError(adaptAnalysisError(new AnalysisError(textErr, 'VALIDATION_ERROR', 400)));
        setState(ANALYSIS_STATES.FAILED);
        return;
      }
    } else if (inputType === INPUT_TYPES.URL) {
      const { valid, error: urlErr } = validateUrl(url);
      if (!valid) {
        setUrlError(urlErr);
        setError(adaptAnalysisError(new AnalysisError(urlErr, 'VALIDATION_ERROR', 400)));
        setState(ANALYSIS_STATES.FAILED);
        return;
      }
    } else {
      setError(adaptAnalysisError(new AnalysisError('Please select an input method.', 'VALIDATION_ERROR', 400)));
      setState(ANALYSIS_STATES.FAILED);
      return;
    }

    // Begin state machine: validating -> uploading/processing
    setState(ANALYSIS_STATES.VALIDATING);
    setCurrentStepIndex(0);
    startTimeRef.current = Date.now();
    abortControllerRef.current = new AbortController();

    try {
      // Build request payload via adapters
      let request;
      if (inputType === INPUT_TYPES.PDF || inputType === INPUT_TYPES.IMAGE) {
        request = buildFileRequest(file, inputType);
      } else if (inputType === INPUT_TYPES.TEXT) {
        request = buildTextRequest(text);
      } else {
        request = buildUrlRequest(url);
      }

      // File-based inputs go through uploading state; text/url go straight to processing
      if (inputType === INPUT_TYPES.PDF || inputType === INPUT_TYPES.IMAGE) {
        setState(ANALYSIS_STATES.UPLOADING);
        setCurrentStepIndex(1);
      } else {
        setState(ANALYSIS_STATES.PROCESSING);
        setCurrentStepIndex(2);
      }

      // Dispatch to backend
      const rawResponse = await submitAnalysis(request);

      setState(ANALYSIS_STATES.PROCESSING);
      setCurrentStepIndex(3);

      // Adapt response (no detection logic here — only shape normalization)
      const adapted = adaptAnalysisResponse(rawResponse);
      setResult(adapted);
      setState(ANALYSIS_STATES.COMPLETED);
      setCurrentStepIndex(UI_PROCESSING_STEPS.length - 1);
    } catch (err) {
      const adaptedError = adaptAnalysisError(err);
      setError(adaptedError);
      setState(ANALYSIS_STATES.FAILED);
      setCurrentStepIndex(0);
    } finally {
      abortControllerRef.current = null;
      startTimeRef.current = null;
    }
  }, [inputType, file, text, url]);

  // -------------------------------------------------------------------------
  // Derived values
  // -------------------------------------------------------------------------
  const isIdle = state === ANALYSIS_STATES.IDLE;
  const isValidating = state === ANALYSIS_STATES.VALIDATING;
  const isUploading = state === ANALYSIS_STATES.UPLOADING;
  const isProcessing = state === ANALYSIS_STATES.PROCESSING;
  const isCompleted = state === ANALYSIS_STATES.COMPLETED;
  const isFailed = state === ANALYSIS_STATES.FAILED;
  const isLoading = isValidating || isUploading || isProcessing;

  const currentStep = UI_PROCESSING_STEPS[currentStepIndex] || UI_PROCESSING_STEPS[0];

  const canSubmit = Boolean(inputType) && !isLoading;

  // Validation pre-checks (for UI to show inline errors before submit)
  const hasFileError = Boolean(fileError);
  const hasTextError = Boolean(textError);
  const hasUrlError = Boolean(urlError);

  // File metadata for display
  const fileMeta = file
    ? {
        name: file.name,
        size: file.size,
        sizeMB: (file.size / 1048576).toFixed(2),
        type: file.type || 'unknown',
        extension: getFileExtension(file.name),
        isImage: file.type.startsWith('image/'),
      }
    : null;

  return {
    // State
    state,
    inputType,
    file,
    text,
    url,
    result,
    error,
    currentStep,
    currentStepIndex,
    fileMeta,
    fileError,
    textError,
    urlError,
    hasFileError,
    hasTextError,
    hasUrlError,

    // Booleans
    isIdle,
    isValidating,
    isUploading,
    isProcessing,
    isCompleted,
    isFailed,
    isLoading,
    canSubmit,

    // Actions
    setActiveInput,
    handleFileChange,
    handleRemoveFile,
    handleTextChange,
    handleUrlChange,
    clearText,
    clearUrl,
    submit,
    reset,
    validateFile,
    validateText,
    validateUrl,
  };
};

export default useAnalysis;
export { ANALYSIS_STATES, INPUT_TYPES };
