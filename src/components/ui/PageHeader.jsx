import { Fragment } from 'react';
import { Link } from 'react-router-dom';

/**
 * Reusable PageHeader component for CircularShield pages
 */
export const PageHeader = ({
  title,
  subtitle,
  badge,
  actions,
  breadcrumbs = [],
  className = '',
}) => {
  return (
    <div className={`mb-6 sm:mb-8 space-y-2 ${className}`}>
      {breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-xs text-[#64748B] mb-2 font-medium flex-wrap" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            const target = crumb.to || crumb.href;
            const isInternal = target && target.startsWith('/');

            return (
              <Fragment key={idx}>
                {idx > 0 && <span className="text-[#CBD5E1]">/</span>}
                {isLast ? (
                  <span className="text-[#102C3A] font-semibold">{crumb.label}</span>
                ) : isInternal ? (
                  <Link
                    to={target}
                    className="hover:text-[#087F70] transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : target ? (
                  <a
                    href={target}
                    className="hover:text-[#087F70] transition-colors"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {crumb.label}
                  </a>
                ) : (
                  <span>{crumb.label}</span>
                )}
              </Fragment>
            );
          })}
        </nav>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-[#102C3A] tracking-tight">
              {title}
            </h1>
            {badge}
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-[#64748B] mt-1 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
