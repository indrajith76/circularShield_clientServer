/**
 * CircularShield Analysis Page
 * Job Circular Analysis module — ready for backend AI model integration.
 *
 * Architecture:
 * - useAnalysis hook: state machine + validation + submission
 * - analysisService: HTTP client (multipart for files, JSON for text/url)
 * - analysisAdapter: request/response shape normalization
 * - UI components: input methods, file upload, text, url, processing, result, error
 *
 * Contains NO fraud detection, keyword matching, or risk scoring logic.
 * All determination is performed by the backend AI model.
 */

import { useCallback } from 'react';
import {
  useAnalysis,
} from '../hooks/useAnalysis';
import {
  INPUT_TYPES,
} from '../config/api.config';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import AnalysisInputMethods from '../components/analysis/AnalysisInputMethods';
import FileUpload from '../components/analysis/FileUpload';
import TextInput from '../components/analysis/TextInput';
import UrlInput from '../components/analysis/UrlInput';
import AnalysisProcessing from '../components/analysis/AnalysisProcessing';
import AnalysisResultDisplay from '../components/analysis/AnalysisResultDisplay';
import AnalysisError from '../components/analysis/AnalysisError';

export const Analysis = () => {
  const {
    state,
    inputType,
    file,
    text,
    url,
    result,
    error,
    isLoading,
    isCompleted,
    isFailed,
    canSubmit,
    fileMeta,
    fileError,
    textError,
    urlError,
    currentStep,
    setActiveInput,
    handleFileChange,
    handleRemoveFile,
    handleTextChange,
    handleUrlChange,
    clearText,
    clearUrl,
    submit,
    reset,
  } = useAnalysis();

  const handleSubmit = useCallback(() => {
    submit();
  }, [submit]);

  const handleCheckAnother = useCallback(() => {
    reset();
  }, [reset]);

  // Method-specific input rendering
  const renderMethodInput = () => {
    switch (inputType) {
      case INPUT_TYPES.PDF:
      case INPUT_TYPES.IMAGE:
        return (
          <FileUpload
            file={file}
            onFileChange={handleFileChange}
            onRemove={handleRemoveFile}
            error={fileError}
            accept=".pdf,image/png,image/jpeg,image/jpg"
          />
        );
      case INPUT_TYPES.TEXT:
        return (
          <TextInput
            value={text}
            onChange={handleTextChange}
            onClear={clearText}
            error={textError}
          />
        );
      case INPUT_TYPES.URL:
        return (
          <UrlInput
            value={url}
            onChange={handleUrlChange}
            onClear={clearUrl}
            error={urlError}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Analyze Job Circular' },
        ]}
        title="Analyze Job Circular"
        subtitle={
          "Upload a PDF or image, paste circular text, or enter a job portal URL. " +
          'Submissions are sent to the backend AI analysis service for evaluation.'
        }
        actions={
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<span className="text-xs">↺</span>}
            onClick={reset}
            disabled={isLoading}
            className="text-xs text-[#64748B]"
          >
            Reset
          </Button>
        }
      />

      {/* Error banner (shown when analysis failed) */}
      {isFailed && error && (
        <Card className="bg-[#FEF2F2] border border-[#FECACA] p-4">
          <AnalysisError
            error={error}
            onRetry={handleSubmit}
            onDismiss={() => {
              // clear error but keep state for retry
            }}
          />
        </Card>
      )}

      {/* 1. Input Method Selector */}
      <Card className="p-5">
        <div className="mb-5">
          <p className="text-xs text-[#64748B] font-medium mb-3">
            Choose how you want to submit the job circular
          </p>
          <AnalysisInputMethods
            activeMethod={inputType || null}
            onSelect={setActiveInput}
          />
        </div>

        {/* 2. Method-Specific Input */}
        {renderMethodInput()}

        {/* File metadata summary (when a file is selected) */}
        {fileMeta && (
          <div className="mt-4 p-3 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] text-xs">
            <p className="font-bold text-[#102C3A] mb-1">Selected File</p>
            <p className="text-[#64748B] truncate">{fileMeta.name}</p>
            <p className="text-[#64748B] text-[10px]">
              {fileMeta.sizeMB} MB • {fileMeta.type}
            </p>
          </div>
        )}
      </Card>

      {/* 3. Action Button */}
      <div className="pt-2">
        <Button
          variant="secondary"
          size="lg"
          disabled={!canSubmit || isLoading}
          onClick={handleSubmit}
          className={`w-full font-bold text-sm sm:text-base py-3.5 ${
            !canSubmit
              ? 'opacity-50 cursor-not-allowed'
              : 'cursor-pointer'
          }`}
        >
          {isLoading ? 'Submitting for Analysis...' : 'Submit for Analysis'}
        </Button>
        {!canSubmit && !isLoading && inputType && (
          <p className="text-[10px] text-[#94A3B8] mt-2 text-center">
            Please complete the required input above before submitting.
          </p>
        )}
      </div>

      {/* 4. Processing / Result Section */}
      {isLoading || isCompleted ? (
        <Card className="p-5">
          {isLoading ? (
            <AnalysisProcessing
              state={state}
              currentStep={currentStep}
            />
          ) : (
            <AnalysisResultDisplay
              result={result}
              onCheckAnother={handleCheckAnother}
              onViewFullReport={() => {
                // Navigate to full report page when route exists
              }}
            />
          )}
        </Card>
      ) : null}

      {/* 5. Error Section (standalone when not in loading/completed) */}
      {isFailed && error && !isLoading && !isCompleted && (
        <Card className="p-5 bg-[#FEF2F2] border border-[#FECACA]">
          <AnalysisError
            error={error}
            onRetry={handleSubmit}
            onDismiss={() => reset()}
          />
        </Card>
      )}
    </div>
  );
};

export default Analysis;
