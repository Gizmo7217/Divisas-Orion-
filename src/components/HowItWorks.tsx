import React from 'react';
import { Calculator, Send, CheckCircle, ShieldCheck, Clock, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Cotiza tu monto',
      desc: 'Ingresa la cantidad en pesos o bolívares en la calculadora para conocer el resultado exacto con la tasa del día oficial.',
      icon: <Calculator className="w-6 h-6 text-amber-400" />,
    },
    {
      num: '02',
      title: 'Realiza tu pago',
      desc: 'Transfiere a través de Nequi o Llave en Colombia, o Pago Móvil y Banesco en Venezuela según el sentido de tu giro.',
      icon: <Send className="w-6 h-6 text-red-400" />,
    },
    {
      num: '03',
      title: 'Envía el comprobante',
      desc: 'Compártenos la captura del comprobante por WhatsApp junto con los datos bancarios del beneficiario.',
      icon: <Clock className="w-6 h-6 text-sky-400" />,
    },
    {
      num: '04',
      title: 'Recepción inmediata',
      desc: 'Acreditamos los fondos en la cuenta de destino en 5 a 15 minutos con comprobante oficial garantizado.',
      icon: <CheckCircle className="w-6 h-6 text-emerald-400" />,
    },
  ];

  return (
    <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-neutral-200">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-900 text-xs font-bold uppercase tracking-wider mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-red-700" />
          <span>Proceso Seguro & Rápido</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
          ¿Cómo realizar tu giro con Divisas Orion?
        </h2>
        <p className="mt-2 text-sm sm:text-base text-neutral-600 max-w-lg mx-auto">
          En tan solo 4 sencillos pasos tu dinero llega a las manos de tu familia.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl border-2 border-neutral-200 p-6 shadow-sm hover:shadow-xl hover:border-red-600 transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-black text-red-800 font-mono">
                  {step.num}
                </span>
                <div className="w-12 h-12 rounded-2xl bg-neutral-900 flex items-center justify-center shadow-md">
                  {step.icon}
                </div>
              </div>

              <h3 className="text-lg font-black text-neutral-900 mb-2">
                {step.title}
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {step.desc}
              </p>
            </div>

            <div className="mt-6 pt-3 border-t border-neutral-100 flex items-center text-xs font-bold text-red-800">
              <span>Paso {idx + 1} de 4</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
