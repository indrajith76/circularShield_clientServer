/**
 * CircularShield Analysis Input Methods
 * Tab selector for the four supported input methods: PDF, Image, Text, URL.
 * Only one method can be active at a time.
 */
import { useCallback } from 'react';
import { Upload, Image, FileText, Link2 } from 'lucide-react';

const METHODS = [
  {
    key: 'pdf',
    label: 'Upload PDF',
    hint: 'Job circular document',
    icon: Upload,
    accept: '.pdf',
  },
  {
    key: 'image',
    label: 'Upload Image',
    hint: 'Scanned circular photo',
    icon: Image,
    accept: '.jpg,.jpeg,.png',
  },
  {
    key: 'text',
    label: 'Paste Text',
    hint: 'Copy & paste circular text',
    icon: FileText,
  },
  {
    key: 'url',
    label: 'Enter URL',
    hint: 'Job portal or link',
    icon: Link2,
  },
];

export const AnalysisInputMethods = ({
  activeMethod,
  onSelect,
  className = '',
}) => {
  const handleSelect = useCallback(
    (key) => {
      onSelect(key);
    },
    [onSelect],
  );

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-4 gap-3 ${className}`}
      role="tablist"
      aria-label="Select input method"
    >
      {METHODS.map((method) => {
        const isActive = activeMethod === method.key;
        const Icon = method.icon;
        return (
          <button
            key={method.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => handleSelect(method.key)}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
              isActive
                ? 'bg-white border-[#087F70] shadow-sm ring-2 ring-[#087F70]/20'
                : 'bg-white/60 border-[#E2E8F0] hover:bg-white text-[#64748B]'
            }`}
          >
            <div
              className={`p-2.5 rounded-lg shrink-0 ${
                isActive
                  ? 'bg-[#087F70] text-white'
                  : 'bg-[#F1F5F8] text-[#64748B]'
              }`}
            >
              <Icon size={18} />
            </div>
            <div>
              <p className="font-bold text-sm text-[#102C3A] leading-tight">
                {method.label}
              </p>
              <p className="text-xs text-[#64748B] leading-tight">
                {method.hint}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default AnalysisInputMethods;
