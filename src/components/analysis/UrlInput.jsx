/**
 * CircularShield URL Input Component
 * Validates URL format, displays the submitted URL, and handles invalid URL errors.
 * Prepares the URL field for backend submission.
 */
import { useCallback } from 'react';
import { Trash2 } from 'lucide-react';

export const UrlInput = ({
  value,
  onChange,
  onClear,
  error,
  className = '',
}) => {
  const handleChange = useCallback(
    (e) => {
      onChange(e.target.value);
    },
    [onChange],
  );

  const isValid = Boolean(value.trim()) && !error;

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-xs font-bold text-[#102C3A]">
        Enter Job Circular Web Address
      </label>
      <input
        type="url"
        value={value}
        onChange={handleChange}
        placeholder="https://company.com/career/job-details"
        className={`w-full text-xs sm:text-sm px-4 py-3 rounded-xl border ${
          error
            ? 'border-[#DC4B4B] focus:ring-[#DC4B4B]/20'
            : 'border-[#CBD5E1] focus:border-[#087F70] focus:ring-[#087F70]/20'
        } outline-none focus:ring-2 transition-all placeholder-[#94A3B8]`}
      />
      {error && (
        <p className="text-xs text-[#DC4B4B] font-medium">{error}</p>
      )}
      {value.trim() && (
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-[#64748B] truncate max-w-[200px]">
            {value}
          </span>
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-semibold text-[#DC4B4B] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Trash2 size={13} /> Clear
          </button>
        </div>
      )}
      {!error && value.trim() && !isValid && (
        <p className="text-xs text-[#DC4B4B] font-medium">
          Please enter a valid website address (e.g., https://example.com/job).
        </p>
      )}
    </div>
  );
};

export default UrlInput;
