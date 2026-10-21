import React from 'react';
import { OrionLogo } from './OrionLogo';
import { MessageCircle, Settings, ArrowRightLeft, Sparkles } from 'lucide-react';
import { ExchangeRates } from '../types';

interface HeaderProps {
  rates: ExchangeRates;
  onOpenSettings: () => void;
  onOpenFlyerModal: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  rates,
  onOpenSettings,
  onOpenFlyerModal,
  activeSection,
  onNavigate,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-[#590404] via-[#7B0606] to-[#450202] border-b border-red-500/20 backdrop-blur-md shadow-xl text-white">
      {/* Top micro-bar with current rates highlight */}
      <div className="bg-[#3b0202] border-b border-red-900/40 text-xs py-1.5 px-4 text-center sm:text-left">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-red-200">
              Tasa del Día activa • {rates.lastUpdated}
            </span>
            <span className="hidden md:inline text-red-400">|</span>
            <span className="hidden md:inline italic text-red-200 font-light">
              "{rates.slogan}"
            </span>
          </div>

          <div className="flex items-center gap-3 mx-auto sm:mx-0">
            {/* Quick rate badges */}
            <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-0.5 rounded-full border border-red-500/30 text-amber-200 font-bold">
              <span>🇨🇴 ➔ 🇻🇪:</span>
              <span className="text-white bg-red-700/80 px-1.5 py-0.2 rounded text-[11px]">
                ÷ {rates.copToVesRate.toString().replace('.', ',')}
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-0.5 rounded-full border border-red-500/30 text-amber-200 font-bold">
              <span>🇻🇪 ➔ 🇨🇴:</span>
              <span className="text-white bg-red-700/80 px-1.5 py-0.2 rounded text-[11px]">
                × {rates.vesToCopRate.toString().replace('.', ',')}
              </span>
            </div>

            <button
              onClick={onOpenSettings}
              title="Ajustar tasas del día"
              className="text-red-200 hover:text-white hover:bg-white/10 p-1 rounded-full transition-colors flex items-center gap-1 text-[11px]"
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Editar Tasas</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => onNavigate('calculadora')}
          className="cursor-pointer group flex items-center gap-3"
        >
          <OrionLogo size="md" variant="light" />
        </div>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-sm font-medium">
          <button
            onClick={() => onNavigate('calculadora')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSection === 'calculadora'
                ? 'bg-white/15 text-white font-bold shadow-sm'
                : 'text-red-100/90 hover:text-white hover:bg-white/10'
            }`}
          >
            Calculadora
          </button>
          <button
            onClick={() => onNavigate('cuadros')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSection === 'cuadros'
                ? 'bg-white/15 text-white font-bold shadow-sm'
                : 'text-red-100/90 hover:text-white hover:bg-white/10'
            }`}
          >
            Cuadros de Tasa
          </button>
          <button
            onClick={() => onNavigate('pagos')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSection === 'pagos'
                ? 'bg-white/15 text-white font-bold shadow-sm'
                : 'text-red-100/90 hover:text-white hover:bg-white/10'
            }`}
          >
            Medios de Pago
          </button>
          <button
            onClick={() => onNavigate('streaming')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeSection === 'streaming'
                ? 'bg-white/15 text-white font-bold shadow-sm'
                : 'text-red-100/90 hover:text-white hover:bg-white/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            Pantallas Streaming
          </button>
          <button
            onClick={onOpenFlyerModal}
            className="px-3 py-1.5 rounded-lg text-amber-200 hover:text-amber-100 hover:bg-amber-400/20 font-semibold transition-all border border-amber-400/30"
          >
            Flyer Oficial
          </button>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const url = `https://wa.me/${rates.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                'Hola Divisas Orion, deseo consultar la tasa y hacer un giro.'
              )}`;
              window.open(url, '_blank');
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-bold text-xs sm:text-sm px-3.5 py-2 rounded-xl shadow-lg shadow-emerald-950/40 hover:shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span className="hidden sm:inline">WhatsApp Directo</span>
            <span className="sm:hidden">WhatsApp</span>
          </button>
        </div>
      </div>
    </header>
  );
};
