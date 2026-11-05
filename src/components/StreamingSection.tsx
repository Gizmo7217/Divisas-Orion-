import React from 'react';
import { Sparkles, Tv } from 'lucide-react';

export const StreamingSection: React.FC = () => {
  return (
    <section id="streaming-aliado" className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#2e0305] via-[#4d0407] to-[#200102] border-2 border-red-500/40 p-6 sm:p-9 shadow-2xl text-white text-center sm:text-left flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Glow ambient background effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-500 via-red-600 to-rose-700 p-0.5 shadow-xl flex-shrink-0 flex items-center justify-center">
            <div className="w-full h-full bg-neutral-950 rounded-[14px] flex items-center justify-center text-amber-400">
              <Tv className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[11px] font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Próximamente • Página Aliada</span>
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-snug">
              Muy pronto servicios de streaming y aplicaciones en nuestra página aliada <span className="text-amber-300 underline decoration-red-500 underline-offset-4">Orión Service</span>
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-red-200/90 max-w-2xl font-medium">
              Estamos preparando una plataforma dedicada exclusivamente a pantallas de streaming y licencias de aplicaciones para brindarte la mejor experiencia y soporte.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex-shrink-0">
          <div className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-black/50 border border-red-500/30 text-amber-300 font-extrabold text-xs sm:text-sm shadow-inner backdrop-blur-sm">
            <span>Orión Service</span>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
