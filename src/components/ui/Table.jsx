/**
 * Reusable responsive Table component
 */
import { isValidElement } from 'react';

export const Table = ({ children, className = '' }) => {
  return (
    <div className={`w-full overflow-x-auto rounded-xl border border-[#E2E8F0] bg-white scrollbar-thin ${className}`}>
      <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-full">
        {children}
      </table>
    </div>
  );
};

export const TableHeader = ({ children, className = '' }) => {
  return (
    <thead className={`bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] sm:text-xs font-semibold uppercase text-[#64748B] tracking-wider ${className}`}>
      {children}
    </thead>
  );
};

export const TableBody = ({ children, className = '' }) => {
  return (
    <tbody className={`divide-y divide-[#F1F5F8] text-[#182B36] ${className}`}>
      {children}
    </tbody>
  );
};

export const TableRow = ({ children, className = '', onClick }) => {
  return (
    <tr
      onClick={onClick}
      className={`transition-colors ${
        onClick ? 'hover:bg-[#F8FAFC] cursor-pointer' : 'hover:bg-[#FBFDFE]'
      } ${className}`}
    >
      {children}
    </tr>
  );
};

export const TableHead = ({ children, className = '' }) => {
  return (
    <th className={`px-3 py-3 sm:px-4 sm:py-3.5 text-left font-semibold text-[11px] sm:text-xs text-[#475569] whitespace-nowrap ${className}`}>
      {children}
    </th>
  );
};

export const TableCell = ({ children, className = '' }) => {
  return <td className={`px-3 py-3 sm:px-4 sm:py-3.5 align-middle ${className}`}>{children}</td>;
};

export const EmptyState = ({
  icon: Icon,
  title = 'No records found',
  description = 'Try adjusting your filters or search keywords.',
  action,
}) => {
  return (
    <div className="py-12 px-4 text-center flex flex-col items-center justify-center">
      {Icon && (
        <div className="w-12 h-12 rounded-2xl bg-[#F1F5F8] text-[#64748B] flex items-center justify-center mb-3">
          {isValidElement(Icon) ? Icon : <Icon size={24} />}
        </div>
      )}
      <h4 className="text-base font-medium text-[#182B36]">{title}</h4>
      <p className="text-xs sm:text-sm text-[#64748B] max-w-sm mt-1 mb-4">
        {description}
      </p>
      {action}
    </div>
  );
};

export default Table;
