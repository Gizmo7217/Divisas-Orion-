import React, { useState } from 'react';
import { ExchangeRates } from '../types';
import { OrionLogo } from './OrionLogo';
import { formatNumberWithDots } from '../utils/formatters';
import { X, Copy, Check, Share2, Sparkles, Image as ImageIcon } from 'lucide-react';

interface FlyerModalProps {
  rates: ExchangeRates;
  isOpen: boolean;
  onClose: () => void;
}

export const FlyerModal: React.FC<FlyerModalProps> = ({ rates, isOpen, onClose }) => {
  const [viewMode, setViewMode] = useState<'replica' | 'original'>('replica');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const amounts = [50000, 100000, 200000, 500000, 1000000];

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
        <div className="flex items-center justify-between mb-4 pr-10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-base font-black text-white">Flyer Oficial Divisas Orion</h3>
          </div>

          <div className="inline-flex p-1 rounded-xl bg-neutral-800 border border-neutral-700 text-xs">
            <button
              onClick={() => setViewMode('replica')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                viewMode === 'replica' ? 'bg-[#7B0606] text-white shadow' : 'text-neutral-400'
              }`}
            >
              En Vivo (Actualizado)
            </button>
            <button
              onClick={() => setViewMode('original')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                viewMode === 'original' ? 'bg-[#7B0606] text-white shadow' : 'text-neutral-400'
              }`}
            >
              Foto Original
            </button>
          </div>
        </div>

        {viewMode === 'original' ? (
          /* Original image provided by the user */
          <div className="rounded-2xl overflow-hidden border-2 border-neutral-800 shadow-xl bg-black">
            <img
              src="/assets/aistudio/file_00000000533481f5a32673b880a4df63_f6065bf0.png"
              alt="Flyer Original Divisas Orion"
              className="w-full h-auto object-contain max-h-[580px] mx-auto"
            />
          </div>
        ) : (
          /* Pixel-faithful dynamic replica that updates when user changes rates */
          <div className="relative rounded-2xl overflow-hidden border-2 border-red-500 shadow-2xl bg-gradient-to-b from-[#6e0505] via-[#850808] to-[#420101] p-6 text-center select-none">
            {/* Watermark patterns */}
            <div className="absolute inset-0 opacity-10 pointer-events-none flex flex-wrap gap-8 justify-center items-center text-white">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="text-5xl font-black rotate-12 opacity-40">
                  $
                </div>
              ))}
            </div>

            {/* Flyer Top Header: TASA DEL DÍA & Logo */}
            <div className="relative flex items-center justify-between mb-2">
              <div className="text-left">
                <span
                  className="text-3xl sm:text-4xl font-black italic uppercase tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  TASA DEL DÍA
                </span>
              </div>

              {/* Logo in flyer */}
              <div className="flex-shrink-0">
                <OrionLogo size="sm" variant="light" />
              </div>
            </div>

            {/* Big White Capsule Rate */}
            <div className="relative my-3">
              <div className="bg-white text-[#8B0000] rounded-full py-2.5 px-8 shadow-2xl inline-block w-4/5 mx-auto border-2 border-white/90">
                <span
                  className="text-4xl sm:text-5xl font-black tracking-tight"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {rates.copToVesRate.toString().replace('.', ',')}
                </span>
              </div>
            </div>

            {/* Subheading: PESOS BOLÍVARES */}
            <div
              className="relative text-2xl sm:text-3xl font-black uppercase tracking-wider text-white mb-4 drop-shadow-md"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              PESOS BOLÍVARES
            </div>

            {/* The 5 Pill Capsules matching the photo exactly */}
            <div className="relative space-y-2.5 max-w-sm mx-auto">
              {amounts.map((cop) => {
                const ves = Math.round(cop / rates.copToVesRate);
                return (
                  <div
                    key={cop}
                    className="rounded-full border-2 border-white/90 bg-transparent py-2.5 px-5 flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span
                      className="text-lg sm:text-xl font-black italic tracking-wide text-white"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      {formatNumberWithDots(cop, 0)}
                    </span>
                    <span className="text-lg font-bold text-white/80">/</span>
                    <span
                      className="text-lg sm:text-xl font-black italic tracking-wide text-white"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      {formatNumberWithDots(ves, 0)} Bs
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Slogan at bottom */}
            <div className="relative mt-5 pt-3">
              <p
                className="text-sm sm:text-base font-bold text-white tracking-wide italic"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                "{rates.slogan}"
              </p>
            </div>
          </div>
        )}

        {/* Modal Footer Actions */}
        <div className="mt-5 flex items-center justify-between gap-3 pt-3 border-t border-neutral-800">
          <button
            onClick={handleCopyText}
            className="flex-1 bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 text-white font-bold text-xs py-2.5 px-4 rounded-xl border border-red-500/30 transition-all flex items-center justify-center gap-2 shadow-md"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>¡Texto copiado para WhatsApp!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copiar texto del Flyer para Estado</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-bold transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
