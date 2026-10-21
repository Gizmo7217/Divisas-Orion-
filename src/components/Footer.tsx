import React from 'react';
import { OrionLogo } from './OrionLogo';
import { ExchangeRates } from '../types';
import { MessageCircle, ShieldCheck, Heart, Clock, ArrowUp, Settings } from 'lucide-react';

interface FooterProps {
  rates: ExchangeRates;
  onOpenSettings: () => void;
  onOpenFlyerModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ rates, onOpenSettings, onOpenFlyerModal }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-b from-[#350202] via-[#200101] to-[#120000] border-t border-red-900/40 text-neutral-300 pt-12 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-neutral-800">
          {/* Brand & Slogan */}
          <div className="md:col-span-2 space-y-3">
            <OrionLogo size="lg" variant="light" />
            <p className="text-sm text-red-200 italic font-medium max-w-sm">
              "{rates.slogan}"
            </p>
            <p className="text-xs text-neutral-400 max-w-md leading-relaxed">
              Tu servicio confiable de giros y remesas directas entre Colombia y Venezuela.
              Tasas del día actualizadas, operaciones protegidas y atención personalizada
              por WhatsApp. Distribuidor autorizado de pantallas streaming para toda la familia.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Transacciones verificadas y seguras</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-red-400 mb-3">
              Servicios & Navegación
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#calculadora" className="hover:text-white transition-colors">
                  Calculadora Pesos a Bolívares
                </a>
              </li>
              <li>
                <a href="#cuadros" className="hover:text-white transition-colors">
                  Cuadros de Conversión
                </a>
              </li>
              <li>
                <a href="#pagos" className="hover:text-white transition-colors">
                  Medios de Pago (Nequi, Llave, Pago Móvil, Banesco)
                </a>
              </li>
              <li>
                <a href="#streaming" className="hover:text-white transition-colors">
                  Pantallas Streaming (Netflix, Disney, Spotify, etc.)
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenFlyerModal}
                  className="text-amber-300 hover:text-amber-200 transition-colors text-left"
                >
                  Ver Flyer Oficial del Día
                </button>
              </li>
            </ul>
          </div>

          {/* Business Hours & Contact */}
          <div>
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-red-400 mb-3">
              Atención & Contacto
            </h4>
            <div className="space-y-2 text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Lunes a Domingo: 8:00 AM - 10:00 PM</span>
              </div>
              <div className="flex items-center gap-2 text-white font-mono font-bold text-xs">
                <MessageCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>WhatsApp: +57 3135459314</span>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => {
                    const url = `https://wa.me/${rates.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      'Hola Divisas Orion, deseo consultar datos para transferir y hacer una operación.'
                    )}`;
                    window.open(url, '_blank');
                  }}
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold py-2.5 px-4 rounded-xl transition-all shadow flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Chatear al +57 3135459314</span>
                </button>
              </div>

              <div className="pt-3">
                <button
                  onClick={onOpenSettings}
                  className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Panel de Administrador de Tasas</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div>
            © {new Date().getFullYear()} <span className="text-white font-bold">Divisas Orion</span>. Todos los derechos reservados.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-neutral-300 hover:text-white transition-colors"
            >
              <span>Volver arriba</span>
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
