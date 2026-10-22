import React from 'react';
import { OrionLogo } from './OrionLogo';
import { ExchangeRates } from '../types';
import { MessageCircle, Settings, FileText, ArrowRight } from 'lucide-react';

interface HeaderProps {
  rates: ExchangeRates;
  onOpenSettings?: () => void;
  onOpenFlyerModal: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenWhatsApp?: (msg: string, title?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  rates,
  onOpenFlyerModal,
  activeSection,
  onNavigate,
  onOpenWhatsApp,
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
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => onNavigate('inicio')}
          className="cursor-pointer transition-transform hover:scale-[1.02]"
        >
          <OrionLogo size="md" />
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-red-100">
          <button
            onClick={() => onNavigate('calculadora')}
            className={`transition-colors hover:text-white ${
              activeSection === 'calculadora' ? 'text-amber-300 font-bold' : ''
            }`}
          >
            Calculadora
          </button>
          <button
            onClick={() => onNavigate('cuadros')}
            className={`transition-colors hover:text-white ${
              activeSection === 'cuadros' ? 'text-amber-300 font-bold' : ''
            }`}
          >
            Cuadros Rápidos
          </button>
          <button
            onClick={() => onNavigate('pagos')}
            className={`transition-colors hover:text-white ${
              activeSection === 'pagos' ? 'text-amber-300 font-bold' : ''
            }`}
          >
            Medios de Pago
          </button>
          <button
            onClick={() => onNavigate('usdt')}
            className={`transition-colors hover:text-white flex items-center gap-1 ${
              activeSection === 'usdt' ? 'text-amber-300 font-bold' : ''
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span>USDT Binance</span>
          </button>
          <button
            onClick={() => onNavigate('streaming')}
            className={`transition-colors hover:text-white ${
              activeSection === 'streaming' ? 'text-amber-300 font-bold' : ''
            }`}
          >
            Streaming & IA
          </button>
          <button
            onClick={() => onNavigate('testimonios')}
            className={`transition-colors hover:text-white ${
              activeSection === 'testimonios' ? 'text-amber-300 font-bold' : ''
            }`}
          >
            Clientes
          </button>
          <button
            onClick={() => onNavigate('como-funciona')}
            className={`transition-colors hover:text-white ${
              activeSection === 'como-funciona' ? 'text-amber-300 font-bold' : ''
            }`}
          >
            Cómo Funciona
          </button>
          <button
            onClick={onOpenFlyerModal}
            className="flex items-center gap-1.5 bg-red-900/40 hover:bg-red-900/80 text-amber-300 border border-red-500/30 px-3 py-1.5 rounded-xl transition-all"
          >
            Flyer Oficial
          </button>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const msg = `Hola Divisas Orion (${rates.whatsappUsername || '@divisasorion'}), deseo consultar la tasa del día y realizar una operación.`;
              if (onOpenWhatsApp) {
                onOpenWhatsApp(msg, 'Atención Oficial Divisas Orion');
              } else {
                const link = rates.whatsappLink || 'https://wa.link/lreunw';
                window.open(`${link}?text=${encodeURIComponent(msg)}`, '_blank');
              }
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-bold text-xs sm:text-sm px-3.5 py-2 rounded-xl shadow-lg shadow-emerald-950/40 hover:shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span className="hidden sm:inline">WhatsApp: {rates.whatsappUsername || '@divisasorion'}</span>
            <span className="sm:hidden">{rates.whatsappUsername || '@divisasorion'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
