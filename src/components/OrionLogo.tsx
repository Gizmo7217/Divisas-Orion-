import React from 'react';

interface OrionLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const OrionLogo: React.FC<OrionLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Orion Shield / Star Icon */}
      <div
        className={`${sizeClasses[size]} relative flex items-center justify-center rounded-2xl bg-gradient-to-tr from-[#590404] via-[#7B0606] to-[#DC2626] border-2 border-red-500/40 shadow-lg shadow-red-950/40 text-white font-black overflow-hidden flex-shrink-0`}
      >
        <span className="relative z-10 tracking-tighter" style={{ fontFamily: "'Outfit', sans-serif" }}>
          DO
        </span>
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase italic"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            DIVISAS <span className="text-amber-300">ORION</span>
          </span>
          <span className="text-[10px] sm:text-[11px] font-semibold text-red-200 tracking-wider uppercase mt-0.5">
            Giros • Remesas • Streaming
          </span>
        </div>
      )}
    </div>
  );
};
