/**
 * CircularShield Text Input Component
 * Large text editor for pasting job circular text.
 * Shows character count, supports editing/clearing, validates empty input,
 * preserves Bangla and English Unicode text.
 */
import { useState, useCallback } from 'react';
import { Edit2, Check, Trash2 } from 'lucide-react';
import { Textarea } from '../ui/Input';

export const TextInput = ({
  value,
  onChange,
  onClear,
  error,
  minLength = 10,
  className = '',
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const charCount = value ? value.length : 0;
  const meetsMin = charCount >= minLength;

  const handleChange = useCallback(
    (e) => {
      onChange(e.target.value);
    },
    [onChange],
  );

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-[#102C3A]">
          Paste Circular Text
        </label>
        <span
          className={`text-[11px] font-medium ${
            meetsMin ? 'text-[#16A36A]' : 'text-[#94A3B8]'
          }`}
        >
          {charCount} characters (min {minLength} required)
        </span>
      </div>

      <Textarea
        label=""
        rows={7}
        value={value}
        onChange={handleChange}
        error={error || (!value.trim() && 'Please paste the circular text before submitting.')}
        placeholder="Paste the full job circular text, SMS message, or recruitment notice here... (Bangla and English supported)"
        className="w-full text-xs sm:text-sm p-4 rounded-xl border border-[#CBD5E1] focus:border-[#087F70] focus:ring-2 focus:ring-[#087F70]/20 outline-none transition-all placeholder-[#94A3B8] whitespace-pre-line"
      />

      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="text-xs font-semibold text-[#087F70] hover:underline flex items-center gap-1 cursor-pointer"
        >
          {isEditing ? <Check size={14} /> : <Edit2 size={13} />}
          <span>{isEditing ? 'Done Editing' : 'Edit Text'}</span>
        </button>
        {value.trim() && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-semibold text-[#DC4B4B] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Trash2 size={13} /> Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default TextInput;
