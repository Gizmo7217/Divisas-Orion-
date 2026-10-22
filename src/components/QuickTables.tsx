import React, { useState } from 'react';
import { ExchangeRates, CurrencyDirection } from '../types';
import { formatCOP, formatVES, formatVESInteger, formatNumberWithDots } from '../utils/formatters';
import { Table, ArrowRightLeft, FileText, CheckCircle2, Zap } from 'lucide-react';

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

  const copAmounts = [50000, 100000, 200000, 500000, 1000000, 2000000];
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

      {/* Navigation Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="inline-flex p-1 rounded-2xl bg-neutral-200 border border-neutral-300 text-xs font-bold w-full sm:w-auto">
          <button
            onClick={() => setSelectedTab('COP_TO_VES')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
              selectedTab === 'COP_TO_VES'
                ? 'bg-[#7B0606] text-white shadow'
                : 'text-neutral-700 hover:text-neutral-950'
            }`}
          >
            <span>🇨🇴 Pesos ➔ 🇻🇪 Bolívares (÷ {rates.copToVesRate.toString().replace('.', ',')})</span>
          </button>
          <button
            onClick={() => setSelectedTab('VES_TO_COP')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
              selectedTab === 'VES_TO_COP'
                ? 'bg-[#7B0606] text-white shadow'
                : 'text-neutral-700 hover:text-neutral-950'
            }`}
          >
            <span>🇻🇪 Bolívares ➔ 🇨🇴 Pesos (× {rates.vesToCopRate.toString().replace('.', ',')})</span>
          </button>
        </div>

        {selectedTab === 'COP_TO_VES' && (
          <label className="flex items-center gap-2 text-xs font-semibold text-neutral-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showDecimals}
              onChange={(e) => setShowDecimals(e.target.checked)}
              className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
            />
            <span>Mostrar decimales exactos</span>
          </label>
        )}
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-3xl border-2 border-neutral-200/80 shadow-xl overflow-hidden">
        {selectedTab === 'COP_TO_VES' ? (
          <div>
            <div className="bg-gradient-to-r from-[#590404] to-[#7B0606] text-white p-4 sm:px-6 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-red-200 uppercase tracking-wider block">
                  Envío desde Colombia
                </span>
                <span className="text-lg font-black tracking-tight">
                  Pesos Colombianos (COP) ➔ Bolívares (VES)
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-amber-200 font-semibold block">Tasa del día:</span>
                <span className="text-xl font-black text-white">÷ {rates.copToVesRate.toString().replace('.', ',')}</span>
              </div>
            </div>

            <div className="divide-y divide-neutral-100">
              {copAmounts.map((cop) => {
                const ves = cop / rates.copToVesRate;
                const exactStr = formatVES(ves, true);
                const intStr = formatVESInteger(ves);

                return (
                  <div
                    key={cop}
                    onClick={() => onSelectAmount(cop, 'COP_TO_VES')}
                    className="p-4 sm:px-6 flex items-center justify-between hover:bg-red-50/60 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-neutral-100 group-hover:bg-red-100 text-neutral-800 group-hover:text-red-700 flex items-center justify-center font-black text-xs transition-colors">
                        $
                      </div>
                      <div>
                        <span className="text-sm sm:text-base font-extrabold text-neutral-900 block group-hover:text-red-700 transition-colors">
                          {formatCOP(cop)}
                        </span>
                        <span className="text-[11px] text-neutral-500">
                          {formatNumberWithDots(cop, 0)} ÷ {rates.copToVesRate.toString().replace('.', ',')}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-base sm:text-xl font-black text-neutral-900 group-hover:text-red-700 transition-colors block font-mono">
                        {showDecimals ? exactStr : intStr}
                      </span>
                      {!showDecimals && (
                        <span className="text-[10px] text-neutral-400">
                          Exacto: {exactStr}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div>
            <div className="bg-gradient-to-r from-[#590404] to-[#7B0606] text-white p-4 sm:px-6 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-red-200 uppercase tracking-wider block">
                  Envío desde Venezuela
                </span>
                <span className="text-lg font-black tracking-tight">
                  Bolívares (VES) ➔ Pesos Colombianos (COP)
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-amber-200 font-semibold block">Tasa del día:</span>
                <span className="text-xl font-black text-white">× {rates.vesToCopRate.toString().replace('.', ',')}</span>
              </div>
            </div>

            <div className="divide-y divide-neutral-100">
              {vesAmounts.map((ves) => {
                const cop = ves * rates.vesToCopRate;

                return (
                  <div
                    key={ves}
                    onClick={() => onSelectAmount(ves, 'VES_TO_COP')}
                    className="p-4 sm:px-6 flex items-center justify-between hover:bg-red-50/60 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-neutral-100 group-hover:bg-red-100 text-neutral-800 group-hover:text-red-700 flex items-center justify-center font-black text-xs transition-colors">
                        Bs
                      </div>
                      <div>
                        <span className="text-sm sm:text-base font-extrabold text-neutral-900 block group-hover:text-red-700 transition-colors">
                          {formatNumberWithDots(ves, 0)} Bs
                        </span>
                        <span className="text-[11px] text-neutral-500">
                          {formatNumberWithDots(ves, 0)} × {rates.vesToCopRate.toString().replace('.', ',')}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-base sm:text-xl font-black text-neutral-900 group-hover:text-red-700 transition-colors block font-mono">
                        {formatCOP(cop)}
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        Transferencia Nequi / Llave
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Table Footer */}
        <div className="bg-neutral-50 p-4 sm:px-6 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-600">
          <span className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Toca cualquier monto para cargarlo automáticamente en la calculadora interactiva.</span>
          </span>
          <button
            onClick={onOpenFlyerModal}
            className="text-xs font-extrabold text-red-700 hover:text-red-800 underline flex items-center gap-1 whitespace-nowrap"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Ver Imagen Oficial del Flyer</span>
          </button>
        </div>
      </div>
    </section>
  );
};
