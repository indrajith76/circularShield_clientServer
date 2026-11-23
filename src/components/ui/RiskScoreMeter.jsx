import Badge from './Badge';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

/**
 * RiskScoreMeter displays a 0-100 score indicator with color coding
 * 0-25: Low Risk (Verified / Safe)
 * 26-60: Medium Risk (Unverified / Review Needed)
 * 61-100: High Risk (Suspicious / Probable Scam)
 */
export const RiskScoreMeter = ({
  score = 0,
  size = 'md',
  showBadge = true,
  className = '',
}) => {
  // Normalize score
  const safeScore = Math.min(100, Math.max(0, Math.round(score)));

  let statusConfig = {
    label: 'Low Risk — Verified',
    variant: 'verified',
    color: '#16A36A',
    bgColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    icon: ShieldCheck,
    summary: 'High integrity markers detected. Standard hiring procedure.',
  };

  if (safeScore > 60) {
    statusConfig = {
      label: 'High Risk — Suspicious',
      variant: 'suspicious',
      color: '#DC4B4B',
      bgColor: '#FEF2F2',
      borderColor: '#FECACA',
      icon: ShieldAlert,
      summary: 'Critical red flags detected. Financial demands or spoofed credentials.',
    };
  } else if (safeScore > 25) {
    statusConfig = {
      label: 'Moderate Risk — Unverified',
      variant: 'unverified',
      color: '#D99A28',
      bgColor: '#FFFBEB',
      borderColor: '#FDE68A',
      icon: AlertTriangle,
      summary: 'Incomplete employer information or non-standard contact channels.',
    };
  }

  const Icon = statusConfig.icon;

  if (size === 'sm') {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <div className="w-16 bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${safeScore}%`,
              backgroundColor: statusConfig.color,
            }}
          />
        </div>
        <span
          className="text-xs font-semibold tabular-nums"
          style={{ color: statusConfig.color }}
        >
          {safeScore}%
        </span>
      </div>
    );
  }

  if (size === 'lg') {
    return (
      <div
        className={`p-5 rounded-2xl border transition-all ${className}`}
        style={{
          backgroundColor: statusConfig.bgColor,
          borderColor: statusConfig.borderColor,
        }}
      >
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2.5">
            <div
              className="p-2.5 rounded-xl bg-white shadow-2xs"
              style={{ color: statusConfig.color }}
            >
              <Icon size={24} />
            </div>
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-[#64748B]">
                Fraud Probability Index
              </p>
              <h4 className="text-base font-bold text-[#182B36]">
                {statusConfig.label}
              </h4>
            </div>
          </div>
          <div className="text-right">
            <span
              className="text-3xl font-extrabold tabular-nums tracking-tight"
              style={{ color: statusConfig.color }}
            >
              {safeScore}
              <span className="text-base font-medium text-[#64748B]">/100</span>
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/80 h-3 rounded-full overflow-hidden border border-[#E2E8F0] p-0.5 mb-2.5">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${Math.max(safeScore, 4)}%`,
              backgroundColor: statusConfig.color,
            }}
          />
        </div>

        <p className="text-xs text-[#475569]">{statusConfig.summary}</p>
      </div>
    );
  }

  // Default 'md'
  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-[#475569]">Fraud Risk Score</span>
        <span
          className="font-bold tabular-nums"
          style={{ color: statusConfig.color }}
        >
          {safeScore}/100
        </span>
      </div>
      <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${safeScore}%`,
            backgroundColor: statusConfig.color,
          }}
        />
      </div>
      {showBadge && (
        <div className="pt-1">
          <Badge variant={statusConfig.variant} size="sm" showDot>
            {statusConfig.label}
          </Badge>
        </div>
      )}
    </div>
  );
};

export default RiskScoreMeter;
