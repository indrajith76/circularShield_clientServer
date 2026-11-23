import { isValidElement } from 'react';
import Card, { CardContent } from './Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * MetricCard for dashboard metrics with icon, value, delta, and subtitle
 */
export const MetricCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendDirection = 'neutral', // 'up' | 'down' | 'neutral'
  variant = 'default', // 'default' | 'verified' | 'suspicious' | 'secondary'
  className = '',
}) => {
  const iconVariantStyles = {
    default: 'bg-[#102C3A]/10 text-[#102C3A]',
    secondary: 'bg-[#087F70]/10 text-[#087F70]',
    verified: 'bg-[#ECFDF5] text-[#16A36A]',
    suspicious: 'bg-[#FEF2F2] text-[#DC4B4B]',
    unverified: 'bg-[#FFFBEB] text-[#D99A28]',
  };

  return (
    <Card className={`transition-all ${className}`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              {title}
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#102C3A] tracking-tight">
                {value}
              </h3>
            </div>
          </div>
          {Icon && (
            <div
              className={`p-3 rounded-xl shrink-0 ${
                iconVariantStyles[variant] || iconVariantStyles.default
              }`}
            >
              {isValidElement(Icon) ? Icon : <Icon size={22} />}
            </div>
          )}
        </div>

        {(trend || subtitle) && (
          <div className="mt-3.5 pt-3 border-t border-[#F1F5F8] flex items-center justify-between text-xs">
            {trend && (
              <span
                className={`inline-flex items-center gap-1 font-medium ${
                  trendDirection === 'up'
                    ? 'text-[#16A36A]'
                    : trendDirection === 'down'
                    ? 'text-[#DC4B4B]'
                    : 'text-[#64748B]'
                }`}
              >
                {trendDirection === 'up' && <TrendingUp size={14} />}
                {trendDirection === 'down' && <TrendingDown size={14} />}
                {trend}
              </span>
            )}
            {subtitle && <span className="text-[#94A3B8]">{subtitle}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
