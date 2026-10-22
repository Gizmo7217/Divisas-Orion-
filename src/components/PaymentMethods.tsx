import React, { useState } from 'react';
import { PAYMENT_METHODS } from '../data/initialData';
import { Smartphone, Key, Zap, Building2, MessageCircle, ShieldCheck, ArrowRight, Info, CheckCircle2, Lock } from 'lucide-react';
import { launchProtectedWhatsApp } from '../utils/formatters';

interface PaymentMethodsProps {
  whatsappNumber?: string;
  whatsappUsername?: string;
  whatsappLink?: string;
  onOpenWhatsApp?: (msg: string, title?: string) => void;
}

export const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  whatsappNumber = '573135459314',
  whatsappUsername = '@divisasorion',
  whatsappLink = 'https://wa.link/lreunw',
  onOpenWhatsApp,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<'Colombia' | 'Venezuela'>('Colombia');

  const methods = PAYMENT_METHODS.filter((m) => m.country === selectedCountry);

  const handleOpenWhatsApp = (promptText: string) => {
    if (onOpenWhatsApp) {
      onOpenWhatsApp(promptText, 'Consulta de Datos Bancarios');
    } else {
      launchProtectedWhatsApp({
        phone: whatsappNumber,
        text: promptText,
        customLink: whatsappLink,
      });
    }
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'Smartphone':
        return <Smartphone className="w-6 h-6 text-pink-400" />;
      case 'Key':
        return <Key className="w-6 h-6 text-amber-400" />;
      case 'Zap':
        return <Zap className="w-6 h-6 text-yellow-400" />;
      case 'Building2':
        return <Building2 className="w-6 h-6 text-emerald-400" />;
      default:
        return <Smartphone className="w-6 h-6 text-red-400" />;
    }
  };

  return (
    <section id="pagos" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-100 text-red-900 text-xs font-bold uppercase tracking-wider mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-red-700" />
          <span>Canales de Transferencia Oficiales</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
          Medios de Pago Habilitados
        </h2>
        <p className="mt-2 text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto">
          Cuentas activas en Colombia y Venezuela. Por seguridad y rotación de cupos, solicita los datos actualizados a <span className="font-bold text-red-700">{whatsappUsername}</span> antes de transferir.
        </p>

        {/* Country Selector */}
        <div className="mt-6 inline-flex p-1 rounded-2xl bg-neutral-200 border border-neutral-300">
          <button
            onClick={() => setSelectedCountry('Colombia')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 ${
              selectedCountry === 'Colombia'
                ? 'bg-[#7B0606] text-white shadow-md'
                : 'text-neutral-700 hover:text-neutral-950'
            }`}
          >
            <span>🇨🇴 Colombia (Nequi y Llave)</span>
          </button>
          <button
            onClick={() => setSelectedCountry('Venezuela')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 ${
              selectedCountry === 'Venezuela'
                ? 'bg-[#7B0606] text-white shadow-md'
                : 'text-neutral-700 hover:text-neutral-950'
            }`}
          >
            <span>🇻🇪 Venezuela (Pago Móvil y Banesco)</span>
          </button>
        </div>
      </div>

      {/* Security alert banner */}
      <div className="mb-8 max-w-4xl mx-auto bg-amber-50 border-2 border-amber-300/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 text-amber-900 shadow-sm">
        <Lock className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm leading-relaxed">
          <span className="font-extrabold text-amber-950 block mb-0.5">
            Protocolo de Seguridad Oficial Divisas Orion:
          </span>
          Nunca guardes cuentas bancarias viejas. Antes de enviar dinero por Nequi, Llave, Pago Móvil o Banesco, presiona el botón inferior para recibir por WhatsApp los datos y titular autorizados para tu giro.
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {methods.map((method) => (
          <div
            key={method.id}
            className="group bg-neutral-900 rounded-3xl border-2 border-neutral-800 hover:border-red-500/50 p-6 sm:p-7 text-white shadow-xl flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden"
          >
            {/* Ambient subtle color corner */}
            <div
              className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${method.color} opacity-20 rounded-full blur-2xl pointer-events-none`}
            ></div>

            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center shadow-inner">
                    {getIcon(method.iconName)}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white group-hover:text-red-300 transition-colors">
                      {method.name}
                    </h3>
                    <span className="text-xs font-semibold text-neutral-400">
                      {method.bankName}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-red-600/30 text-red-300 border border-red-500/30 px-3 py-1 rounded-full">
                  {method.badge}
                </span>
              </div>

              {/* Headline */}
              <p className="text-sm font-semibold text-neutral-200 mt-2">
                {method.headline}
              </p>

              {/* Instructions / Notes */}
              <div className="mt-4 bg-neutral-950/80 rounded-2xl p-4 border border-neutral-800/80 text-xs text-neutral-400 space-y-2">
                <p>{method.notes}</p>
                <div className="flex items-center gap-2 text-emerald-400 font-semibold pt-1">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>Acreditación garantizada en 5 a 15 minutos</span>
                </div>
              </div>
            </div>

            {/* Action button */}
            <div className="mt-6 pt-4 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => handleOpenWhatsApp(method.whatsappPrompt)}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 group-hover:shadow-green-500/20"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Pedir datos de {method.name} a {whatsappUsername}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
