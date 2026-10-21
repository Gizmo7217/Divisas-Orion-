import React from 'react';
import { ExchangeRates, CurrencyDirection } from '../types';
import { ArrowRightLeft, TrendingUp, ShieldCheck, Zap, Sparkles, Image as ImageIcon } from 'lucide-react';

interface HeroBannerProps {
  rates: ExchangeRates;
  activeDirection: CurrencyDirection;
  onSelectDirection: (dir: CurrencyDirection) => void;
  onOpenFlyerModal: () => void;
  onOpenSettings: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  rates,
  activeDirection,
  onSelectDirection,
  onOpenFlyerModal,
  onOpenSettings,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#6b0505] via-[#7B0606] to-[#450202] text-white pt-8 pb-12 px-4 sm:px-6 lg:px-8 border-b border-red-500/20">
      {/* Background patterned SVG icons reminiscent of the flyer watermark */}
      <div className="absolute inset-0 opacity-10 pointer-events-none select-none overflow-hidden">
        <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-red-400 blur-3xl"></div>
        <div className="absolute -bottom-12 -right-12 w-96 h-96 rounded-full bg-rose-500 blur-3xl"></div>
        
        {/* Repeating currency symbols & arrows */}
        <div className="grid grid-cols-6 gap-12 p-8 text-white">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center justify-center opacity-30 transform -rotate-12">
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
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {/* Card 1: Pesos a Bolívares (The primary featured in the photo) */}
          <div
            onClick={() => onSelectDirection('COP_TO_VES')}
            className={`cursor-pointer relative rounded-3xl p-6 transition-all duration-300 transform hover:scale-[1.02] text-center border-2 ${
              activeDirection === 'COP_TO_VES'
                ? 'bg-gradient-to-b from-[#8f0a0a] to-[#590404] border-white shadow-[0_0_25px_rgba(255,255,255,0.25)] ring-4 ring-red-400/30'
                : 'bg-black/30 border-white/30 hover:border-white/60'
            }`}
          >
            {activeDirection === 'COP_TO_VES' && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-red-950 font-black text-xs uppercase px-3 py-0.5 rounded-full shadow-md">
                Seleccionado
              </span>
            )}

            <div className="text-xs uppercase tracking-widest font-extrabold text-red-200 mb-1">
              🇨🇴 COLOMBIA ➔ 🇻🇪 VENEZUELA
            </div>
            <div className="text-xl sm:text-2xl font-black tracking-wider uppercase text-white mb-3">
              PESOS A BOLÍVARES
            </div>

            {/* The signature white pill rate container from the flyer photo */}
            <div className="bg-white text-[#8B0000] rounded-full py-2.5 px-6 shadow-xl inline-block w-full max-w-xs mx-auto border-2 border-white/90">
              <span className="text-4xl sm:text-5xl font-black tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                {rates.copToVesRate.toString().replace('.', ',')}
              </span>
            </div>

            <p className="mt-3 text-xs text-red-100/90 font-medium">
              Fórmula: <span className="font-bold text-white">Pesos ÷ {rates.copToVesRate.toString().replace('.', ',')}</span> = Recibes en Bolívares
            </p>
          </div>

          {/* Card 2: Bolívares a Pesos */}
          <div
            onClick={() => onSelectDirection('VES_TO_COP')}
            className={`cursor-pointer relative rounded-3xl p-6 transition-all duration-300 transform hover:scale-[1.02] text-center border-2 ${
              activeDirection === 'VES_TO_COP'
                ? 'bg-gradient-to-b from-[#8f0a0a] to-[#590404] border-white shadow-[0_0_25px_rgba(255,255,255,0.25)] ring-4 ring-red-400/30'
                : 'bg-black/30 border-white/30 hover:border-white/60'
            }`}
          >
            {activeDirection === 'VES_TO_COP' && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-red-950 font-black text-xs uppercase px-3 py-0.5 rounded-full shadow-md">
                Seleccionado
              </span>
            )}

            <div className="text-xs uppercase tracking-widest font-extrabold text-red-200 mb-1">
              🇻🇪 VENEZUELA ➔ 🇨🇴 COLOMBIA
            </div>
            <div className="text-xl sm:text-2xl font-black tracking-wider uppercase text-white mb-3">
              BOLÍVARES A PESOS
            </div>

            {/* The signature white pill rate container */}
            <div className="bg-white text-[#8B0000] rounded-full py-2.5 px-6 shadow-xl inline-block w-full max-w-xs mx-auto border-2 border-white/90">
              <span className="text-4xl sm:text-5xl font-black tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                {rates.vesToCopRate.toString().replace('.', ',')}
              </span>
            </div>

            <p className="mt-3 text-xs text-red-100/90 font-medium">
              Fórmula: <span className="font-bold text-white">Bolívares × {rates.vesToCopRate.toString().replace('.', ',')}</span> = Recibes en Pesos
            </p>
          </div>
        </div>

        {/* Quick action bar */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onOpenFlyerModal}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-full border border-white/30 backdrop-blur-sm transition-all shadow-md"
          >
            <ImageIcon className="w-4 h-4 text-amber-300" />
            <span>Ver Flyer Oficial del Día</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="flex items-center gap-2 bg-black/40 hover:bg-black/60 text-red-200 hover:text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-full border border-red-500/30 transition-all"
          >
            <span>Cambiar Tasas de Hoy</span>
          </button>
        </div>

        {/* Feature Pills */}
        <div className="mt-8 pt-6 border-t border-red-500/20 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold text-red-100">
          <div className="flex items-center justify-center gap-2 bg-black/20 py-2 px-3 rounded-xl border border-white/10">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Entrega en 5-15 min</span>
          </div>
          <div className="flex items-center justify-center gap-2 bg-black/20 py-2 px-3 rounded-xl border border-white/10">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Garantizado</span>
          </div>
          <div className="flex items-center justify-center gap-2 bg-black/20 py-2 px-3 rounded-xl border border-white/10">
            <TrendingUp className="w-4 h-4 text-sky-400" />
            <span>Mejor Tasa del Mercado</span>
          </div>
          <div className="flex items-center justify-center gap-2 bg-black/20 py-2 px-3 rounded-xl border border-white/10">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Pantallas Streaming</span>
          </div>
        </div>
      </div>
    </div>
  );
};
