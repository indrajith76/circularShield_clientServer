/**
 * Reusable Tabs component
 */
import { isValidElement } from 'react';

export const Tabs = ({ tabs = [], activeTab, onChange, className = '' }) => {
  return (
    <div
      className={`inline-flex p-1 bg-[#F1F5F8] rounded-xl border border-[#E2E8EC] gap-1 overflow-x-auto max-w-full ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-150 whitespace-nowrap cursor-pointer ${
              isActive
                ? 'bg-white text-[#102C3A] shadow-xs font-semibold'
                : 'text-[#64748B] hover:text-[#182B36] hover:bg-white/60'
            }`}
          >
            {Icon && (
              <span className={isActive ? 'text-[#087F70]' : 'text-[#94A3B8]'}>
                {isValidElement(Icon) ? Icon : <Icon size={16} />}
              </span>
            )}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full font-semibold ${
                  isActive
                    ? 'bg-[#102C3A]/10 text-[#102C3A]'
                    : 'bg-[#E2E8F0] text-[#64748B]'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
