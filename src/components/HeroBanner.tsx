import React from 'react';
import { ExchangeRates, CurrencyDirection } from '../types';
import { ArrowRightLeft, Sparkles, TrendingUp, ShieldCheck, Zap, ArrowDown, ArrowUp } from 'lucide-react';

interface HeroBannerProps {
  rates: ExchangeRates;
  activeDirection: CurrencyDirection;
  onSelectDirection: (dir: CurrencyDirection) => void;
  onOpenFlyerModal: () => void;
  onOpenSettings?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  rates,
  activeDirection,
  onSelectDirection,
  onOpenFlyerModal,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#6b0505] via-[#7B0606] to-[#450202] text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b-4 border-amber-400/80 shadow-2xl">
      {/* Background Graphic Watermark */}
      <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden select-none">
        <div className="grid grid-cols-6 gap-8 transform rotate-12 scale-125">
          {Array.from({ length: 36 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center justify-center font-black text-white">
              <span className="text-4xl font-black">$</span>
              <span className="text-xs font-bold tracking-widest">DIVISAS</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative max-w-5xl mx-auto text-center">
        {/* Live badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 border border-white/20 text-xs sm:text-sm font-semibold mb-6 shadow-inner">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          <span className="text-red-100">Tasas Garantizadas y Actualizadas</span>
          <span className="text-amber-300 font-bold">• Entrega Inmediata</span>
        </div>

        {/* Big headline following the photo style */}
        <h1
          className="text-4xl sm:text-6xl lg:text-7xl font-black italic tracking-tight uppercase text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          TASA DEL DÍA
        </h1>

        <p className="mt-2 text-sm sm:text-lg text-red-100/90 font-medium max-w-2xl mx-auto italic">
          "{rates.slogan}"
        </p>

        {/* Direction Switcher & Rate Cards in flyer style */}
        <div className="mt-8 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {/* Card 1: COP to VES (Division) */}
          <div
            onClick={() => onSelectDirection('COP_TO_VES')}
            className={`cursor-pointer rounded-3xl p-6 sm:p-7 border-3 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden ${
              activeDirection === 'COP_TO_VES'
                ? 'bg-gradient-to-br from-neutral-900 via-neutral-900 to-[#1f0204] border-amber-400 shadow-2xl ring-4 ring-amber-400/20'
                : 'bg-black/50 border-white/20 hover:border-white/40'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider bg-red-600/90 text-white px-3 py-1 rounded-full shadow">
                <span>🇨🇴 Pesos</span>
                <ArrowRightLeft className="w-3 h-3" />
                <span>🇻🇪 Bolívares</span>
              </span>
              <span className="text-xs font-bold text-amber-300 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                División (÷)
              </span>
            </div>

            <div className="mt-2">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
                Tasa Oficial Activa
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span
                  className="text-5xl sm:text-6xl font-black text-white tracking-tighter"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {rates.copToVesRate.toString().replace('.', ',')}
                </span>
                <span className="text-sm font-bold text-red-300">COP / VES</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 text-xs text-neutral-300 flex items-center justify-between">
              <span className="italic">Ej: $ 100.000 COP ÷ {rates.copToVesRate.toString().replace('.', ',')}</span>
              <span className="font-extrabold text-amber-300">
                = {(100000 / rates.copToVesRate).toLocaleString('es-VE', { maximumFractionDigits: 0 })} Bs
              </span>
            </div>
          </div>

          {/* Card 2: VES to COP (Multiplication) */}
          <div
            onClick={() => onSelectDirection('VES_TO_COP')}
            className={`cursor-pointer rounded-3xl p-6 sm:p-7 border-3 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden ${
              activeDirection === 'VES_TO_COP'
                ? 'bg-gradient-to-br from-neutral-900 via-neutral-900 to-[#1f0204] border-amber-400 shadow-2xl ring-4 ring-amber-400/20'
                : 'bg-black/50 border-white/20 hover:border-white/40'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider bg-red-600/90 text-white px-3 py-1 rounded-full shadow">
                <span>🇻🇪 Bolívares</span>
                <ArrowRightLeft className="w-3 h-3" />
                <span>🇨🇴 Pesos</span>
              </span>
              <span className="text-xs font-bold text-amber-300 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                Multiplicación (×)
              </span>
            </div>

            <div className="mt-2">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
                Tasa Oficial Activa
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span
                  className="text-5xl sm:text-6xl font-black text-white tracking-tighter"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {rates.vesToCopRate.toString().replace('.', ',')}
                </span>
                <span className="text-sm font-bold text-red-300">VES / COP</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 text-xs text-neutral-300 flex items-center justify-between">
              <span className="italic">Ej: 20.000 Bs × {rates.vesToCopRate.toString().replace('.', ',')}</span>
              <span className="font-extrabold text-amber-300">
                = $ {(20000 * rates.vesToCopRate).toLocaleString('es-CO')} COP
              </span>
            </div>
          </div>
        </div>

        {/* Subtitle action pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onSelectDirection('COP_TO_VES')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black text-xs sm:text-sm shadow-xl transition-all transform hover:scale-105"
          >
            <Zap className="w-4 h-4 fill-neutral-950" />
            <span>Calcular Giros Ahora</span>
          </button>

          <button
            onClick={onOpenFlyerModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-black/40 hover:bg-black/60 text-white border border-white/30 font-bold text-xs sm:text-sm transition-all"
          >
            <span>Ver Tabla Oficial Flyer</span>
          </button>
        </div>
      </div>
    </section>
  );
};
