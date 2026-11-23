/**
 * Reusable accessible loading skeletons for content, cards, and data tables
 */
export const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-lg bg-slate-200/80 ${className}`}
      {...props}
    />
  );
};

export const MetricCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
        <Skeleton className="w-11 h-11 rounded-xl" />
      </div>
      <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
};

export const CardSkeleton = ({ className = '', hasHeader = true, rows = 3 }) => {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden ${className}`}>
      {hasHeader && (
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-64 max-w-full" />
          </div>
          <Skeleton className="h-8 w-20 rounded-xl" />
        </div>
      )}
      <div className="p-5 space-y-3">
        {Array.from({ length: rows }).map((_, idx) => (
          <Skeleton
            key={idx}
            className={`h-4 ${idx === rows - 1 ? 'w-2/3' : 'w-full'}`}
          />
        ))}
      </div>
    </div>
  );
};

export const TableSkeleton = ({ rows = 5, cols = 4, className = '' }) => {
  return (
    <div className={`w-full overflow-hidden rounded-xl border border-slate-200 bg-white ${className}`}>
      {/* Table Header Skeleton */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-3.5 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className={`h-4 ${i === 0 ? 'w-32' : 'w-24'} shrink-0`} />
        ))}
      </div>
      {/* Table Rows Skeleton */}
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="px-4 py-4 flex items-center gap-4">
            {Array.from({ length: cols }).map((_, c) => (
              <Skeleton
                key={c}
                className={`h-4 ${
                  c === 0 ? 'w-48' : c === cols - 1 ? 'w-20' : 'w-28'
                } shrink-0`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skeleton;
