import React, { useState } from 'react';
import { PAYMENT_METHODS } from '../data/initialData';
import { Smartphone, Key, Zap, Building2, MessageCircle, ShieldCheck, ArrowRight, Info, CheckCircle2, Lock } from 'lucide-react';

interface PaymentMethodsProps {
  whatsappNumber?: string;
}

export const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  whatsappNumber = '573135459314',
}) => {
  const [selectedCountry, setSelectedCountry] = useState<'Colombia' | 'Venezuela'>('Colombia');

  const methods = PAYMENT_METHODS.filter((m) => m.country === selectedCountry);

  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');

  const handleOpenWhatsApp = (promptText: string) => {
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(promptText)}`;
    window.open(url, '_blank');
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
          <span>Canales de Transferencia</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
          Métodos de Pago Autorizados
        </h2>
        <p className="mt-2 text-sm sm:text-base text-neutral-600 max-w-xl mx-auto">
          Aceptamos los principales métodos de pago en Colombia y Venezuela.
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

      {/* Main Notice: Consultar datos por WhatsApp */}
      <div className="mb-8 bg-gradient-to-r from-red-950 via-[#450204] to-neutral-950 border-2 border-red-600/50 rounded-3xl p-6 sm:p-7 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 block">
              Seguridad y Verificación Oficial
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Consultar datos para transferir por WhatsApp
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-xl leading-relaxed">
              Por seguridad y para garantizar la disponibilidad inmediata de fondos, los datos bancarios oficiales activos se entregan directamente a través de nuestro WhatsApp oficial: <span className="font-bold text-white bg-black/40 px-2 py-0.5 rounded">+57 3135459314</span>.
            </p>
          </div>
        </div>

        <button
          onClick={() => handleOpenWhatsApp('Hola Divisas Orion, deseo consultar los datos activos para transferir.')}
          className="whitespace-nowrap bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-black text-sm px-6 py-3.5 rounded-2xl shadow-xl shadow-emerald-950/60 hover:shadow-emerald-500/40 transition-all flex items-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <MessageCircle className="w-5 h-5 fill-white" />
          <span>Consultar Datos por WhatsApp</span>
        </button>
      </div>

      {/* Cards Grid: Nequi & Llave / Pago Móvil & Banesco */}
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

              {/* Consultation Card replacing static numbers */}
              <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Consultar datos para transferir por WhatsApp</span>
                </div>

                <div className="text-sm font-bold text-neutral-200">
                  Línea Oficial: <span className="text-emerald-400 font-mono text-base font-black">+57 3135459314</span>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed">
                  {method.notes}
                </p>

                <button
                  type="button"
                  onClick={() => handleOpenWhatsApp(method.whatsappPrompt)}
                  className="w-full mt-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Pedir datos de {method.name} por WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Note & footer */}
            <div className="mt-5 pt-4 border-t border-neutral-800 flex items-start gap-2 text-xs text-neutral-400">
              <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Una vez recibidos los datos y realizada la transferencia, envía el capture al mismo chat para validar y hacer la entrega en minutos.
              </p>
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
              Atención directa y garantizada:
            </span>
            Escríbenos al <span className="font-bold text-red-900">+57 3135459314</span> indicando el monto y método preferido para enviarte los datos de pago al instante.
          </div>
        </div>
        <button
          onClick={() => handleOpenWhatsApp('Hola Divisas Orion, deseo cotizar y consultar datos para transferir.')}
          className="whitespace-nowrap px-4 py-2.5 bg-[#7B0606] hover:bg-red-800 text-white font-bold text-xs rounded-xl transition-all shadow flex items-center gap-1.5"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Escribir al WhatsApp</span>
        </button>
      </div>
    </section>
  );
};
