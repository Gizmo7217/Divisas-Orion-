import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Clock } from 'lucide-react';
import { ExchangeRates } from '../types';
import { launchProtectedWhatsApp, isBusinessOpenColombia } from '../utils/formatters';

interface FloatingWhatsAppProps {
  rates: ExchangeRates;
  onOpenWhatsApp?: (msg: string, title?: string) => void;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ rates, onOpenWhatsApp }) => {
  const [showBubble, setShowBubble] = useState<boolean>(true);
  const [isBusinessOpen, setIsBusinessOpen] = useState<boolean>(() => isBusinessOpenColombia());

  // Check business hours every 30 seconds to react in real-time
  useEffect(() => {
    const checkSchedule = () => {
      setIsBusinessOpen(isBusinessOpenColombia());
    };
    checkSchedule();
    const interval = setInterval(checkSchedule, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    const msg = isBusinessOpen
      ? `Hola Divisas Orion (${rates.whatsappUsername || '@divisasorion'}), deseo cotizar y realizar un giro o consulta.`
      : `Hola Divisas Orion (${rates.whatsappUsername || '@divisasorion'}), me comunico fuera del horario de atención. Deseo dejar mi consulta para ser atendido en el horario de 8:00 am a 10:00 pm.`;

    if (onOpenWhatsApp) {
      onOpenWhatsApp(msg, isBusinessOpen ? 'Atención En Línea Divisas Orion' : 'Mensaje Fuera de Horario');
    } else {
      launchProtectedWhatsApp({
        phone: rates.whatsappNumber,
        text: msg,
        customLink: rates.whatsappLink || 'https://wa.link/lreunw',
      });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Pop-up speech bubble */}
      {showBubble && (
        <div
          className={`mb-2 bg-white text-neutral-900 rounded-2xl shadow-2xl p-3.5 pr-8 border-2 text-xs max-w-[270px] sm:max-w-xs relative animate-bounce transition-all ${
            isBusinessOpen
              ? 'border-emerald-500/40 shadow-emerald-950/15'
              : 'border-red-500/50 shadow-red-950/20'
          }`}
        >
          {/* Close button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowBubble(false);
            }}
            className="absolute top-2.5 right-2.5 text-neutral-400 hover:text-neutral-700 p-0.5 rounded-full transition-colors"
            title="Cerrar notificación"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {isBusinessOpen ? (
            /* Open state (8:00 AM to 10:00 PM) */
            <>
              <div className="font-extrabold text-[#7B0606] flex items-center justify-between gap-1">
                <span className="flex items-center gap-1.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span>Divisas Orion En Línea</span>
                </span>
              </div>
              <div className="text-emerald-700 font-mono font-bold text-[11px] mt-0.5">
                {rates.whatsappUsername || '@divisasorion'}
              </div>
              <div className="text-neutral-600 mt-1 leading-tight text-xs">
                Consulta datos para transferir y cotiza en segundos.
              </div>
            </>
          ) : (
            /* Closed state (10:01 PM to 7:59 AM) */
            <>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
                </span>
                <span className="font-black text-red-600 text-sm tracking-wide">
                  Cerrado
                </span>
              </div>
              <div className="text-red-700/90 font-mono font-bold text-[11px] mt-0.5">
                {rates.whatsappUsername || '@divisasorion'}
              </div>
              <div className="text-neutral-700 text-[11px] mt-1.5 leading-snug">
                <p className="font-bold text-neutral-900">
                  En estos momentos nos encontramos fuera de línea.
                </p>
                <p className="text-[10px] text-neutral-500 mt-1 font-semibold flex items-center gap-1">
                  <Clock className="w-3 h-3 text-red-500 flex-shrink-0" />
                  <span>Horario de apertura 8:00 am a 10:00 pm de lunes a Domingo</span>
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Main floating action button */}
      <button
        onClick={handleClick}
        className={`group relative flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 ${
          isBusinessOpen
            ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-900/50 hover:shadow-emerald-500/50'
            : 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/50 hover:shadow-red-500/50'
        }`}
        title={
          isBusinessOpen
            ? 'Contactar por WhatsApp (@divisasorion)'
            : 'Fuera de línea • Horario 8:00 am a 10:00 pm'
        }
      >
        {/* Parpadeo continuo en verde si está abierto, en rojo si está cerrado */}
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-40 ${
            isBusinessOpen ? 'bg-emerald-400' : 'bg-red-500'
          }`}
        ></span>
        <MessageCircle className="w-8 h-8 fill-white relative z-10" />
      </button>
    </div>
  );
};
