import { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Reusable accessible Modal dialog
 */
export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = 'max-w-2xl',
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#102C3A]/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Content */}
      <div
        className={`relative w-full ${maxWidth} bg-white rounded-2xl shadow-xl border border-[#E2E8F0] z-10 overflow-hidden flex flex-col max-h-[92vh] my-auto animate-in fade-in zoom-in-95 duration-150`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-4 py-3.5 sm:px-6 sm:py-4 border-b border-[#F1F5F8] flex items-center justify-between gap-3 shrink-0 bg-white">
          <div className="min-w-0 flex-1">
            {title && (
              <h3 className="text-base sm:text-lg font-semibold text-[#182B36] tracking-tight truncate">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-xs sm:text-sm text-[#64748B] mt-0.5 line-clamp-2">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 text-[#64748B] hover:text-[#182B36] hover:bg-[#F1F5F8] rounded-xl transition-colors cursor-pointer shrink-0"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-[#182B36]">
          {children}
        </div>

        {/* Optional Footer */}
        {footer && (
          <div className="px-4 py-3 sm:px-6 sm:py-4 bg-[#F8FAFC] border-t border-[#F1F5F8] flex flex-wrap items-center justify-end gap-2.5 sm:gap-3 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
