/**
 * Reusable Button component
 * Variants: primary, secondary, outline, ghost, danger, verified
 * Sizes: sm, md, lg
 */
import { isValidElement } from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  isLoading = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  type = 'button',
  onClick,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 select-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98] shrink-0';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 h-8.5',
    md: 'text-sm px-4 py-2 gap-2 h-10',
    lg: 'text-base px-5 py-2.5 gap-2.5 h-11.5 sm:h-12',
  };

  const variantStyles = {
    primary:
      'bg-[#102C3A] text-white hover:bg-[#1D4355] focus:ring-[#102C3A]/30 shadow-xs border border-[#102C3A]',
    secondary:
      'bg-[#087F70] text-white hover:bg-[#066559] focus:ring-[#087F70]/30 shadow-xs border border-[#087F70]',
    outline:
      'bg-white text-[#182B36] border border-[#E2E8F0] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] focus:ring-[#087F70]/20 shadow-xs',
    ghost:
      'bg-transparent text-[#182B36] hover:bg-[#F1F5F8] focus:ring-[#102C3A]/10 border border-transparent',
    danger:
      'bg-[#DC4B4B] text-white hover:bg-[#C23C3C] focus:ring-[#DC4B4B]/30 shadow-xs border border-[#DC4B4B]',
    verified:
      'bg-[#16A36A] text-white hover:bg-[#128857] focus:ring-[#16A36A]/30 shadow-xs border border-[#16A36A]',
    warning:
      'bg-[#D99A28] text-white hover:bg-[#BD8521] focus:ring-[#D99A28]/30 shadow-xs border border-[#D99A28]',
    subtle:
      'bg-[#F1F5F8] text-[#102C3A] hover:bg-[#E2E8EC] border border-[#E2E8EC]',
    glass:
      'bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/30 focus:ring-white/20 shadow-xs backdrop-blur-xs',
    ghostDark:
      'bg-transparent text-white hover:bg-white/10 focus:ring-white/20 border border-transparent',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${
        variantStyles[variant] || variantStyles.primary
      } ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-0.5 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : LeftIcon ? (
        <span className="shrink-0">{isValidElement(LeftIcon) ? LeftIcon : <LeftIcon size={16} />}</span>
      ) : null}

      <span>{children}</span>

      {!isLoading && RightIcon ? (
        <span className="shrink-0">{isValidElement(RightIcon) ? RightIcon : <RightIcon size={16} />}</span>
      ) : null}
    </button>
  );
};

export default Button;
