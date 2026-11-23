/**
 * CircularShield Analysis Result Display
 * Displays backend analysis results in a user-friendly format.
 * Safely handles missing or optional response fields.
 * Shows risk score, status, indicators, evidence, verification, contacts,
 * bilingual explanations, and recommended safety actions.
 *
 * This component only renders data provided by the backend — it performs
 * no detection or scoring itself.
 */
import { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Phone,
  FileText,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const RISK_LEVEL_CONFIG = {
  low: { label: 'Low Risk', color: '#16A36A', bg: '#ECFDF5' },
  medium: { label: 'Medium Risk', color: '#B45309', bg: '#FFFBEB' },
  high: { label: 'High Risk', color: '#DC4B4B', bg: '#FEF2F2' },
  critical: { label: 'Critical Risk', color: '#7F1D1D', bg: '#FEF2F2' },
  unknown: { label: 'Unknown', color: '#64748B', bg: '#F1F5F9' },
};

export const AnalysisResultDisplay = ({
  result,
  onCheckAnother,
  onViewFullReport,
  className = '',
}) => {
  const [expandedSections, setExpandedSections] = useState({
    indicators: false,
    verification: false,
    contacts: false,
    bilingual: false,
    actions: false,
  });

  if (!result) return null;

  const {
    id,
    inputType,
    riskScore,
    riskLevel,
    finalStatus,
    fraudIndicators = [],
    organizationVerification = {},
    urlVerification = {},
    suspiciousContactDetails = [],
    explanations = { bn: '', en: '' },
    recommendedSafetyActions = [],
    processingTimeMs,
  } = result;

  const riskConfig = RISK_LEVEL_CONFIG[riskLevel] || RISK_LEVEL_CONFIG.unknown;

  const statusLabel = {
    verified: 'Verified',
    suspicious: 'Suspicious',
    unverified: 'Unverified',
    unknown: 'Unknown',
  }[finalStatus] || 'Unknown';

  const statusVariant =
    finalStatus === 'verified'
      ? 'verified'
      : finalStatus === 'suspicious'
        ? 'suspicious'
        : 'unverified';

  const toggleSection = (key) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const Chevron = (expanded) => (expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />);

  const sectionHeader = ({ key, label, icon: Icon, expanded, count }) => (
    <button
      type="button"
      onClick={() => toggleSection(key)}
      className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-left text-xs font-semibold text-[#182B36] hover:bg-[#F1F5F8] transition-colors"
    >
      <div className="flex items-center gap-2">
        <Icon size={14} className="text-[#087F70] shrink-0" />
        <span>{label}{count !== undefined ? ` (${count})` : ''}</span>
      </div>
      <Chevron expanded={expanded} />
    </button>
  );

  return (
    <div className={`space-y-4 animate-in slide-in-from-bottom-2 ${className}`}>
      {/* Header summary */}
      <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="space-y-1">
            <span className="text-xs text-[#64748B] font-medium">
              Analysis Complete
            </span>
            <h3 className="text-lg font-bold text-[#102C3A]">
              Job Circular #{id}
            </h3>
            <p className="text-xs text-[#64748B]">
              Input method:{" "}
              <span className="font-medium capitalize">{inputType}</span>{' '}
              {processingTimeMs && `• Completed in ${processingTimeMs}ms`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={statusVariant} size="md" showDot>
              {statusLabel.toUpperCase()}
            </Badge>
            <div className="text-right">
              <span className="text-xs text-[#64748B] block">Risk Score</span>
              <span className="font-extrabold text-sm text-[#102C3A]">
                {riskScore !== null ? `${riskScore}/100` : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className="w-full bg-white rounded-xl border border-[#E2E8F0] p-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${riskConfig.bg} text-${riskConfig.color === '#16A36A' ? 'text-[#16A36A]' : riskConfig.color === '#DC4B4B' ? 'text-[#DC4B4B]' : riskConfig.color === '#B45309' ? 'text-[#B45309]' : 'text-[#64748B]'}`}
            >
              <ShieldCheck size={20} />
            </div>
            <div className="flex-1">
              <p className="text-xs text-[#64748B] uppercase tracking-wider font-semibold">
                Risk Level
              </p>
              <p className={`font-bold text-sm ${riskConfig.color !== '#64748B' ? 'text-[#102C3A]' : 'text-[#64748B]'}`}>
                {riskConfig.label}
              </p>
              {riskScore !== null && (
                <p className="text-[10px] text-[#64748B] mt-0.5">
                  Score: {riskScore} / 100
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fraud Indicators */}
      {fraudIndicators.length > 0 && (
        <div className="space-y-2">
          {sectionHeader({
            key: 'indicators',
            label: 'Detected Fraud Indicators',
            icon: AlertTriangle,
            expanded: expandedSections.indicators,
            count: fraudIndicators.length,
          })}
          {expandedSections.indicators && (
            <div className="space-y-2 pt-2">
              {fraudIndicators.map((indicator) => (
                <div
                  key={indicator.id}
                  className="p-3 rounded-lg border border-[#FECACA] bg-[#FEF2F2] text-xs"
                >
                  <p className="font-semibold text-[#B91C1C] mb-1">
                    {indicator.title}
                  </p>
                  <p className="text-[#991B1B] leading-relaxed">
                    {indicator.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Organization & URL Verification */}
      <div className="space-y-2">
        {sectionHeader({
          key: 'verification',
          label: 'Organization & URL Verification',
          icon: ShieldCheck,
          expanded: expandedSections.verification,
        })}
        {expandedSections.verification && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-xs">
              <p className="text-[10px] uppercase tracking-wider text-[#64748B] font-semibold mb-1">
                Organization
              </p>
              <p className="text-xs text-[#182B36]">
                {organizationVerification.verified ? 'Verified' : 'Not Verified'}
              </p>
              {organizationVerification.orgName && (
                <p className="text-[10px] text-[#64748B] mt-1">
                  {organizationVerification.orgName}
                </p>
              )}
            </div>
            <div className="p-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-xs">
              <p className="text-[10px] uppercase tracking-wider text-[#64748B] font-semibold mb-1">
                URL
              </p>
              <p className="text-xs text-[#182B36]">
                {urlVerification.valid ? 'Valid' : 'Invalid / Not Checked'}
              </p>
              {urlVerification.domain && (
                <p className="text-[10px] text-[#64748B] mt-1 truncate">
                  {urlVerification.domain}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Suspicious Contact Details */}
      {suspiciousContactDetails.length > 0 && (
        <div className="space-y-2">
          {sectionHeader({
            key: 'contacts',
            label: 'Suspicious Contact Details',
            icon: Phone,
            expanded: expandedSections.contacts,
            count: suspiciousContactDetails.length,
          })}
          {expandedSections.contacts && (
            <div className="space-y-2 pt-2">
              {suspiciousContactDetails.map((contact) => (
                <div
                  key={`${contact.type}-${contact.value}`}
                  className="p-3 rounded-lg border border-[#FDE68A] bg-[#FFFBEB] text-xs"
                >
                  <p className="font-semibold text-[#B45309] mb-1">
                    {contact.type}
                  </p>
                  <p className="text-[#92400E] truncate">{contact.value}</p>
                  {contact.reason && (
                    <p className="text-[10px] text-[#78350F] mt-1">
                      {contact.reason}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bilingual Explanations */}
      {(explanations.en || explanations.bn) && (
        <div className="space-y-2">
          {sectionHeader({
            key: 'bilingual',
            label: 'Explanation',
            icon: FileText,
            expanded: expandedSections.bilingual,
          })}
          {expandedSections.bilingual && (
            <div className="pt-2 space-y-2">
              {explanations.en && (
                <div className="p-3 rounded-lg border border-[#E2E8F0] bg-white text-xs">
                  <p className="text-[10px] uppercase tracking-wider text-[#64748B] font-semibold mb-1">
                    English
                  </p>
                  <p className="text-xs text-[#182B36] leading-relaxed">
                    {explanations.en}
                  </p>
                </div>
              )}
              {explanations.bn && (
                <div className="p-3 rounded-lg border border-[#E2E8F0] bg-white text-xs">
                  <p className="text-[10px] uppercase tracking-wider text-[#64748B] font-semibold mb-1">
                    বাংলা (Bangla)
                  </p>
                  <p className="text-xs text-[#182B36] leading-relaxed">
                    {explanations.bn}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Recommended Safety Actions */}
      {recommendedSafetyActions.length > 0 && (
        <div className="space-y-2">
          {sectionHeader({
            key: 'actions',
            label: 'Recommended Safety Actions',
            icon: CheckCircle2,
            expanded: expandedSections.actions,
            count: recommendedSafetyActions.length,
          })}
          {expandedSections.actions && (
            <div className="pt-2 space-y-1">
              {recommendedSafetyActions.map((action, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-2 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] text-xs"
                >
                  <span className="text-[#15803D] shrink-0">✓</span>
                  <p className="text-[#14532d] leading-relaxed">{action}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-3 border-t border-[#F1F5F8]">
        <Button
          variant="outline"
          size="md"
          onClick={onCheckAnother}
          className="w-full sm:w-auto justify-center"
        >
          Check Another Circular
        </Button>
        {onViewFullReport && (
          <Button
            variant="secondary"
            size="md"
            rightIcon={<ArrowRight size={16} />}
            onClick={onViewFullReport}
            className="w-full sm:w-auto justify-center"
          >
            View Full Report
          </Button>
        )}
      </div>
    </div>
  );
};

export default AnalysisResultDisplay;
