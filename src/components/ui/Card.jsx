/**
 * Reusable Card component with clean borders and subtle shadow
 */
export const Card = ({
  children,
  className = '',
  hoverEffect = false,
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-[#E2E8F0] shadow-xs transition-all duration-150 overflow-hidden ${
        hoverEffect ? 'hover:shadow-md hover:border-[#CBD5E1] cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', action }) => {
  return (
    <div
      className={`px-4 py-3.5 sm:px-6 sm:py-4.5 border-b border-[#F1F5F8] flex items-center justify-between gap-3 sm:gap-4 ${className}`}
    >
      <div className="space-y-0.5 min-w-0">{children}</div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

export const CardTitle = ({ children, className = '' }) => {
  return (
    <h3
      className={`text-base sm:text-lg font-semibold text-[#182B36] tracking-tight ${className}`}
    >
      {children}
    </h3>
  );
};

export const CardDescription = ({ children, className = '' }) => {
  return (
    <p className={`text-xs sm:text-sm text-[#64748B] ${className}`}>
      {children}
    </p>
  );
};

export const CardContent = ({ children, className = '' }) => {
  return <div className={`p-4 sm:p-6 ${className}`}>{children}</div>;
};

export const CardFooter = ({ children, className = '' }) => {
  return (
    <div
      className={`px-4 py-3 sm:px-6 sm:py-3.5 bg-[#F8FAFC] border-t border-[#F1F5F8] flex items-center justify-between text-xs sm:text-sm text-[#64748B] ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
