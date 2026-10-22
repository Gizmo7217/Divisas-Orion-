import React from 'react';
import { OrionLogo } from './OrionLogo';
import { ExchangeRates } from '../types';
import { launchProtectedWhatsApp } from '../utils/formatters';
import { MessageCircle, ShieldCheck, Heart, Clock, ArrowUp, Settings } from 'lucide-react';

interface FooterProps {
  rates: ExchangeRates;
  onOpenSettings: () => void;
  onOpenFlyerModal: () => void;
  onOpenWhatsApp?: (msg: string, title?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ rates, onOpenSettings, onOpenFlyerModal, onOpenWhatsApp }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-b from-[#350202] via-[#200101] to-[#120000] border-t border-red-900/40 text-neutral-300 pt-12 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-neutral-800">
          {/* Col 1: Brand & Slogan */}
          <div className="md:col-span-2 space-y-4">
            <OrionLogo size="lg" />
            <p className="text-sm text-neutral-400 max-w-md italic">
              "{rates.slogan}"
            </p>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-md">
              Plataforma líder y confiable de giros y remesas entre Colombia y Venezuela con tasas garantizadas del día, pagos inmediatos por Nequi, Llave, Pago Móvil y Banesco, además de pantallas streaming originales con soporte garantizado.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/80 border border-emerald-800/80 px-3 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" /> Operaciones 100% Seguras
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-semibold bg-amber-950/80 border border-amber-800/80 px-3 py-1 rounded-full">
                <Clock className="w-3.5 h-3.5" /> Entrega 5-15 min
              </span>
            </div>
          </div>

          {/* Col 2: Servicios */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-red-200 mb-4">
              Servicios Oficiales
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>• Giros Colombia a Venezuela (COP ➔ VES)</li>
              <li>• Giros Venezuela a Colombia (VES ➔ COP)</li>
              <li>• Compra y Venta USDT Binance (Pesos y Bolívares)</li>
              <li>• Suscripciones Apps IA (ChatGPT, Gemini, Figma, CapCut)</li>
              <li>• Cuentas Nequi, Llave, Pago Móvil & Banesco</li>
              <li>• Pantallas Netflix, Spotify, Disney+, Max, Prime</li>
              <li>• Asesoría directa por WhatsApp @divisasorion</li>
            </ul>
          </div>

          {/* Col 3: Contacto & Admin */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-red-200 mb-4">
              Atención al Cliente
            </h4>
            <div className="space-y-3">
              <div className="text-xs text-neutral-400">
                <span>Canal Oficial de WhatsApp:</span>
              </div>
              <div className="flex items-center gap-2 text-white font-mono font-bold text-xs">
                <MessageCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>WhatsApp: {rates.whatsappUsername || '@divisasorion'}</span>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const msg = `Hola Divisas Orion (${rates.whatsappUsername || '@divisasorion'}), deseo consultar datos para transferir y realizar una operación.`;
                    if (onOpenWhatsApp) {
                      onOpenWhatsApp(msg, 'Atención y Datos Divisas Orion');
                    } else {
                      launchProtectedWhatsApp({
                        phone: rates.whatsappNumber,
                        text: msg,
                        customLink: rates.whatsappLink,
                      });
                    }
                  }}
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold py-2.5 px-4 rounded-xl transition-all shadow flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Chatear con {rates.whatsappUsername || '@divisasorion'}</span>
                </button>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={onOpenSettings}
                  className="w-full flex items-center justify-center gap-1.5 text-[11px] font-semibold text-neutral-400 hover:text-white py-1.5 px-3 rounded-lg border border-neutral-800 hover:border-neutral-700 bg-neutral-900/60 transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Panel Administrador de Tasas</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            <span>© {new Date().getFullYear()} Divisas Orion. Todos los derechos reservados.</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenFlyerModal}
              className="hover:text-neutral-300 transition-colors"
            >
              Flyer Oficial
            </button>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <span>Subir al inicio</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
