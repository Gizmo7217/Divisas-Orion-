import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { ExchangeRates } from '../types';

interface FloatingWhatsAppProps {
  rates: ExchangeRates;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ rates }) => {
  const [showBubble, setShowBubble] = useState<boolean>(true);

  const handleClick = () => {
    const url = `https://wa.me/${rates.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
      'Hola Divisas Orion, deseo cotizar y realizar un giro.'
    )}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Pop-up speech bubble */}
      {showBubble && (
        <div className="mb-2 bg-white text-neutral-900 rounded-2xl shadow-2xl p-3 pr-8 border-2 border-emerald-500/30 text-xs max-w-xs relative animate-bounce">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowBubble(false);
            }}
            className="absolute top-2 right-2 text-neutral-400 hover:text-neutral-700 p-0.5 rounded-full"
            title="Cerrar"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="font-extrabold text-[#7B0606] flex items-center justify-between gap-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping"></span>
              <span>Divisas Orion En Línea</span>
            </span>
          </div>
          <div className="text-emerald-700 font-mono font-bold text-[11px] mt-0.5">
            {rates.whatsappUsername || '@divisasorion'}
          </div>
          <div className="text-neutral-600 mt-1 leading-tight">
            Consulta datos para transferir y cotiza en segundos.
          </div>
        </div>
      )}

      {/* Main button */}
      <button
        onClick={handleClick}
        className="group relative flex items-center justify-center w-14 h-14 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full shadow-2xl shadow-emerald-900/50 hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-110 active:scale-95"
        title="Contactar por WhatsApp"
      >
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-30"></span>
        <MessageCircle className="w-8 h-8 fill-white relative z-10" />
      </button>
    </div>
  );
};
