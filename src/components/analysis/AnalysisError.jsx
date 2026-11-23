/**
 * CircularShield Analysis Error Component
 * Displays user-friendly error messages for analysis failures.
 * Covers validation errors, file errors, network errors, timeouts,
 * and backend processing failures.
 */
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from '../ui/Button';

export const AnalysisError = ({
  error,
  onRetry,
  onDismiss,
  className = '',
}) => {
  if (!error) return null;

  const { code, message, retryable } = error;

  const codeLabels = {
    VALIDATION_ERROR: 'Invalid Input',
    FILE_TOO_LARGE: 'File Too Large',
    INVALID_FILE_TYPE: 'Unsupported File Type',
    NETWORK_ERROR: 'Network Error',
    TIMEOUT: 'Request Timed Out',
    PROCESSING_FAILED: 'Analysis Failed',
    UNSUPPORTED_FORMAT: 'Unsupported Format',
    UNKNOWN_ERROR: 'Unexpected Error',
  };

  return (
    <div className={`rounded-xl border p-4 space-y-3 animate-in fade-in ${className}`}>
      <div className="flex items-start gap-3">
        <div className="shrink-0 p-2 rounded-lg bg-[#FEF2F2] text-[#DC4B4B]">
          <AlertTriangle size={20} />
        </div>
        <div className="flex-1">
          <p className="font-bold text-sm text-[#102C3A]">
            {codeLabels[code] || 'Error'}
          </p>
          <p className="text-xs text-[#64748B] leading-relaxed">
            {message}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        {onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="text-xs text-[#64748B]"
          >
            Dismiss
          </Button>
        )}
        {retryable && onRetry && (
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<RefreshCw size={16} />}
            onClick={onRetry}
          >
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default AnalysisError;
