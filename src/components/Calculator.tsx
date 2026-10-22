import React, { useState, useId, useEffect } from 'react';
import { CurrencyDirection, ExchangeRates } from '../types';
import { calculateRemesa, getRemesaMessageText, launchProtectedWhatsApp, formatCOP, formatVES, formatVESInteger, formatNumberWithDots } from '../utils/formatters';
import { MessageCircle, Copy, Check, Calculator as CalcIcon, ShieldCheck, Info, Sparkles, ArrowRight, Zap, RefreshCw } from 'lucide-react';

interface CalculatorProps {
  rates: ExchangeRates;
  direction?: CurrencyDirection;
  onDirectionChange?: (dir: CurrencyDirection) => void;
  onScrollToPayments: () => void;
  selectedAmount?: number | null;
  onOpenWhatsApp?: (msg: string, title?: string) => void;
}

export const Calculator: React.FC<CalculatorProps> = ({
  rates,
  onScrollToPayments,
  selectedAmount,
  direction,
  onDirectionChange,
  onOpenWhatsApp,
}) => {
  // View mode: both side-by-side or single focused
  const [viewMode, setViewMode] = useState<'both' | 'cop_to_ves' | 'ves_to_cop'>('both');

  // Calculator 1: Pesos a Bolívares (COP -> VES, rate 3.55, division)
  const [copInput, setCopInput] = useState<string>('100000');
  const [copPayment, setCopPayment] = useState<string>('Nequi');
  const [copiedCop, setCopiedCop] = useState<boolean>(false);

  // Calculator 2: Bolívares a Pesos (VES -> COP, rate 2.75, multiplication)
  const [vesInput, setVesInput] = useState<string>('20000');
  const [vesPayment, setVesPayment] = useState<string>('Pago Móvil');
  const [copiedVes, setCopiedVes] = useState<boolean>(false);

  const copInputId = useId();
  const vesInputId = useId();

  // If a preset amount was clicked from the table or hero
  useEffect(() => {
    if (selectedAmount !== undefined && selectedAmount !== null) {
      if (direction === 'VES_TO_COP') {
        setVesInput(selectedAmount.toString());
      } else {
        setCopInput(selectedAmount.toString());
      }
    }
  }, [selectedAmount, direction]);

  // Calculations
  const numCop = parseFloat(copInput.replace(/[^0-9.]/g, '')) || 0;
  const numVes = parseFloat(vesInput.replace(/[^0-9.]/g, '')) || 0;

  // Calculadora 1: COP a VES (Pesos / 3.55 = Bolívares con enteros y 2 decimales)
  const safeCopRate = rates.copToVesRate > 0 ? rates.copToVesRate : 3.55;
  const vesCalculated = numCop / safeCopRate;
  const vesExactFormatted = `${formatNumberWithDots(vesCalculated, 2)} Bs`;
  const vesIntegerFormatted = `${formatNumberWithDots(Math.round(vesCalculated), 0)} Bs`;

  // Calculadora 2: VES a COP (Bolívares * 2.75 = Pesos)
  const safeVesRate = rates.vesToCopRate > 0 ? rates.vesToCopRate : 2.75;
  const copCalculated = numVes * safeVesRate;
  const copFormatted = `$ ${formatNumberWithDots(Math.round(copCalculated), 0)} COP`;

  // Quick preset buttons
  const copPresets = [50000, 100000, 200000, 500000, 1000000];
  const vesPresets = [5000, 10000, 20000, 50000, 100000];

  const handleCopyCopSummary = () => {
    const summary = `Divisas Orion - Cotización Oficial
Operación: Pesos a Bolívares (🇨🇴 COP ➔ 🇻🇪 VES)
Monto enviado: $ ${formatNumberWithDots(numCop, 0)} COP
Tasa del día: ${safeCopRate.toString().replace('.', ',')} (División)
Recibe en Venezuela: ${vesExactFormatted} (Redondeado: ${vesIntegerFormatted})
Fórmula: ${formatNumberWithDots(numCop, 0)} ÷ ${safeCopRate.toString().replace('.', ',')} = ${vesExactFormatted}
Método de pago: ${copPayment}
Contacto oficial: ${rates.whatsappUsername || '@divisasorion'}
Slogan: "Cambia rápido y seguro con nosotros"`;

    navigator.clipboard.writeText(summary);
    setCopiedCop(true);
    setTimeout(() => setCopiedCop(false), 2200);
  };

  const handleSendCopWhatsApp = () => {
    const text = getRemesaMessageText({
      direction: 'COP_TO_VES',
      fromAmount: numCop,
      toAmount: vesCalculated,
      rateApplied: safeCopRate,
      paymentMethod: copPayment,
    });

    if (onOpenWhatsApp) {
      onOpenWhatsApp(text, 'Cotización Pesos a Bolívares (🇨🇴 ➔ 🇻🇪)');
    } else {
      launchProtectedWhatsApp({
        phone: rates.whatsappNumber,
        text,
        customLink: rates.whatsappLink,
      });
    }
  };

  const handleCopyVesSummary = () => {
    const summary = `Divisas Orion - Cotización Oficial
Operación: Bolívares a Pesos (🇻🇪 VES ➔ 🇨🇴 COP)
Monto enviado: ${formatNumberWithDots(numVes, 0)} Bs
Tasa del día: ${safeVesRate.toString().replace('.', ',')} (Multiplicación)
Recibe en Colombia: ${copFormatted}
Fórmula: ${formatNumberWithDots(numVes, 0)} Bs × ${safeVesRate.toString().replace('.', ',')} = ${copFormatted}
Método de pago: ${vesPayment}
Contacto oficial: ${rates.whatsappUsername || '@divisasorion'}
Slogan: "Cambia rápido y seguro con nosotros"`;

    navigator.clipboard.writeText(summary);
    setCopiedVes(true);
    setTimeout(() => setCopiedVes(false), 2200);
  };

  const handleSendVesWhatsApp = () => {
    const text = getRemesaMessageText({
      direction: 'VES_TO_COP',
      fromAmount: numVes,
      toAmount: copCalculated,
      rateApplied: safeVesRate,
      paymentMethod: vesPayment,
    });

    if (onOpenWhatsApp) {
      onOpenWhatsApp(text, 'Cotización Bolívares a Pesos (🇻🇪 ➔ 🇨🇴)');
    } else {
      launchProtectedWhatsApp({
        phone: rates.whatsappNumber,
        text,
        customLink: rates.whatsappLink,
      });
    }
  };

  return (
    <section id="calculadora" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 text-red-900 text-xs font-black uppercase tracking-wider mb-2 border border-red-200">
          <CalcIcon className="w-4 h-4 text-red-700" />
          <span>Calculadoras Interactivas en Vivo</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight">
          Cotiza tu Giro al Instante
        </h2>
        <p className="mt-2 text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto">
          Calcula con total exactitud en ambas direcciones con las tasas oficiales del día:
          división a <span className="font-bold text-red-700">{safeCopRate.toString().replace('.', ',')}</span> de Pesos a Bolívares y multiplicación a <span className="font-bold text-red-700">{safeVesRate.toString().replace('.', ',')}</span> de Bolívares a Pesos.
        </p>

        {/* View Mode Switcher */}
        <div className="mt-6 inline-flex p-1.5 rounded-2xl bg-neutral-200 border border-neutral-300 shadow-inner">
          <button
            onClick={() => setViewMode('both')}
            className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
              viewMode === 'both'
                ? 'bg-[#7B0606] text-white shadow-md'
                : 'text-neutral-700 hover:text-neutral-950'
            }`}
          >
            Ver Ambas en Paralelo
          </button>
          <button
            onClick={() => setViewMode('cop_to_ves')}
            className={`px-3 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
              viewMode === 'cop_to_ves'
                ? 'bg-[#7B0606] text-white shadow-md'
                : 'text-neutral-700 hover:text-neutral-950'
            }`}
          >
            🇨🇴 Pesos ➔ 🇻🇪 Bolívares
          </button>
          <button
            onClick={() => setViewMode('ves_to_cop')}
            className={`px-3 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
              viewMode === 'ves_to_cop'
                ? 'bg-[#7B0606] text-white shadow-md'
                : 'text-neutral-700 hover:text-neutral-950'
            }`}
          >
            🇻🇪 Bolívares ➔ 🇨🇴 Pesos
          </button>
        </div>
      </div>

      {/* Two Interactive Calculators Grid */}
      <div
        className={`grid gap-8 items-stretch ${
          viewMode === 'both'
            ? 'grid-cols-1 lg:grid-cols-2'
            : 'grid-cols-1 max-w-3xl mx-auto'
        }`}
      >
        {/* ==================================================================== */}
        {/* CALCULADORA 1: PESOS A BOLÍVARES (División entre 3.55)               */}
        {/* ==================================================================== */}
        {(viewMode === 'both' || viewMode === 'cop_to_ves') && (
          <div className="bg-gradient-to-br from-neutral-900 via-[#1d0305] to-[#2b0407] rounded-3xl border-2 border-red-500/50 p-6 sm:p-8 shadow-2xl relative overflow-hidden text-white flex flex-col justify-between">
            {/* Ambient Red Glow */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-red-600/15 rounded-full blur-3xl pointer-events-none"></div>

            <div>
              {/* Badge & Title */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-red-900/60">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🇨🇴 ➔ 🇻🇪</span>
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-red-300 block">
                      Calculadora 1 • Remesa a Venezuela
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      Pesos a Bolívares
                    </h3>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                    Tasa del día
                  </span>
                  <span className="inline-block bg-white text-[#7B0606] font-black text-xl sm:text-2xl px-3.5 py-0.5 rounded-full shadow-md font-mono">
                    {safeCopRate.toString().replace('.', ',')}
                  </span>
                </div>
              </div>

              {/* Formula notice */}
              <div className="bg-red-950/70 border border-red-700/50 rounded-xl px-3.5 py-2 text-xs text-red-200 flex items-center justify-between mb-5">
                <span className="font-semibold">Fórmula oficial:</span>
                <span className="font-mono font-bold text-white bg-black/40 px-2 py-0.5 rounded">
                  Monto en Pesos ÷ {safeCopRate.toString().replace('.', ',')}
                </span>
              </div>

              {/* Amount Input */}
              <div className="mb-4">
                <label
                  htmlFor={copInputId}
                  className="block text-xs font-bold uppercase tracking-wider text-red-300 mb-2"
                >
                  Ingresa el monto en Pesos Colombianos (COP):
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-2xl font-black text-amber-400">
                    $
                  </div>
                  <input
                    id={copInputId}
                    type="number"
                    min="0"
                    step="any"
                    value={copInput}
                    onChange={(e) => setCopInput(e.target.value)}
                    placeholder="Ej. 100000"
                    className="w-full bg-black/70 border-2 border-red-600/60 focus:border-amber-400 focus:ring-4 focus:ring-red-500/20 rounded-2xl py-3.5 pl-12 pr-4 text-2xl sm:text-3xl font-black text-white placeholder-neutral-600 outline-none transition-all shadow-inner font-mono"
                  />
                </div>

                {/* Quick Presets */}
                <div className="mt-3">
                  <span className="text-[11px] text-neutral-400 font-semibold mb-1.5 block">
                    Montos rápidos:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {copPresets.map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setCopInput(val.toString())}
                        className="bg-neutral-800 hover:bg-red-800 text-neutral-200 hover:text-white px-2.5 py-1 rounded-lg text-xs font-bold border border-neutral-700 transition-all active:scale-95"
                      >
                        {formatCOP(val)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="mb-5 pt-3 border-t border-neutral-800">
                <label className="block text-xs font-bold uppercase tracking-wider text-red-300 mb-2">
                  Medio de pago en Colombia:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCopPayment('Nequi')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      copPayment === 'Nequi'
                        ? 'bg-gradient-to-r from-pink-600 to-purple-800 border-pink-400 text-white shadow-md'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-pink-400"></span>
                    Nequi
                  </button>
                  <button
                    type="button"
                    onClick={() => setCopPayment('Llave (Bre-B / Transfiya)')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      copPayment.includes('Llave')
                        ? 'bg-gradient-to-r from-amber-600 to-red-700 border-amber-400 text-white shadow-md'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    Llave (Transfiya)
                  </button>
                </div>
              </div>

              {/* RESULTS CARD (Clear display with decimals and integer) */}
              <div className="bg-gradient-to-b from-[#7A0606] to-[#4c0406] rounded-2xl p-4 sm:p-5 border-2 border-red-400/60 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase font-black tracking-wider text-red-200">
                    Monto a entregar en Venezuela:
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    Tasa {safeCopRate.toString().replace('.', ',')}
                  </span>
                </div>

                {/* Primary Result: Two Decimal Places */}
                <div className="bg-white/10 rounded-xl p-3 border border-white/20">
                  <div className="text-[11px] text-red-200 font-semibold mb-0.5">
                    Resultado exacto en Bolívares (con 2 decimales):
                  </div>
                  <div
                    className="text-2xl sm:text-3xl font-black text-white tracking-tight break-words font-mono"
                  >
                    {vesExactFormatted}
                  </div>
                </div>

                {/* Secondary Result: Rounded Integers */}
                <div className="bg-black/40 rounded-xl p-2.5 border border-white/10 flex items-center justify-between">
                  <span className="text-xs text-red-200">
                    Número entero redondeado:
                  </span>
                  <span className="text-lg font-black text-amber-300 font-mono">
                    {vesIntegerFormatted}
                  </span>
                </div>

                {/* Detailed math explanation breakdown */}
                <div className="bg-black/60 rounded-xl p-2.5 text-xs border border-red-500/30 font-mono text-center text-red-100">
                  <span className="text-neutral-400">Desglose: </span>
                  <span className="font-bold text-white">
                    {formatNumberWithDots(numCop, 0)} COP ÷ {safeCopRate.toString().replace('.', ',')} = {vesExactFormatted}
                  </span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-5 space-y-2 pt-3 border-t border-red-900/40">
              <button
                type="button"
                onClick={handleSendCopWhatsApp}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-black text-xs sm:text-sm py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Pedir este Giro por WhatsApp ({rates.whatsappUsername || '@divisasorion'})</span>
              </button>

              <button
                type="button"
                onClick={handleCopyCopSummary}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs py-2 px-3 rounded-lg border border-white/20 transition-all flex items-center justify-center gap-1.5"
              >
                {copiedCop ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">¡Cotización copiada!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-red-200" />
                    <span>Copiar cotización</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* CALCULADORA 2: BOLÍVARES A PESOS (Multiplicación por 2.75)           */}
        {/* ==================================================================== */}
        {(viewMode === 'both' || viewMode === 'ves_to_cop') && (
          <div className="bg-gradient-to-br from-neutral-900 via-[#180a03] to-[#281204] rounded-3xl border-2 border-amber-600/50 p-6 sm:p-8 shadow-2xl relative overflow-hidden text-white flex flex-col justify-between">
            {/* Ambient Amber Glow */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-amber-600/15 rounded-full blur-3xl pointer-events-none"></div>

            <div>
              {/* Badge & Title */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-amber-900/60">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🇻🇪 ➔ 🇨🇴</span>
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 block">
                      Calculadora 2 • Remesa a Colombia
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      Bolívares a Pesos
                    </h3>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                    Tasa del día
                  </span>
                  <span className="inline-block bg-white text-amber-900 font-black text-xl sm:text-2xl px-3.5 py-0.5 rounded-full shadow-md font-mono">
                    {safeVesRate.toString().replace('.', ',')}
                  </span>
                </div>
              </div>

              {/* Formula notice */}
              <div className="bg-amber-950/70 border border-amber-700/50 rounded-xl px-3.5 py-2 text-xs text-amber-200 flex items-center justify-between mb-5">
                <span className="font-semibold">Fórmula oficial:</span>
                <span className="font-mono font-bold text-white bg-black/40 px-2 py-0.5 rounded">
                  Monto en Bolívares × {safeVesRate.toString().replace('.', ',')}
                </span>
              </div>

              {/* Amount Input */}
              <div className="mb-4">
                <label
                  htmlFor={vesInputId}
                  className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-2"
                >
                  Ingresa el monto en Bolívares (VES):
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-2xl font-black text-amber-400">
                    Bs
                  </div>
                  <input
                    id={vesInputId}
                    type="number"
                    min="0"
                    step="any"
                    value={vesInput}
                    onChange={(e) => setVesInput(e.target.value)}
                    placeholder="Ej. 20000"
                    className="w-full bg-black/70 border-2 border-amber-600/60 focus:border-amber-400 focus:ring-4 focus:ring-amber-500/20 rounded-2xl py-3.5 pl-14 pr-4 text-2xl sm:text-3xl font-black text-white placeholder-neutral-600 outline-none transition-all shadow-inner font-mono"
                  />
                </div>

                {/* Quick Presets */}
                <div className="mt-3">
                  <span className="text-[11px] text-neutral-400 font-semibold mb-1.5 block">
                    Montos rápidos:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {vesPresets.map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setVesInput(val.toString())}
                        className="bg-neutral-800 hover:bg-amber-800 text-neutral-200 hover:text-white px-2.5 py-1 rounded-lg text-xs font-bold border border-neutral-700 transition-all active:scale-95"
                      >
                        {formatNumberWithDots(val, 0)} Bs
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="mb-5 pt-3 border-t border-neutral-800">
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
                  Medio de pago en Venezuela:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setVesPayment('Pago Móvil')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      vesPayment === 'Pago Móvil'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-800 border-emerald-400 text-white shadow-md'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    Pago Móvil
                  </button>
                  <button
                    type="button"
                    onClick={() => setVesPayment('Banesco Venezuela')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      vesPayment.includes('Banesco')
                        ? 'bg-gradient-to-r from-blue-700 to-indigo-900 border-blue-400 text-white shadow-md'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    Banesco
                  </button>
                </div>
              </div>

              {/* RESULTS CARD (Clear display of Pesos received) */}
              <div className="bg-gradient-to-b from-[#8a4205] to-[#4f2002] rounded-2xl p-4 sm:p-5 border-2 border-amber-400/60 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase font-black tracking-wider text-amber-200">
                    Monto a entregar en Colombia:
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    Tasa {safeVesRate.toString().replace('.', ',')}
                  </span>
                </div>

                {/* Primary Result: Pesos Colombianos */}
                <div className="bg-white/10 rounded-xl p-3 border border-white/20">
                  <div className="text-[11px] text-amber-200 font-semibold mb-0.5">
                    Total a recibir en Pesos Colombianos (COP):
                  </div>
                  <div
                    className="text-2xl sm:text-3xl font-black text-white tracking-tight break-words font-mono"
                  >
                    {copFormatted}
                  </div>
                </div>

                {/* Account transfer notice */}
                <div className="bg-black/40 rounded-xl p-2.5 border border-white/10 flex items-center justify-between text-xs">
                  <span className="text-amber-200 font-medium">
                    Acreditación en Colombia:
                  </span>
                  <span className="font-bold text-white bg-amber-700/60 px-2 py-0.5 rounded">
                    Nequi o Llave en 5-15 min
                  </span>
                </div>

                {/* Detailed math explanation breakdown */}
                <div className="bg-black/60 rounded-xl p-2.5 text-xs border border-amber-500/30 font-mono text-center text-amber-100">
                  <span className="text-neutral-400">Desglose: </span>
                  <span className="font-bold text-white">
                    {formatNumberWithDots(numVes, 0)} Bs × {safeVesRate.toString().replace('.', ',')} = {copFormatted}
                  </span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-5 space-y-2 pt-3 border-t border-amber-900/40">
              <button
                type="button"
                onClick={handleSendVesWhatsApp}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-black text-xs sm:text-sm py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Pedir este Giro por WhatsApp ({rates.whatsappUsername || '@divisasorion'})</span>
              </button>

              <button
                type="button"
                onClick={handleCopyVesSummary}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs py-2 px-3 rounded-lg border border-white/20 transition-all flex items-center justify-center gap-1.5"
              >
                {copiedVes ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">¡Cotización copiada!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-amber-200" />
                    <span>Copiar cotización</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Helper text linking to payment methods */}
      <div className="mt-6 text-center">
        <button
          onClick={onScrollToPayments}
          className="text-xs sm:text-sm text-red-800 hover:text-red-950 font-bold underline inline-flex items-center gap-1"
        >
          <Info className="w-4 h-4" />
          Consultar datos para transferir por WhatsApp (Nequi, Llave, Pago Móvil o Banesco)
        </button>
      </div>
    </section>
  );
};
