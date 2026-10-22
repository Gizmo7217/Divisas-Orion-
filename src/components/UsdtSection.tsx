import React, { useState } from 'react';
import { ExchangeRates } from '../types';
import { formatCOP, formatNumberWithDots, launchProtectedWhatsApp } from '../utils/formatters';
import { ArrowLeftRight, ShieldCheck, Zap, Wallet, CheckCircle2, TrendingUp, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';

interface UsdtSectionProps {
  rates: ExchangeRates;
  onOpenWhatsApp?: (msg: string, title?: string) => void;
}

export const UsdtSection: React.FC<UsdtSectionProps> = ({ rates, onOpenWhatsApp }) => {
  // Mode: 'buy' (cliente compra USDT y paga en COP o VES) | 'sell' (cliente vende USDT y recibe COP o VES)
  const [operationType, setOperationType] = useState<'buy' | 'sell'>('buy');
  const [fiatCurrency, setFiatCurrency] = useState<'COP' | 'VES'>('COP');
  const [amountInput, setAmountInput] = useState<string>('50');

  const cleanAmount = parseFloat(amountInput.replace(/[^0-9.]/g, '')) || 0;

  const handleQuickAmount = (val: string) => {
    setAmountInput(val);
  };

  const handleAction = () => {
    const opLabel = operationType === 'buy' ? 'COMPRA DE USDT' : 'VENTA DE USDT';
    const fiatLabel = fiatCurrency === 'COP' ? '🇨🇴 Pesos Colombianos (COP)' : '🇻🇪 Bolívares (VES)';

    const msg = `🪙 *COTIZACIÓN ${opLabel} - DIVISAS ORION (@divisasorion)* 🚀

👋 Hola, deseo consultar la cotización activa para:

📌 *Operación:* ${operationType === 'buy' ? 'Deseo Comprar USDT (Pago con ' + (fiatCurrency === 'COP' ? 'Pesos' : 'Bolívares') + ' y recibo USDT en Binance Pay)' : 'Deseo Vender USDT (Entrego USDT Binance y recibo ' + (fiatCurrency === 'COP' ? 'Pesos' : 'Bolívares') + ' en mi cuenta)'}
💵 *Monto aproximado:* ${amountInput} ${operationType === 'buy' ? (fiatCurrency === 'COP' ? 'COP' : 'VES / USDT') : 'USDT'}
💳 *Moneda fiduciaria:* ${fiatLabel}
⚡ *Red / Plataforma:* Binance Pay / Pay ID (0% comisión de red)
🛡️ *Canal Oficial:* ${rates.whatsappUsername || '@divisasorion'}

Por favor facilítenme la tasa del momento y los datos para realizar la transacción. ¡Muchas gracias!`;

    if (onOpenWhatsApp) {
      onOpenWhatsApp(msg, `Cotización ${opLabel} Binance`);
    } else {
      launchProtectedWhatsApp({
        phone: rates.whatsappNumber,
        text: msg,
        customLink: rates.whatsappLink || 'https://wa.link/lreunw',
      });
    }
  };

  return (
    <section id="usdt" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Container with premium Binance Black & Amber / Red aesthetic */}
      <div className="relative bg-gradient-to-br from-[#1b0305] via-[#120002] to-neutral-950 rounded-3xl border-2 border-amber-500/40 p-6 sm:p-10 shadow-2xl overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <Wallet className="w-3.5 h-3.5 text-amber-400" />
            <span>Binance Pay • P2P Seguro</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Compra y Venta de <span className="text-amber-400">USDT Binance</span>
          </h2>

          <p className="mt-3 text-sm sm:text-base text-neutral-300">
            Comercia criptodólares USDT de forma rápida y confiable. Paga o recibe en{' '}
            <strong className="text-white">Pesos Colombianos 🇨🇴</strong> (Nequi, Llave, Bancolombia) o{' '}
            <strong className="text-white">Bolívares 🇻🇪</strong> (Pago Móvil, Banesco) con acreditación directa a tu Binance Pay.
          </p>
        </div>

        {/* Operation Selector & Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Column: Interactive Quotation Form */}
          <div className="lg:col-span-7 bg-neutral-900/90 rounded-2xl border border-neutral-800 p-6 sm:p-7 shadow-xl">
            {/* Step 1: Operation Tabs (Comprar vs Vender) */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                1. ¿Qué operación deseas realizar?
              </label>
              <div className="grid grid-cols-2 gap-3 p-1 bg-black/60 rounded-xl border border-neutral-800">
                <button
                  type="button"
                  onClick={() => setOperationType('buy')}
                  className={`py-3 px-4 rounded-lg font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
                    operationType === 'buy'
                      ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg shadow-emerald-950/50'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Comprar USDT</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOperationType('sell')}
                  className={`py-3 px-4 rounded-lg font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
                    operationType === 'sell'
                      ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-lg shadow-red-950/50'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-red-400"></span>
                  <span>Vender USDT</span>
                </button>
              </div>
            </div>

            {/* Step 2: Select Currency (COP vs VES) */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                2. ¿Con qué moneda deseas operar?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFiatCurrency('COP')}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                    fiatCurrency === 'COP'
                      ? 'border-amber-400 bg-amber-500/10 text-white'
                      : 'border-neutral-800 bg-black/40 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <span className="text-2xl">🇨🇴</span>
                  <div>
                    <div className="font-bold text-sm text-white">Pesos Colombianos</div>
                    <div className="text-[11px] text-neutral-400">Nequi • Llave • Bancolombia</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFiatCurrency('VES')}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                    fiatCurrency === 'VES'
                      ? 'border-amber-400 bg-amber-500/10 text-white'
                      : 'border-neutral-800 bg-black/40 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <span className="text-2xl">🇻🇪</span>
                  <div>
                    <div className="font-bold text-sm text-white">Bolívares (VES)</div>
                    <div className="text-[11px] text-neutral-400">Pago Móvil • Banesco</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Step 3: Amount Input & Quick Chips */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                3. Monto estimado:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  placeholder="Ej. 50"
                  className="w-full bg-black/60 border-2 border-neutral-700 focus:border-amber-400 rounded-xl py-3 px-4 text-xl font-black text-white outline-none font-mono"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-400 font-mono">
                  {operationType === 'buy' ? (fiatCurrency === 'COP' ? 'COP / USDT' : 'VES / USDT') : 'USDT'}
                </span>
              </div>

              {/* Quick suggestions */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                <span className="text-[11px] text-neutral-500 mr-1">Rápidos:</span>
                {['20 USDT', '50 USDT', '100 USDT', '200 USDT', '500 USDT'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleQuickAmount(val.replace(' USDT', ''))}
                    className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-[11px] font-bold text-neutral-300 hover:text-white transition-all font-mono"
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Action CTA Button */}
            <button
              type="button"
              onClick={handleAction}
              className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-neutral-950 font-black text-sm sm:text-base py-4 px-6 rounded-xl shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <MessageCircle className="w-5 h-5 fill-neutral-950" />
              <span>
                {operationType === 'buy' ? 'Cotizar Compra de USDT en WhatsApp' : 'Cotizar Venta de USDT en WhatsApp'}
              </span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
            <p className="text-center text-[11px] text-neutral-400 mt-2">
              Respuesta en menos de 5 minutos con la mejor tasa del mercado.
            </p>
          </div>

          {/* Right Column: Value Props & Guarantees */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-black/50 border border-neutral-800 rounded-2xl p-5">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 flex-shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-extrabold text-sm sm:text-base">
                    Binance Pay Directo (0% Comisión de Red)
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    Transferencias instantáneas entre cuentas Binance mediante Pay ID, correo o código QR sin descuentos de red blockchain.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-black/50 border border-neutral-800 rounded-2xl p-5">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 flex-shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-extrabold text-sm sm:text-base">
                    Sin Riesgos de Estafas en P2P
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    Operas directamente con el equipo verificado de Divisas Orion (@divisasorion). Cuentas bancarias limpias y verificadas.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-black/50 border border-neutral-800 rounded-2xl p-5">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-red-600/20 text-red-400 flex-shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-extrabold text-sm sm:text-base">
                    Tasa Competitiva Actualizada
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    Cotizamos al precio real del mercado en tiempo real, garantizando el mejor rendimiento para tus Pesos o Bolívares.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Badge summary */}
            <div className="bg-gradient-to-r from-amber-500/10 to-red-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between gap-2 text-xs">
              <span className="text-neutral-300 font-medium">
                ¿Necesitas cambiar gran volumen de USDT?
              </span>
              <button
                type="button"
                onClick={handleAction}
                className="text-amber-400 hover:text-amber-300 font-extrabold underline flex items-center gap-1"
              >
                <span>Consultar</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
