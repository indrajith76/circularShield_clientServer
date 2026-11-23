import { Link } from 'react-router-dom';

/**
 * CircularShield Unified Brand Logo Component
 * 
 * Concept:
 * - Shield (Security & Protection in deep navy/blue)
 * - Job Circular Document (Folded corner with "JOB" header)
 * - Verified Checkmark (Teal circle with crisp checkmark)
 * - Dynamic Teal Sweeping Orbit Swoosh
 * 
 * Variants:
 * - 'primary': Navy/Teal text on light background
 * - 'white': White/Teal text for dark backgrounds (e.g. #102C3A sidebar)
 * - 'icon': Icon only (responsive scales)
 * - 'vertical': Stacked icon + text + tagline (for login, splash, reports)
 */

export const BrandIcon = ({ className = 'w-9 h-9', size = 36 }) => {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      width={size}
      height={size}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="shieldGradReact" x1="100" y1="20" x2="100" y2="170" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0066FF" />
          <stop offset="100%" stopColor="#0B2038" />
        </linearGradient>

        <linearGradient id="shieldFacetReact" x1="45" y1="35" x2="155" y2="155" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1E75FF" />
          <stop offset="60%" stopColor="#0C2D54" />
          <stop offset="100%" stopColor="#081A30" />
        </linearGradient>

        <linearGradient id="swooshGradReact" x1="20" y1="120" x2="180" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00E5C9" />
          <stop offset="50%" stopColor="#087F70" />
          <stop offset="100%" stopColor="#00BFA5" />
        </linearGradient>

        <linearGradient id="checkCircleGradReact" x1="130" y1="90" x2="155" y2="140" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00E5C9" />
          <stop offset="100%" stopColor="#087F70" />
        </linearGradient>

        <filter id="docShadowReact" x="55" y="42" width="90" height="105" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#051525" flood-opacity="0.3" />
        </filter>
      </defs>

      {/* Outer Shield */}
      <path
        d="M100 22 C138 35 158 46 166 68 C166 112 144 148 100 172 C56 148 34 112 34 68 C42 46 62 35 100 22 Z"
        fill="url(#shieldGradReact)"
      />

      {/* Shield Inner Facet Highlight */}
      <path
        d="M100 28 C134 40 151 50 159 69 C159 108 139 141 100 163 C61 141 41 108 41 69 C49 50 66 40 100 28 Z"
        fill="url(#shieldFacetReact)"
        stroke="#388BFD"
        strokeWidth="2.5"
        strokeOpacity="0.5"
      />

      {/* Back Swoosh shadow */}
      <path
        d="M168 76 C178 88 174 104 158 116 C144 126 122 134 100 137"
        stroke="url(#swooshGradReact)"
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
        opacity="0.3"
      />

      {/* Job Circular Document */}
      <g filter="url(#docShadowReact)">
        <path
          d="M68 52 C68 47.5 71.5 44 76 44 H114 L132 62 V128 C132 132.5 128.5 136 124 136 H76 C71.5 136 68 132.5 68 128 Z"
          fill="#FFFFFF"
        />
        <path d="M114 44 V58 C114 60.2 115.8 62 118 62 H132 Z" fill="#D3E2F2" />
        <text
          x="100"
          y="77"
          fill="#102C3A"
          fontFamily="'Inter', system-ui, sans-serif"
          fontWeight="800"
          fontSize="15"
          letterSpacing="0.8"
          textAnchor="middle"
        >
          JOB
        </text>
        <rect x="80" y="87" width="40" height="4.5" rx="2.25" fill="#8FA4BD" />
        <rect x="80" y="97" width="40" height="4.5" rx="2.25" fill="#8FA4BD" />
        <rect x="80" y="107" width="28" height="4.5" rx="2.25" fill="#B0C1D4" />
      </g>

      {/* Front Orbit Swoosh */}
      <path
        d="M22 118 C28 140 70 148 108 138 C144 128 166 108 172 82 C174 74 168 68 160 70 C154 72 148 76 142 82 C126 98 94 114 64 120 C46 124 32 122 22 118 Z"
        fill="url(#swooshGradReact)"
      />

      {/* Verification Checkmark Badge */}
      <g transform="translate(142, 114)">
        <circle cx="0" cy="0" r="23" fill="#FFFFFF" />
        <circle cx="0" cy="0" r="19.5" fill="url(#checkCircleGradReact)" />
        <path
          d="M-8 -1 L-2.5 5 L8 -7"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export const BrandLogo = ({
  variant = 'primary', // 'primary' | 'white' | 'icon' | 'vertical'
  showTagline = false,
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  asLink = true,
  href = '/',
  className = '',
}) => {
  const sizeMap = {
    sm: { icon: 28, text: 'text-base', tagline: 'text-[9px]' },
    md: { icon: 38, text: 'text-xl', tagline: 'text-[10.5px]' },
    lg: { icon: 48, text: 'text-2xl', tagline: 'text-xs' },
    xl: { icon: 84, text: 'text-3xl sm:text-4xl', tagline: 'text-xs sm:text-sm' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;
  const isWhite = variant === 'white';

  if (variant === 'icon') {
    const iconOnly = <BrandIcon size={currentSize.icon} className={className} />;
    return asLink ? (
      <Link to={href} className="inline-flex items-center hover:opacity-90 transition-opacity">
        {iconOnly}
      </Link>
    ) : (
      iconOnly
    );
  }

  // Vertical stacked version (for Login page, hero or splash)
  if (variant === 'vertical') {
    const verticalContent = (
      <div className={`flex flex-col items-center text-center space-y-3 ${className}`}>
        <BrandIcon size={currentSize.icon} className="drop-shadow-sm hover:scale-105 transition-transform" />
        <div className="space-y-1">
          <span
            className={`font-black tracking-tight ${currentSize.text} leading-none block select-none`}
          >
            <span className={isWhite ? 'text-white' : 'text-[#102C3A]'}>Circular</span>
            <span className={isWhite ? 'text-[#00E5C9]' : 'text-[#087F70]'}>Shield</span>
          </span>
          {showTagline && (
            <div className="flex items-center justify-center gap-2 pt-1">
              <span className="w-8 h-px bg-slate-300 dark:bg-slate-600 block"></span>
              <p
                className={`font-semibold tracking-wider uppercase select-none ${currentSize.tagline} ${
                  isWhite ? 'text-slate-300' : 'text-[#5C717E]'
                }`}
              >
                Verify <span className="text-[#087F70]">•</span> Detect <span className="text-[#087F70]">•</span> Stay Safe
              </p>
              <span className="w-8 h-px bg-slate-300 dark:bg-slate-600 block"></span>
            </div>
          )}
        </div>
      </div>
    );

    return asLink ? (
      <Link to={href} className="hover:opacity-95 transition-opacity inline-block">
        {verticalContent}
      </Link>
    ) : (
      verticalContent
    );
  }

  // Horizontal lockup (for Navbar, Sidebar, Footer)
  const horizontalContent = (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <BrandIcon size={currentSize.icon} />
      <div className="flex flex-col text-left">
        <span
          className={`font-extrabold tracking-tight ${currentSize.text} leading-none`}
        >
          <span className={isWhite ? 'text-white' : 'text-[#102C3A]'}>Circular</span>
          <span className={isWhite ? 'text-[#00E5C9]' : 'text-[#087F70]'}>Shield</span>
        </span>
        {showTagline && (
          <span
            className={`font-medium tracking-wide mt-1 leading-none hidden sm:inline-block ${currentSize.tagline} ${
              isWhite ? 'text-slate-300' : 'text-[#5C717E]'
            }`}
          >
            Verify <span className="text-[#087F70]">•</span> Detect <span className="text-[#087F70]">•</span> Stay Safe
          </span>
        )}
      </div>
    </div>
  );

  return asLink ? (
    <Link to={href} className="inline-flex items-center hover:opacity-90 transition-opacity">
      {horizontalContent}
    </Link>
  ) : (
    horizontalContent
  );
};

export default BrandLogo;
