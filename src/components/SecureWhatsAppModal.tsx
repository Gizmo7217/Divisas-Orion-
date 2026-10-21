import React, { useState } from 'react';
import { ExchangeRates } from '../types';
import { ShieldCheck, Lock, Copy, Check, MessageCircle, ExternalLink, X, Smartphone, Globe, Sparkles } from 'lucide-react';

interface SecureWhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  rates: ExchangeRates;
  messageText: string;
  title?: string;
}

export const SecureWhatsAppModal: React.FC<SecureWhatsAppModalProps> = ({
  isOpen,
  onClose,
  rates,
  messageText,
  title = 'Conexión Oficial Segura',
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const encodedText = encodeURIComponent(messageText);
  const officialShortlink = rates.whatsappLink?.trim() || 'https://wa.link/lreunw';
  const cleanShortlink = officialShortlink.replace(/^https?:\/\//, '');

  // Blinded URL: Uses https://wa.link/lreunw?text=... (100% blindado, cero teléfono en la URL)
  const finalLink = officialShortlink.includes('?')
    ? `${officialShortlink}&text=${encodedText}`
    : `${officialShortlink}?text=${encodedText}`;

  const handleOpenSecureLink = () => {
    window.open(finalLink, '_blank');
    onClose();
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-gradient-to-b from-neutral-900 via-neutral-950 to-black border-2 border-emerald-500/40 rounded-3xl shadow-2xl p-6 sm:p-7 text-white overflow-hidden my-8">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-all border border-neutral-700"
          title="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Security Shield Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500/40 text-emerald-400 mb-3 shadow-lg shadow-emerald-950/50">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-950 border border-emerald-700/60 text-emerald-300 text-[11px] font-black uppercase tracking-wider mb-1.5">
            <Lock className="w-3 h-3" />
            <span>Número Telefónico 100% Blindado</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {title}
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            Conexión encriptada directa con <span className="text-amber-300 font-bold font-mono">{rates.whatsappUsername || '@divisasorion'}</span>.
          </p>
        </div>

        {/* Masked Security Card */}
        <div className="bg-neutral-900/90 rounded-2xl p-4 border border-neutral-800 mb-5 space-y-2 text-xs">
          <div className="flex items-center justify-between py-1 border-b border-neutral-800/80">
            <span className="text-neutral-400">Canal Oficial:</span>
            <span className="font-bold text-emerald-400 font-mono text-sm">{rates.whatsappUsername || '@divisasorion'}</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-neutral-800/80">
            <span className="text-neutral-400">Enlace Blindado:</span>
            <span className="font-mono text-[11px] text-emerald-300 font-bold bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
              {cleanShortlink}
            </span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-neutral-400">Barra de Direcciones:</span>
            <span className="font-mono text-[11px] text-amber-300 bg-black/60 px-2 py-0.5 rounded flex items-center gap-1">
              <Lock className="w-3 h-3 text-amber-400" /> Sin número visible
            </span>
          </div>
        </div>

        {/* Message preview block */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Mensaje preparado para enviar:
            </span>
            <button
              onClick={handleCopyMessage}
              className="text-[11px] text-amber-300 hover:text-amber-200 flex items-center gap-1 font-semibold"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copiar texto</span>
                </>
              )}
            </button>
          </div>
          <div className="max-h-28 overflow-y-auto bg-black/60 p-3 rounded-xl border border-neutral-800 text-[11px] text-neutral-300 font-sans whitespace-pre-wrap leading-relaxed select-all">
            {messageText}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          {/* Primary Action: Direct Blinded Link */}
          <button
            onClick={handleOpenSecureLink}
            className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-black text-sm py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-950/60 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <MessageCircle className="w-5 h-5 fill-white" />
            <span>Continuar a WhatsApp ({cleanShortlink})</span>
          </button>
        </div>

        <p className="mt-4 text-[10px] text-center text-neutral-500 leading-tight">
          Blindaje de enlace oficial Divisas Orion. Tu número telefónico y la línea del operador no se exponen en URLs públicas.
        </p>
      </div>
    </div>
  );
};
