/**
 * Reusable Badge component for verification and risk states
 * Variants: verified, suspicious, unverified, neutral, info, primary
 */
import { isValidElement } from 'react';

export const Badge = ({
  children,
  variant = 'neutral',
  size = 'md',
  showDot = false,
  className = '',
  icon: Icon,
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  };

  const variantStyles = {
    verified: 'bg-[#ECFDF5] text-[#15803D] border border-[#A7F3D0]',
    suspicious: 'bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA]',
    unverified: 'bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]',
    neutral: 'bg-[#F1F5F9] text-[#334155] border border-[#CBD5E1]',
    info: 'bg-[#F0FDF9] text-[#065F46] border border-[#99F6E4]',
    primary: 'bg-[#102C3A]/10 text-[#102C3A] border border-[#102C3A]/20',
    dark: 'bg-[#102C3A] text-white border border-[#102C3A]',
  };

  const dotColors = {
    verified: 'bg-[#16A36A]',
    suspicious: 'bg-[#DC4B4B]',
    unverified: 'bg-[#D99A28]',
    neutral: 'bg-[#64748B]',
    info: 'bg-[#087F70]',
    primary: 'bg-[#102C3A]',
    dark: 'bg-emerald-400',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full shrink-0 select-none ${
        sizeStyles[size] || sizeStyles.md
      } ${variantStyles[variant] || variantStyles.neutral} ${className}`}
    >
      {showDot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
            dotColors[variant] || 'bg-current'
          }`}
        />
      )}
      {Icon && (
        <span className="shrink-0">
          {isValidElement(Icon) ? Icon : <Icon size={size === 'sm' ? 12 : 14} />}
        </span>
      )}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
