import React from 'react';

interface OrionLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'brand';
  showText?: boolean;
  className?: string;
}

export const OrionLogo: React.FC<OrionLogoProps> = ({
  size = 'md',
  variant = 'light',
  showText = true,
  className = '',
}) => {
  const sizeMap = {
    sm: { icon: 32, textTitle: 'text-base', textSub: 'text-sm' },
    md: { icon: 44, textTitle: 'text-xl', textSub: 'text-lg' },
    lg: { icon: 60, textTitle: 'text-2xl', textSub: 'text-xl' },
    xl: { icon: 80, textTitle: 'text-4xl', textSub: 'text-3xl' },
  };

  const dim = sizeMap[size];
  const textColor = variant === 'dark' ? 'text-neutral-900' : 'text-white';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Recreated Logo Mark from photo: Curved arrow swooshing onto globe with $ inside */}
      <div className="relative flex-shrink-0" style={{ width: dim.icon, height: dim.icon }}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md"
        >
          {/* Curved swoosh arrow over the globe */}
          <path
            d="M 28 42 C 28 22, 45 10, 72 16"
            stroke="currentColor"
            strokeWidth="7"
            strokeLinecap="round"
            className={variant === 'dark' ? 'text-red-700' : 'text-white'}
          />
          <polygon
            points="24,36 12,48 34,48"
            fill="currentColor"
            className={variant === 'dark' ? 'text-red-700' : 'text-white'}
          />

          {/* Globe circle */}
          <circle
            cx="55"
            cy="60"
            r="30"
            stroke="currentColor"
            strokeWidth="5"
            className={variant === 'dark' ? 'text-red-700' : 'text-white'}
          />

          {/* Latitude lines */}
          <ellipse
            cx="55"
            cy="60"
            rx="30"
            ry="13"
            stroke="currentColor"
            strokeWidth="3.5"
            className={variant === 'dark' ? 'text-red-600' : 'text-white/90'}
          />
          {/* Longitude vertical ellipse */}
          <ellipse
            cx="55"
            cy="60"
            rx="13"
            ry="30"
            stroke="currentColor"
            strokeWidth="3.5"
            className={variant === 'dark' ? 'text-red-600' : 'text-white/90'}
          />

          {/* Center Dollar Sign */}
          <circle
            cx="55"
            cy="60"
            r="12"
            fill={variant === 'dark' ? '#7f1d1d' : '#8B0000'}
            stroke="currentColor"
            strokeWidth="2"
            className={variant === 'dark' ? 'text-white' : 'text-white'}
          />
          <text
            x="55"
            y="65"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="14"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            $
          </text>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none tracking-tight">
          <span
            className={`font-black uppercase tracking-wider ${dim.textTitle} ${textColor} drop-shadow-sm`}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            DIVISAS
          </span>
          <span
            className={`font-black uppercase tracking-widest ${dim.textSub} ${variant === 'dark' ? 'text-red-700' : 'text-red-100'} -mt-0.5`}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            ORION
          </span>
        </div>
      )}
    </div>
  );
};
