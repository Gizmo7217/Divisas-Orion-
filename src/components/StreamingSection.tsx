import React, { useState } from 'react';
import { STREAMING_PRODUCTS } from '../data/initialData';
import { ExchangeRates, StreamingProduct } from '../types';
import { formatCOP, formatVES, createStreamingWhatsAppMessage } from '../utils/formatters';
import { Tv, Sparkles, Check, MessageCircle, ShieldCheck, Flame } from 'lucide-react';

interface StreamingSectionProps {
  rates: ExchangeRates;
}

export const StreamingSection: React.FC<StreamingSectionProps> = ({ rates }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [currencyPref, setCurrencyPref] = useState<'COP' | 'VES'>('COP');

  const categories = ['Todos', 'Películas & Series', 'Música', 'Anime', 'Video & Entretenimiento'];

  const filteredProducts =
    selectedCategory === 'Todos'
      ? STREAMING_PRODUCTS
      : STREAMING_PRODUCTS.filter((p) => p.category === selectedCategory);

  const handleOrder = (product: StreamingProduct) => {
    // If currency is VES, calculate live with rate or product price
    const vesPrice = product.priceCOP / rates.copToVesRate;
    const url = createStreamingWhatsAppMessage({
      phone: rates.whatsappNumber,
      productName: product.name,
      priceCOP: product.priceCOP,
      priceVES: vesPrice,
      currencyPreference: currencyPref,
    });
    window.open(url, '_blank');
  };

  return (
    <section id="streaming" className="py-14 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-100 text-red-900 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-red-700" />
          <span>Servicio Adicional Exclusivo</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight">
          Pantallas y Cuentas Streaming
        </h2>
        <p className="mt-2 text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto">
          Disfruta de tus plataformas favoritas con entrega inmediata, perfiles con PIN privado y garantía completa de 30 días.
        </p>

        {/* Currency Switcher */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <div className="inline-flex p-1 rounded-xl bg-neutral-200 border border-neutral-300">
            <button
              onClick={() => setCurrencyPref('COP')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currencyPref === 'COP'
                  ? 'bg-[#7B0606] text-white shadow'
                  : 'text-neutral-700 hover:text-neutral-900'
              }`}
            >
              🇨🇴 Precios en Pesos (COP)
            </button>
            <button
              onClick={() => setCurrencyPref('VES')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currencyPref === 'VES'
                  ? 'bg-[#7B0606] text-white shadow'
                  : 'text-neutral-700 hover:text-neutral-900'
              }`}
            >
              🇻🇪 Precios en Bolívares (VES)
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of 7 streaming services */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const vesPrice = product.priceCOP / rates.copToVesRate;
          const displayPrice =
            currencyPref === 'COP'
              ? formatCOP(product.priceCOP)
              : formatVES(vesPrice, true);

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

                {/* Service Name & Tagline */}
                <div className="mb-3">
                  <h3 className="text-xl font-black text-white group-hover:text-red-200 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                    {product.tagline}
                  </p>
                </div>

                {/* Price Display */}
                <div className="bg-neutral-950 p-3.5 rounded-2xl border border-neutral-800 mb-4 text-center">
                  <span className="text-[10px] text-neutral-400 uppercase font-bold block">
                    Precio mensual / 30 días
                  </span>
                  <div
                    className="text-2xl font-black text-amber-300 mt-0.5"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    {displayPrice}
                  </div>
                  {currencyPref === 'VES' && (
                    <span className="text-[10px] text-neutral-400 block mt-0.5">
                      Equivalente: {formatCOP(product.priceCOP)}
                    </span>
                  )}
                  {currencyPref === 'COP' && (
                    <span className="text-[10px] text-neutral-400 block mt-0.5">
                      En Bolívares: {formatVES(vesPrice, true)}
                    </span>
                  )}
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
                <span>Pedir Pantalla por WhatsApp</span>
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
              ¿Quieres un paquete especial o cuentas completas?
            </h4>
            <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
              También manejamos combos de 2 o más plataformas con descuento especial y soporte 24/7.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            const url = `https://wa.me/${rates.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
              'Hola Divisas Orion, quiero consultar por combos o cuentas completas de streaming.'
            )}`;
            window.open(url, '_blank');
          }}
          className="whitespace-nowrap bg-white text-neutral-950 hover:bg-neutral-100 font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow"
        >
          Consultar Combos Streaming
        </button>
      </div>
    </section>
  );
};
