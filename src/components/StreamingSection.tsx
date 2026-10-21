import React, { useState } from 'react';
import { STREAMING_PRODUCTS } from '../data/initialData';
import { ExchangeRates, StreamingProduct } from '../types';
import { formatCOP, formatNumberWithDots, getStreamingMessageText, launchProtectedWhatsApp } from '../utils/formatters';
import { Tv, Sparkles, Check, MessageCircle, ShieldCheck, Flame, ArrowDown } from 'lucide-react';

interface StreamingSectionProps {
  rates: ExchangeRates;
  onOpenWhatsApp?: (msg: string, title?: string) => void;
}

export const StreamingSection: React.FC<StreamingSectionProps> = ({ rates, onOpenWhatsApp }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const categories = [
    'Todos',
    'Películas & Series',
    'Música',
    'Anime',
    'Diseño & Productividad',
    'Video & Entretenimiento',
  ];

  const filteredProducts =
    selectedCategory === 'Todos'
      ? STREAMING_PRODUCTS
      : STREAMING_PRODUCTS.filter((p) => p.category === selectedCategory);

  const handleOrder = (product: StreamingProduct) => {
    const vesPrice = product.priceCOP / rates.copToVesRate;
    const text = getStreamingMessageText({
      productName: product.name,
      priceCOP: product.priceCOP,
      priceVES: vesPrice,
    });

    if (onOpenWhatsApp) {
      onOpenWhatsApp(text, `Pedido: ${product.name}`);
    } else {
      launchProtectedWhatsApp({
        phone: rates.whatsappNumber,
        text,
        customLink: rates.whatsappLink,
      });
    }
  };

  return (
    <section id="streaming" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-100 text-red-900 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-red-700" />
          <span>Servicio Oficial de Streaming</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight">
          Pantallas y Perfiles Streaming
        </h2>
        <p className="mt-2 text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto">
          Precios oficiales en Pesos Colombianos y abajo en Bolívares en números enteros calculados con la tasa del día (<span className="font-bold text-red-800">÷ {rates.copToVesRate.toString().replace('.', ',')}</span>). Entrega inmediata y garantía completa de 30 días.
        </p>

        {/* Category Pills */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#7B0606] text-white shadow-md'
                  : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of the 8 streaming services */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          // Calculate integer Bolivares applying the current rate
          const vesIntegerPrice = Math.round(product.priceCOP / rates.copToVesRate);

          return (
            <div
              key={product.id}
              className="group bg-neutral-900 rounded-3xl border-2 border-neutral-800 hover:border-red-600/50 p-5 text-white shadow-xl flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden"
            >
              {/* Card top banner accent */}
              <div
                className={`absolute top-0 inset-x-0 h-2 bg-gradient-to-r ${product.color}`}
              ></div>

              <div>
                {/* Popular Badge */}
                {product.popular && (
                  <div className="flex justify-end mb-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-red-600 text-white px-2.5 py-0.5 rounded-full shadow-sm">
                      <Flame className="w-3 h-3 fill-white" />
                      {product.badge || 'Popular'}
                    </span>
                  </div>
                )}
                {!product.popular && product.badge && (
                  <div className="flex justify-end mb-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-neutral-800 text-neutral-300 border border-neutral-700 px-2 py-0.5 rounded-full">
                      {product.badge}
                    </span>
                  </div>
                )}

                {/* Service Name & Tagline */}
                <div className="mb-3">
                  <h3 className="text-xl font-black text-white group-hover:text-red-200 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                    {product.tagline}
                  </p>
                </div>

                {/* Dedicated Price Container: COP on top, Integer Bolivares below */}
                <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 mb-4 text-center">
                  <span className="text-[10px] text-neutral-400 uppercase font-extrabold tracking-wider block">
                    🇨🇴 Precio en Pesos
                  </span>
                  <div
                    className="text-2xl sm:text-3xl font-black text-amber-300 mt-0.5 tracking-tight"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    {formatCOP(product.priceCOP)}
                  </div>

                  {/* Below: Price in Bolívares in WHOLE NUMBERS (enteros) */}
                  <div className="mt-2.5 pt-2 border-t border-neutral-800 flex flex-col items-center justify-center">
                    <span className="text-[10px] text-red-300 uppercase font-black tracking-wider flex items-center gap-1">
                      <span>🇻🇪 En Bolívares (Tasa {rates.copToVesRate.toString().replace('.', ',')}):</span>
                    </span>
                    <div
                      className="text-xl sm:text-2xl font-black text-white mt-0.5 tracking-tight font-mono"
                    >
                      {formatNumberWithDots(vesIntegerPrice, 0)} Bs
                    </div>
                    <span className="text-[10px] text-neutral-400">
                      Resultado en número entero
                    </span>
                  </div>
                </div>

                {/* Specifications list */}
                <div className="space-y-1.5 mb-4 text-xs">
                  <div className="flex items-center justify-between text-neutral-300 py-1 border-b border-neutral-800/80">
                    <span className="text-neutral-400">Modalidad:</span>
                    <span className="font-semibold text-white">{product.profiles}</span>
                  </div>
                  <div className="flex items-center justify-between text-neutral-300 py-1 border-b border-neutral-800/80">
                    <span className="text-neutral-400">Calidad:</span>
                    <span className="font-semibold text-white">{product.quality}</span>
                  </div>
                  <div className="flex items-center justify-between text-neutral-300 py-1">
                    <span className="text-neutral-400">Garantía:</span>
                    <span className="font-semibold text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> 30 Días
                    </span>
                  </div>
                </div>

                {/* Feature bullets */}
                <div className="space-y-1.5 mb-5 pt-3 border-t border-neutral-800">
                  {product.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[11px] text-neutral-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order button */}
              <button
                onClick={() => handleOrder(product)}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-xs py-3 px-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 group-hover:shadow-green-500/20"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Pedir por WhatsApp ({rates.whatsappUsername || '@divisasorion'})</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Streaming Guarantee Banner */}
      <div className="mt-10 bg-gradient-to-r from-neutral-900 to-neutral-950 border-2 border-red-900/40 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 flex-shrink-0">
            <Tv className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-lg font-black text-white">
              ¿Deseas combos especiales o más pantallas?
            </h4>
            <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
              Activaciones directas con pago en Pesos o Bolívares y soporte garantizado.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            const msg = `Hola Divisas Orion (${rates.whatsappUsername || '@divisasorion'}), quiero consultar por combos o cuentas completas de streaming.`;
            if (onOpenWhatsApp) {
              onOpenWhatsApp(msg, 'Combos Streaming Especiales');
            } else {
              launchProtectedWhatsApp({
                phone: rates.whatsappNumber,
                text: msg,
                customLink: rates.whatsappLink,
              });
            }
          }}
          className="whitespace-nowrap bg-white text-neutral-950 hover:bg-neutral-100 font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow"
        >
          Consultar Combos Streaming
        </button>
      </div>
    </section>
  );
};
