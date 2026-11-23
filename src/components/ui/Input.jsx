import { useState, isValidElement } from 'react';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';

/**
 * Reusable Input component with label, error, success, helper, icons,
 * and built-in password visibility toggle
 */
export const Input = ({
  label,
  error,
  success,
  helperText,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  type = 'text',
  className = '',
  id,
  required = false,
  showPasswordToggle = false,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const isPasswordInput = type === 'password' || showPasswordToggle;
  const [showPassword, setShowPassword] = useState(false);

  const effectiveType = isPasswordInput ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs sm:text-sm font-medium text-[#182B36]"
        >
          {label} {required && <span className="text-[#DC4B4B]">*</span>}
        </label>
      )}

      <div className="relative rounded-xl shadow-2xs">
        {LeftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
            {isValidElement(LeftIcon) ? LeftIcon : <LeftIcon size={18} />}
          </div>
        )}

        <input
          id={inputId}
          type={effectiveType}
          required={required}
          className={`w-full bg-white text-[#182B36] placeholder-[#94A3B8] text-sm rounded-xl border transition-colors duration-150 py-2.5 outline-none ${
            LeftIcon ? 'pl-10' : 'pl-3.5'
          } ${
            isPasswordInput || RightIcon ? 'pr-11' : 'pr-3.5'
          } ${
            error
              ? 'border-[#DC4B4B] focus:border-[#DC4B4B] focus:ring-2 focus:ring-[#DC4B4B]/20'
              : success
              ? 'border-[#16A36A] focus:border-[#16A36A] focus:ring-2 focus:ring-[#16A36A]/20'
              : 'border-[#CBD5E1] hover:border-[#94A3B8] focus:border-[#087F70] focus:ring-2 focus:ring-[#087F70]/20'
          } ${className}`}
          {...props}
        />

        {/* Right slot: either password toggle or custom RightIcon */}
        {isPasswordInput ? (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#64748B] hover:text-[#182B36] cursor-pointer"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        ) : RightIcon ? (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-[#64748B]">
            {isValidElement(RightIcon) ? RightIcon : <RightIcon size={18} />}
          </div>
        ) : null}
      </div>

      {error ? (
        <p className="text-xs text-[#DC4B4B] flex items-center gap-1 font-medium mt-1">
          {error}
        </p>
      ) : success ? (
        <p className="text-xs text-[#16A36A] flex items-center gap-1 font-medium mt-1">
          <CheckCircle2 size={13} />
          {success}
        </p>
      ) : helperText ? (
        <p className="text-xs text-[#64748B] mt-1">{helperText}</p>
      ) : null}
    </div>
  );
};

export const Textarea = ({
  label,
  error,
  helperText,
  className = '',
  rows = 4,
  id,
  required = false,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs sm:text-sm font-medium text-[#182B36]"
        >
          {label} {required && <span className="text-[#DC4B4B]">*</span>}
        </label>
      )}

      <textarea
        id={inputId}
        rows={rows}
        required={required}
        className={`w-full bg-white text-[#182B36] placeholder-[#94A3B8] text-sm rounded-xl border transition-colors duration-150 p-3.5 outline-none resize-y ${
          error
            ? 'border-[#DC4B4B] focus:border-[#DC4B4B] focus:ring-2 focus:ring-[#DC4B4B]/20'
            : 'border-[#CBD5E1] hover:border-[#94A3B8] focus:border-[#087F70] focus:ring-2 focus:ring-[#087F70]/20'
        } ${className}`}
        {...props}
      />

      {error ? (
        <p className="text-xs text-[#DC4B4B] flex items-center gap-1 font-medium mt-1">
          {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-[#64748B] mt-1">{helperText}</p>
      ) : null}
    </div>
  );
};

export const Select = ({
  label,
  error,
  helperText,
  options = [],
  className = '',
  id,
  required = false,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs sm:text-sm font-medium text-[#182B36]"
        >
          {label} {required && <span className="text-[#DC4B4B]">*</span>}
        </label>
      )}

      <select
        id={inputId}
        required={required}
        className={`w-full bg-white text-[#182B36] text-sm rounded-xl border transition-colors duration-150 py-2.5 px-3.5 outline-none cursor-pointer ${
          error
            ? 'border-[#DC4B4B] focus:border-[#DC4B4B] focus:ring-2 focus:ring-[#DC4B4B]/20'
            : 'border-[#CBD5E1] hover:border-[#94A3B8] focus:border-[#087F70] focus:ring-2 focus:ring-[#087F70]/20'
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error ? (
        <p className="text-xs text-[#DC4B4B] flex items-center gap-1 font-medium mt-1">
          {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-[#64748B] mt-1">{helperText}</p>
      ) : null}
    </div>
  );
};

export default Input;
