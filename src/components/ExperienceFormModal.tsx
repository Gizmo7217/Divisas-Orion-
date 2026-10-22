import React, { useState, useEffect } from 'react';
import { Star, X, CheckCircle2, MessageCircle, Heart, MapPin, Send, Sparkles, Copy, Check, Link as LinkIcon } from 'lucide-react';
import { ClientReview, ExchangeRates } from '../types';
import { launchProtectedWhatsApp } from '../utils/formatters';

interface ExperienceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReview: (review: ClientReview, sendToWhatsApp: boolean) => void;
  rates: ExchangeRates;
}

export const ExperienceFormModal: React.FC<ExperienceFormModalProps> = ({
  isOpen,
  onClose,
  onSubmitReview,
  rates,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [name, setName] = useState<string>('');
  const [country, setCountry] = useState<'Colombia' | 'Venezuela'>('Colombia');
  const [originCity, setOriginCity] = useState<string>('');
  const [destinationCity, setDestinationCity] = useState<string>('');
  const [operationType, setOperationType] = useState<string>('Remesa Familiar COP ➔ VES');
  const [comment, setComment] = useState<string>('');
  const [sendToWhatsApp, setSendToWhatsApp] = useState<boolean>(true);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const ratingDescriptions: Record<number, string> = {
    5: 'Excelente - Servicio impecable ⭐⭐⭐⭐⭐',
    4: 'Muy Bueno - Rápido y confiable ⭐⭐⭐⭐',
    3: 'Bueno - Cumplió con lo acordado ⭐⭐⭐',
    2: 'Regular - Podría mejorar ⭐⭐',
    1: 'Malo - No satisfecho ⭐',
  };

  const avatarGradients = [
    'from-amber-500 to-red-600',
    'from-emerald-500 to-teal-700',
    'from-blue-600 to-indigo-800',
    'from-purple-600 to-pink-700',
    'from-rose-500 to-red-800',
    'from-orange-500 to-amber-700',
    'from-cyan-600 to-blue-800',
  ];

  const handleCopyDirectLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const url = `${window.location.origin}${window.location.pathname}#calificar`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (_) {
      // Fallback
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      alert('Por favor completa al menos tu nombre y tu comentario sobre el servicio.');
      return;
    }

    const randomColor = avatarGradients[Math.floor(Math.random() * avatarGradients.length)];
    const countryFlag = country === 'Colombia' ? '🇨🇴' : '🇻🇪';
    const finalOrigin = originCity.trim() ? `${originCity.trim()}, ${country}` : country;
    const finalDestination = destinationCity.trim()
      ? destinationCity.trim()
      : country === 'Colombia'
      ? 'Caracas, Venezuela'
      : 'Bogotá, Colombia';

    const newReview: ClientReview = {
      id: `client-${Date.now()}`,
      name: name.trim(),
      country,
      countryFlag,
      originCity: finalOrigin,
      destinationCity: finalDestination,
      operationType,
      comment: comment.trim(),
      rating,
      timeAgo: 'Hace un momento',
      verified: true,
      avatarColor: randomColor,
    };

    onSubmitReview(newReview, sendToWhatsApp);

    if (sendToWhatsApp) {
      const msg = `⭐ *NUEVO TESTIMONIO DE CLIENTE - DIVISAS ORION* ⭐

👤 *Nombre:* ${name.trim()}
🌟 *Calificación:* ${rating} / 5 Estrellas
📍 *Ruta:* ${finalOrigin} ➔ ${finalDestination}
🏷️ *Servicio Adquirido:* ${operationType}
💬 *Experiencia:* "${comment.trim()}"

_Enviado desde el formulario oficial en línea @divisasorion_`;

      launchProtectedWhatsApp({
        phone: rates.whatsappNumber,
        text: msg,
        customLink: rates.whatsappLink || 'https://wa.link/lreunw',
      });
    }

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2200);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden my-auto text-neutral-900 border-2 border-neutral-200 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Sticky Top Bar with Title and Close Button */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-neutral-100 px-5 sm:px-6 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
            <span className="font-extrabold text-xs uppercase tracking-wider text-neutral-700">
              Formulario de Opinión en Línea
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 text-xs font-bold text-neutral-600 hover:text-neutral-950 bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-full transition-colors"
            title="Cerrar ventana"
          >
            <X className="w-4 h-4 text-neutral-700" />
            <span>Cerrar</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1">
          {isSuccess ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <h3 className="text-2xl font-black text-neutral-900">
                ¡Gracias por tu Experiencia!
              </h3>
              <p className="text-sm text-neutral-600 max-w-sm mx-auto">
                Tu testimonio ha quedado registrado en línea y visible para toda la comunidad de Colombia y Venezuela.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-neutral-900 hover:bg-black text-white font-bold text-xs py-2.5 px-6 rounded-xl transition-all"
                >
                  Cerrar Ventana
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Header inside body */}
              <div className="text-center mb-5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold uppercase tracking-wider mb-2">
                  <Heart className="w-3.5 h-3.5 text-red-600 fill-red-600" />
                  <span>Tu Opinión Importa</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
                  Califica a Divisas Orion
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                  Cuéntale a la comunidad sobre la atención, rapidez y la tasa de cambio.
                </p>

                {/* Direct Link Banner */}
                <div className="mt-3 bg-amber-50 border border-amber-200/80 rounded-2xl p-2.5 flex items-center justify-between gap-2 text-left">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-amber-200/60 text-amber-900 flex items-center justify-center flex-shrink-0">
                      <LinkIcon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] font-bold text-neutral-900 block truncate">
                        Enlace directo a este formulario en la web:
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono block truncate">
                        {typeof window !== 'undefined' ? `${window.location.origin}/#calificar` : '.../#calificar'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyDirectLink}
                    className={`whitespace-nowrap flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-black transition-all ${
                      copiedLink
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-400 hover:bg-amber-500 text-neutral-950 shadow-sm'
                    }`}
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Rating with Stars */}
                <div className="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-200 text-center">
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                    ¿Cómo calificas el servicio recibido?
                  </label>
                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const activeRating = hoverRating !== null ? hoverRating : rating;
                      const isFilled = star <= activeRating;

                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(null)}
                          className="p-1 transition-transform hover:scale-125 focus:outline-none"
                        >
                          <Star
                            className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                              isFilled
                                ? 'fill-amber-400 text-amber-400 drop-shadow-[0_2px_4px_rgba(251,191,36,0.5)]'
                                : 'text-neutral-300'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <div className="text-xs font-bold text-amber-600 mt-1.5">
                    {ratingDescriptions[hoverRating !== null ? hoverRating : rating]}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Tu Nombre o Alias: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Andrea Colmenares o Carlos M."
                    className="w-full bg-neutral-50 border border-neutral-300 focus:border-red-600 focus:bg-white rounded-xl py-2.5 px-3.5 text-sm font-semibold text-neutral-900 outline-none transition-all"
                  />
                </div>

                {/* Country & Origin City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                      País de Origen:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setCountry('Colombia')}
                        className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                          country === 'Colombia'
                            ? 'border-[#7B0606] bg-red-50 text-[#7B0606] shadow-sm'
                            : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                        }`}
                      >
                        <span>🇨🇴</span>
                        <span>Colombia</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCountry('Venezuela')}
                        className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                          country === 'Venezuela'
                            ? 'border-[#7B0606] bg-red-50 text-[#7B0606] shadow-sm'
                            : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                        }`}
                      >
                        <span>🇻🇪</span>
                        <span>Venezuela</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                      Ciudad de Origen:
                    </label>
                    <input
                      type="text"
                      value={originCity}
                      onChange={(e) => setOriginCity(e.target.value)}
                      placeholder={country === 'Colombia' ? 'Ej. Bogotá, Medellín, Cali' : 'Ej. Caracas, Valencia, Maracaibo'}
                      className="w-full bg-neutral-50 border border-neutral-300 focus:border-red-600 focus:bg-white rounded-xl py-2 px-3 text-xs sm:text-sm font-semibold text-neutral-900 outline-none"
                    />
                  </div>
                </div>

                {/* Destination City */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Ciudad o Lugar de Destino:
                  </label>
                  <input
                    type="text"
                    value={destinationCity}
                    onChange={(e) => setDestinationCity(e.target.value)}
                    placeholder={country === 'Colombia' ? 'Ej. Caracas, Maracaibo, San Cristóbal' : 'Ej. Bogotá, Cúcuta, Nequi Colombia'}
                    className="w-full bg-neutral-50 border border-neutral-300 focus:border-red-600 focus:bg-white rounded-xl py-2 px-3 text-xs sm:text-sm font-semibold text-neutral-900 outline-none"
                  />
                </div>

                {/* Service Adquired */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Servicio Adquirido:
                  </label>
                  <select
                    value={operationType}
                    onChange={(e) => setOperationType(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 focus:border-red-600 focus:bg-white rounded-xl py-2 px-3 text-xs sm:text-sm font-bold text-neutral-900 outline-none cursor-pointer"
                  >
                    <option value="Remesa Familiar COP ➔ VES">🇨🇴 ➔ 🇻🇪 Remesa Familiar (Pesos a Bolívares)</option>
                    <option value="Giro VES ➔ COP (Nequi / Llave)">🇻🇪 ➔ 🇨🇴 Giro a Colombia (Bolívares a Pesos Nequi)</option>
                    <option value="Compra USDT Binance con Pesos">🪙 Compra USDT Binance con Pesos (COP)</option>
                    <option value="Venta USDT por Pago Móvil">🪙 Venta USDT por Pago Móvil (VES)</option>
                    <option value="Suscripción App IA (ChatGPT, Gemini, etc.)">🤖 Suscripción App IA (ChatGPT, Gemini, CapCut, etc.)</option>
                    <option value="Pantalla Streaming (Netflix, Disney, Spotify)">🍿 Pantalla Streaming (Netflix, Disney+, Max, etc.)</option>
                    <option value="Operación de Cambio Especial">🤝 Otra Operación / Consulta</option>
                  </select>
                </div>

                {/* Experience Textarea */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Tu Testimonio / Experiencia: <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Ej. Me enviaron el Pago Móvil en menos de 10 minutos con una excelente tasa. La atención por WhatsApp fue muy amable y segura..."
                    className="w-full bg-neutral-50 border border-neutral-300 focus:border-red-600 focus:bg-white rounded-xl p-3 text-xs sm:text-sm font-normal text-neutral-900 outline-none transition-all"
                  />
                </div>

                {/* WhatsApp copy checkbox */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="whatsappCheck"
                    checked={sendToWhatsApp}
                    onChange={(e) => setSendToWhatsApp(e.target.checked)}
                    className="w-4 h-4 text-red-600 rounded border-neutral-300 focus:ring-red-500 cursor-pointer"
                  />
                  <label htmlFor="whatsappCheck" className="text-xs text-neutral-600 cursor-pointer font-medium">
                    Enviar copia de mi testimonio al WhatsApp oficial de <strong className="text-neutral-900">@divisasorion</strong>
                  </label>
                </div>

                {/* Buttons Area: Submit + Dedicated Close Button */}
                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-red-600 to-[#7B0606] hover:from-red-500 hover:to-red-700 text-white font-black text-sm py-3.5 px-6 rounded-xl shadow-lg shadow-red-900/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <Send className="w-4 h-4" />
                    <span>Publicar Mi Experiencia</span>
                  </button>

                  {/* Prominent Bottom Close Button requested by user */}
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4 text-neutral-500" />
                    <span>Cerrar Ventana</span>
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
