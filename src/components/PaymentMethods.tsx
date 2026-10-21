import React, { useState } from 'react';
import { PAYMENT_METHODS } from '../data/initialData';
import { PaymentMethodDetail } from '../types';
import { Smartphone, Key, Zap, Building2, Copy, Check, ShieldCheck, ArrowRight, Info, CheckCircle2 } from 'lucide-react';

export const PaymentMethods: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<'Colombia' | 'Venezuela'>('Colombia');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const methods = PAYMENT_METHODS.filter((m) => m.country === selectedCountry);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'Smartphone':
        return <Smartphone className="w-6 h-6 text-pink-400" />;
      case 'Key':
        return <Key className="w-6 h-6 text-amber-400" />;
      case 'Zap':
        return <Zap className="w-6 h-6 text-emerald-400" />;
      case 'Building2':
        return <Building2 className="w-6 h-6 text-blue-400" />;
      default:
        return <ShieldCheck className="w-6 h-6 text-white" />;
    }
  };

  return (
    <section id="pagos" className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-100 text-red-900 text-xs font-bold uppercase tracking-wider mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-red-700" />
          <span>Cuentas Autorizadas</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
          Métodos de Pago Oficiales
        </h2>
        <p className="mt-2 text-sm sm:text-base text-neutral-600 max-w-xl mx-auto">
          Utiliza nuestros canales bancarios directos para acreditar tu dinero en minutos.
        </p>

        {/* Country Selector */}
        <div className="mt-6 inline-flex p-1.5 rounded-2xl bg-neutral-200 border border-neutral-300">
          <button
            onClick={() => setSelectedCountry('Colombia')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              selectedCountry === 'Colombia'
                ? 'bg-[#7B0606] text-white shadow-md'
                : 'text-neutral-700 hover:text-neutral-900'
            }`}
          >
            <span>🇨🇴 Métodos Colombia</span>
            <span className="text-[11px] bg-black/20 px-2 py-0.5 rounded-full">Nequi & Llave</span>
          </button>
          <button
            onClick={() => setSelectedCountry('Venezuela')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              selectedCountry === 'Venezuela'
                ? 'bg-[#7B0606] text-white shadow-md'
                : 'text-neutral-700 hover:text-neutral-900'
            }`}
          >
            <span>🇻🇪 Métodos Venezuela</span>
            <span className="text-[11px] bg-black/20 px-2 py-0.5 rounded-full">Pago Móvil & Banesco</span>
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {methods.map((method) => (
          <div
            key={method.id}
            className="bg-neutral-900 rounded-3xl border-2 border-neutral-800 p-6 sm:p-7 text-white shadow-xl flex flex-col justify-between hover:border-red-600/40 transition-all duration-200 relative overflow-hidden"
          >
            {/* Top gradient highlight */}
            <div className={`absolute top-0 inset-x-0 h-2 bg-gradient-to-r ${method.color}`}></div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center shadow-inner">
                    {getIcon(method.iconName)}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">{method.name}</h3>
                    <p className="text-xs text-neutral-400">{method.bankName}</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-950 border border-red-700 text-red-200">
                  {method.badge}
                </span>
              </div>

              <p className="text-xs text-neutral-300 font-medium mb-5 bg-neutral-950/60 p-3 rounded-xl border border-neutral-800">
                {method.headline}
              </p>

              {/* Account Data with Copy buttons */}
              <div className="space-y-3 bg-neutral-950 p-4 rounded-2xl border border-neutral-800">
                {/* Number */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                      {method.id === 'nequi' || method.id === 'llave'
                        ? 'Número de Celular / Cuenta'
                        : method.id === 'pago-movil'
                        ? 'Teléfono Pago Móvil'
                        : 'Número de Cuenta Banesco'}
                    </span>
                    <span className="text-base font-black text-amber-300 font-mono">
                      {method.accountNumber}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(method.accountNumber, `${method.id}-num`)}
                    className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border border-neutral-700"
                    title="Copiar número"
                  >
                    {copiedId === `${method.id}-num` ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 text-[11px]">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Copiar</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Document ID */}
                <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                      Documento / Cédula / RIF
                    </span>
                    <span className="text-sm font-bold text-white font-mono">
                      {method.documentId}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(method.documentId, `${method.id}-doc`)}
                    className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border border-neutral-700"
                    title="Copiar documento"
                  >
                    {copiedId === `${method.id}-doc` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Holder */}
                <div className="pt-2 border-t border-neutral-800/80">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                    Nombre del Titular
                  </span>
                  <span className="text-xs font-bold text-neutral-200">
                    {method.accountHolder}
                  </span>
                </div>
              </div>
            </div>

            {/* Note & footer */}
            <div className="mt-5 pt-4 border-t border-neutral-800 flex items-start gap-2 text-xs text-neutral-400">
              <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">{method.notes}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Security Tip Box */}
      <div className="mt-8 bg-amber-500/10 border-2 border-amber-500/30 rounded-2xl p-5 text-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-7 h-7 text-amber-600 flex-shrink-0" />
          <div className="text-xs sm:text-sm">
            <span className="font-bold text-neutral-900 block">
              Instrucción importante para procesar tu giro:
            </span>
            Realiza tu transferencia a las cuentas oficiales y envía el capture o comprobante por WhatsApp con el nombre del destinatario.
          </div>
        </div>
        <a
          href="#calculadora"
          className="whitespace-nowrap px-4 py-2 bg-[#7B0606] hover:bg-red-800 text-white font-bold text-xs rounded-xl transition-all shadow"
        >
          Ir a Cotizar Giro
        </a>
      </div>
    </section>
  );
};
