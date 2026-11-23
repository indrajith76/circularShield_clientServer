/**
 * CircularShield Analysis Processing UI
 * Displays the analysis state machine with professional loading interface.
 * States: idle, validating, uploading, processing, completed, failed.
 * Shows progress messages as UI representations only.
 */
import { Loader2, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

const STATE_CONFIG = {
  idle: {
    label: 'Ready to analyze',
    desc: 'Select an input method and submit a job circular.',
    icon: Clock,
    color: '#64748B',
  },
  validating: {
    label: 'Validating input',
    desc: 'Checking file type, size, and content before submission.',
    icon: Loader2,
    color: '#087F70',
  },
  uploading: {
    label: 'Uploading circular',
    desc: 'Sending your file to the analysis service.',
    icon: Loader2,
    color: '#087F70',
  },
  processing: {
    label: 'Analyzing circular',
    desc: 'Backend AI model is evaluating the job circular content.',
    icon: Loader2,
    color: '#087F70',
  },
  completed: {
    label: 'Analysis complete',
    desc: 'Results are ready for review.',
    icon: CheckCircle2,
    color: '#16A36A',
  },
  failed: {
    label: 'Analysis failed',
    desc: 'Unable to complete the analysis. Please try again.',
    icon: AlertTriangle,
    color: '#DC4B4B',
  },
};

export const AnalysisProcessing = ({
  state,
  currentStep,
  error,
  className = '',
}) => {
  const config = STATE_CONFIG[state] || STATE_CONFIG.idle;
  const Icon = config.icon;

  const isLoading = state === 'validating' || state === 'uploading' || state === 'processing';

  return (
    <div className={`bg-white rounded-2xl border shadow-sm p-6 space-y-4 animate-in fade-in ${className}`}>
      <div className={`border-l-3 pl-4 ${
        state === 'failed'
          ? 'border-[#DC4B4B] bg-[#FEF2F2]'
          : state === 'completed'
            ? 'border-[#16A36A] bg-[#ECFDF5]'
            : 'border-[#087F70] bg-[#F0FDFA]'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg shrink-0 ${
            isLoading ? 'bg-[#087F70]/20 text-[#087F70]' : 'bg-[#102C3A]/10 text-[#102C3A]'
          }`}>
            <Icon
              size={20}
              className={isLoading ? 'animate-spin' : ''}
            />
          </div>
          <div>
            <h4 className={`font-bold text-sm text-[#102C3A] ${isLoading ? 'text-[#087F70]' : ''}`}>
              {config.label}
            </h4>
            <p className="text-xs text-[#64748B]">{config.desc}</p>
          </div>
        </div>
      </div>

      {currentStep && (
        <div className="space-y-1.5 pt-1">
          <p className="text-[10px] uppercase tracking-wider text-[#94A3B8] font-semibold">
            Current step
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full shrink-0" />
            <span className="text-xs text-[#64748B]">{currentStep.message}</span>
          </div>
        </div>
      )}

      {state === 'failed' && error && (
        <div className="p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-center gap-2 text-xs font-semibold text-[#DC4B4B]">
          <AlertTriangle size={16} className="shrink-0" />
          <span>{error.message}</span>
        </div>
      )}
    </div>
  );
};

export default AnalysisProcessing;
