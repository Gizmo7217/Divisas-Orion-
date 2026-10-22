import React, { useState } from 'react';
import { ExchangeRates } from '../types';
import { formatNumberWithDots } from '../utils/formatters';
import { X, Copy, Check, Download, Share2, Sparkles, AlertCircle } from 'lucide-react';

interface FlyerModalProps {
  rates: ExchangeRates;
  isOpen: boolean;
  onClose: () => void;
}

export const FlyerModal: React.FC<FlyerModalProps> = ({ rates, isOpen, onClose }) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const amounts = [50000, 100000, 200000, 500000, 1000000, 1500000, 2000000];

  const handleCopyText = () => {
    let text = `📢 *TASA DEL DÍA - DIVISAS ORION* 📢\n✨ *${rates.copToVesRate.toString().replace('.', ',')}*\n\n🇨🇴 *PESOS* ➔ 🇻🇪 *BOLÍVARES*\n\n`;
    amounts.forEach((cop) => {
      const ves = Math.round(cop / rates.copToVesRate);
      text += `👉 *${formatNumberWithDots(cop, 0)}* / *${formatNumberWithDots(ves, 0)} Bs*\n`;
    });
    text += `\n💬 _"${rates.slogan}"_\n\n✅ Pagos por Nequi, Llave, Pago Móvil y Banesco.\n🍿 Pantallas streaming disponibles (Netflix, Spotify, Disney, etc.)\n📲 Escríbenos a WhatsApp ${rates.whatsappUsername || '@divisasorion'} (${rates.whatsappLink || 'https://wa.link/lreunw'}) para transferir!`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-neutral-900 border-2 border-red-500/40 rounded-3xl shadow-2xl p-6 overflow-hidden my-8 text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black/90 text-neutral-300 hover:text-white transition-all border border-white/20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Controls */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-800">
          <div>
            <span className="text-xs font-bold text-red-300 uppercase tracking-wider block">
              Flyer Oficial del Día
            </span>
            <span className="text-base font-black text-white">
              {rates.lastUpdated}
            </span>
          </div>

          <button
            onClick={handleCopyText}
            className="flex items-center gap-1.5 text-xs font-bold bg-amber-400 hover:bg-amber-300 text-neutral-950 px-3 py-1.5 rounded-xl transition-all shadow"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-neutral-950" />
                <span>¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Texto</span>
              </>
            )}
          </button>
        </div>

        {/* Flyer Canvas Preview */}
        <div className="relative rounded-2xl overflow-hidden border-2 border-amber-400/50 shadow-2xl bg-gradient-to-b from-[#690505] via-[#7B0606] to-[#450202] p-6 text-center text-white">
          {/* Watermark Pattern */}
          <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden select-none">
            <div className="grid grid-cols-4 gap-6 transform rotate-12 scale-150">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="font-black text-white text-3xl">
                  $
                </div>
              ))}
            </div>
          </div>

          {/* Flyer Header */}
          <div className="relative">
            <h2
              className="text-4xl sm:text-5xl font-black italic tracking-tighter uppercase drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              TASA DEL DÍA
            </h2>

            <div className="mt-2 inline-block">
              <span
                className="text-6xl sm:text-7xl font-black text-amber-300 tracking-tighter drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                {rates.copToVesRate.toString().replace('.', ',')}
              </span>
            </div>

            <p className="text-xs text-red-100 italic mt-1 font-medium">
              "{rates.slogan}"
            </p>
          </div>

          {/* Flyer Conversion Pill Capsules */}
          <div className="relative mt-6 space-y-2.5 max-w-sm mx-auto">
            {amounts.map((cop) => {
              const ves = Math.round(cop / rates.copToVesRate);

              return (
                <div
                  key={cop}
                  className="bg-black/60 backdrop-blur-sm border-2 border-amber-400/40 rounded-full py-2 px-5 flex items-center justify-between text-sm sm:text-base font-black shadow-lg"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  <span className="text-white tracking-wide">
                    {formatNumberWithDots(cop, 0)}
                  </span>
                  <span className="text-amber-300">/</span>
                  <span className="text-amber-300 tracking-wide font-mono">
                    {formatNumberWithDots(ves, 0)} Bs
                  </span>
                </div>
              );
            })}
          </div>

          {/* Flyer Footer Details */}
          <div className="relative mt-6 pt-4 border-t border-red-500/30 text-xs space-y-2">
            <div className="flex items-center justify-center gap-2 text-amber-200 font-bold">
              <span>Nequi</span>
              <span>•</span>
              <span>Llave</span>
              <span>•</span>
              <span>Pago Móvil</span>
              <span>•</span>
              <span>Banesco</span>
            </div>

            <div className="text-[11px] text-red-200">
              Canal Oficial: <span className="text-white font-bold">{rates.whatsappUsername || '@divisasorion'}</span>
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs text-center text-neutral-400">
          Usa el botón de arriba para copiar el texto formateado y compartirlo en tus estados o grupos de WhatsApp.
        </p>
      </div>
    </div>
  );
};
