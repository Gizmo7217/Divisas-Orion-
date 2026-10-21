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
    sm: { img: 'h-9 w-auto', textTitle: 'text-sm', textSub: 'text-xs' },
    md: { img: 'h-11 sm:h-12 w-auto', textTitle: 'text-lg', textSub: 'text-base' },
    lg: { img: 'h-16 sm:h-20 w-auto', textTitle: 'text-2xl', textSub: 'text-xl' },
    xl: { img: 'h-24 sm:h-28 w-auto', textTitle: 'text-3xl', textSub: 'text-2xl' },
  };

  const dim = sizeMap[size];
  const textColor = variant === 'dark' ? 'text-neutral-900' : 'text-white';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official 3D Embossed Logo Image provided by user */}
      <div className="relative flex-shrink-0 overflow-hidden rounded-xl shadow-lg border border-red-400/40 bg-[#650406]">
        <img
          src="/assets/aistudio/file_000000000a4081f586ec95c675ee9ac0_e50ccf50.png"
          alt="Divisas Orion Logo"
          className={`${dim.img} object-contain transition-transform duration-200 hover:scale-105`}
        />
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
