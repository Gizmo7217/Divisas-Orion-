import React, { useState } from 'react';
import { ExchangeRates, CurrencyDirection } from '../types';
import { formatNumberWithDots } from '../utils/formatters';
import { Table, ArrowRight, MessageSquare, Sparkles } from 'lucide-react';

interface QuickTablesProps {
  rates: ExchangeRates;
  onSelectAmount: (amount: number, dir: CurrencyDirection) => void;
  onOpenFlyerModal: () => void;
}

export const QuickTables: React.FC<QuickTablesProps> = ({
  rates,
  onSelectAmount,
  onOpenFlyerModal,
}) => {
  const [selectedTab, setSelectedTab] = useState<CurrencyDirection>('COP_TO_VES');
  const [showDecimals, setShowDecimals] = useState<boolean>(false);

  // Exact values from flyer photo for 3.55:
  // 50.000 / 3.55 = 14084.507... -> 14.085 Bs
  // 100.000 / 3.55 = 28169.014... -> 28.169 Bs
  // 200.000 / 3.55 = 56338.028... -> 56.338 Bs
  // 500.000 / 3.55 = 140845.07... -> 140.845 Bs
  // 1.000.000 / 3.55 = 281690.14... -> 281.690 Bs
  const copAmounts = [50000, 100000, 200000, 500000, 1000000, 2000000];

  // For Bolívares a Pesos (VES * 2.75):
  const vesAmounts = [5000, 10000, 20000, 50000, 100000, 200000];

  return (
    <section id="cuadros" className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-900 text-xs font-bold uppercase tracking-wider mb-2">
          <Table className="w-3.5 h-3.5 text-red-700" />
          <span>Cuadros de Conversión Inmediata</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
          ¿Cuánto recibes por cada monto?
        </h2>
        <p className="mt-2 text-sm sm:text-base text-neutral-600 max-w-xl mx-auto">
          Consulta rápida con la tasa del día oficial. Toca cualquier fila para cargarla al instante.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="inline-flex p-1.5 rounded-2xl bg-neutral-200 border border-neutral-300 w-full sm:w-auto">
          <button
            onClick={() => setSelectedTab('COP_TO_VES')}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              selectedTab === 'COP_TO_VES'
                ? 'bg-[#7B0606] text-white shadow-md'
                : 'text-neutral-700 hover:text-neutral-900'
            }`}
          >
            🇨🇴 Pesos ➔ 🇻🇪 Bolívares (÷ {rates.copToVesRate.toString().replace('.', ',')})
          </button>
          <button
            onClick={() => setSelectedTab('VES_TO_COP')}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              selectedTab === 'VES_TO_COP'
                ? 'bg-[#7B0606] text-white shadow-md'
                : 'text-neutral-700 hover:text-neutral-900'
            }`}
          >
            🇻🇪 Bolívares ➔ 🇨🇴 Pesos (× {rates.vesToCopRate.toString().replace('.', ',')})
          </button>
        </div>

        {/* Toggle Decimals */}
        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700 bg-neutral-100 px-3 py-1.5 rounded-xl border border-neutral-200">
          <span>Modo de visualización:</span>
          <button
            onClick={() => setShowDecimals(!showDecimals)}
            className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all ${
              showDecimals
                ? 'bg-red-800 text-white'
                : 'bg-white text-neutral-800 border border-neutral-300'
            }`}
          >
            {showDecimals ? 'Con 2 decimales' : 'Enteros (Estilo Flyer)'}
          </button>
        </div>
      </div>

      {/* The Styled Table matching the Flyer visual pill rows */}
      <div className="bg-gradient-to-b from-[#6b0505] via-[#7B0606] to-[#450202] rounded-3xl p-6 sm:p-10 shadow-2xl border-4 border-red-800 text-white relative overflow-hidden">
        {/* Subtle patterned watermark */}
        <div className="absolute inset-0 opacity-5 pointer-events-none select-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>

        {/* Top flyer subhead */}
        <div className="text-center mb-6">
          <div className="text-xs sm:text-sm font-black tracking-widest uppercase text-red-200">
            {selectedTab === 'COP_TO_VES' ? 'TABLA OFICIAL DE GIROS' : 'TABLA OFICIAL DE RETORNOS'}
          </div>
          <div
            className="text-2xl sm:text-3xl font-black italic uppercase tracking-wider text-white mt-1 drop-shadow-md"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {selectedTab === 'COP_TO_VES' ? 'PESOS BOLÍVARES' : 'BOLÍVARES PESOS'}
          </div>
          <div className="text-xs text-red-200 font-medium mt-1">
            Tasa activa: <span className="font-extrabold text-amber-300">
              {selectedTab === 'COP_TO_VES' ? rates.copToVesRate.toString().replace('.', ',') : rates.vesToCopRate.toString().replace('.', ',')}
            </span>
          </div>
        </div>

        {/* Pill list rows matching the user's photo */}
        <div className="space-y-3.5 max-w-2xl mx-auto">
          {selectedTab === 'COP_TO_VES' ? (
            copAmounts.map((cop) => {
              const ves = cop / rates.copToVesRate;
              const formattedVes = showDecimals
                ? `${formatNumberWithDots(ves, 2)} Bs`
                : `${formatNumberWithDots(Math.round(ves), 0)} Bs`;

              return (
                <div
                  key={cop}
                  onClick={() => onSelectAmount(cop, 'COP_TO_VES')}
                  className="group cursor-pointer rounded-full border-2 border-white/80 hover:border-amber-300 bg-white/5 hover:bg-white/20 py-3.5 px-6 sm:px-8 transition-all duration-200 flex items-center justify-between shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl sm:text-2xl font-black italic tracking-wide text-white group-hover:text-amber-200" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      {formatNumberWithDots(cop, 0)}
                    </span>
                    <span className="text-xl font-bold text-red-200/80">/</span>
                    <span className="text-xl sm:text-2xl font-black italic tracking-wide text-white group-hover:text-amber-200" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      {formattedVes}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold text-red-200 group-hover:text-white transition-colors">
                    <span className="hidden sm:inline">Seleccionar</span>
                    <ArrowRight className="w-4 h-4 text-amber-300 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })
          ) : (
            vesAmounts.map((ves) => {
              const cop = ves * rates.vesToCopRate;
              const formattedCop = `$ ${formatNumberWithDots(Math.round(cop), 0)} COP`;

              return (
                <div
                  key={ves}
                  onClick={() => onSelectAmount(ves, 'VES_TO_COP')}
                  className="group cursor-pointer rounded-full border-2 border-white/80 hover:border-amber-300 bg-white/5 hover:bg-white/20 py-3.5 px-6 sm:px-8 transition-all duration-200 flex items-center justify-between shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl sm:text-2xl font-black italic tracking-wide text-white group-hover:text-amber-200" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      {formatNumberWithDots(ves, 0)} Bs
                    </span>
                    <span className="text-xl font-bold text-red-200/80">/</span>
                    <span className="text-xl sm:text-2xl font-black italic tracking-wide text-white group-hover:text-amber-200" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      {formattedCop}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold text-red-200 group-hover:text-white transition-colors">
                    <span className="hidden sm:inline">Seleccionar</span>
                    <ArrowRight className="w-4 h-4 text-amber-300 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Slogan at bottom matching the photo */}
        <div className="mt-8 text-center pt-4 border-t border-red-400/30">
          <p className="text-base sm:text-lg font-bold text-white tracking-wide italic">
            "{rates.slogan}"
          </p>
          <div className="mt-3 flex items-center justify-center gap-3">
            <button
              onClick={onOpenFlyerModal}
              className="text-xs text-amber-200 hover:text-white underline font-semibold flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" /> Ver diseño exacto del flyer promocional
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
