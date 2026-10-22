import React from 'react';
import { Calculator, MessageSquare, CreditCard, CheckCircle, Clock, ShieldCheck, Zap } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Cotiza tu Monto',
      desc: 'Ingresa en la calculadora la cantidad de Pesos o Bolívares que deseas cambiar para ver la tasa del día y la cantidad exacta que recibirá tu beneficiario.',
      icon: <Calculator className="w-6 h-6 text-red-600" />,
      tag: 'Transparente',
    },
    {
      number: '02',
      title: 'Pide los Datos Activos',
      desc: 'Toca el botón de WhatsApp oficial para solicitar los datos bancarios vigentes (Nequi, Llave, Pago Móvil o Banesco) con cupo garantizado.',
      icon: <MessageSquare className="w-6 h-6 text-amber-500" />,
      tag: 'Seguridad',
    },
    {
      number: '03',
      title: 'Transfiere y Envía Comprobante',
      desc: 'Realiza la transferencia desde tu aplicación bancaria y comparte la captura o referencia del pago con nuestro operador @divisasorion.',
      icon: <CreditCard className="w-6 h-6 text-emerald-600" />,
      tag: 'Sin intermediarios',
    },
    {
      number: '04',
      title: 'Acreditación Inmediata',
      desc: 'En un lapso de 5 a 15 minutos se liquida tu giro en la cuenta destino y recibes el comprobante oficial con sello de garantía.',
      icon: <CheckCircle className="w-6 h-6 text-blue-600" />,
      tag: 'Garantizado',
    },
  ];

  return (
    <section id="como-funciona" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-neutral-200">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-100 text-red-900 text-xs font-bold uppercase tracking-wider mb-2">
          <Zap className="w-3.5 h-3.5 text-red-700" />
          <span>Proceso Simple en 4 Pasos</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
          ¿Cómo Realizar tu Giro?
        </h2>
        <p className="mt-2 text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto">
          Rápido, confiable y con atención personalizada directa por WhatsApp.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step) => (
          <div
            key={step.number}
            className="bg-white rounded-3xl p-6 border-2 border-neutral-200/90 shadow-lg relative flex flex-col justify-between hover:border-red-500/50 hover:shadow-xl transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center">
                  {step.icon}
                </div>
                <span className="text-2xl font-black text-neutral-300 font-mono">
                  {step.number}
                </span>
              </div>

              <div className="inline-block px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700 text-[10px] font-bold uppercase tracking-wider mb-2">
                {step.tag}
              </div>

              <h3 className="text-lg font-black text-neutral-900">
                {step.title}
              </h3>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                {step.desc}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
              <Clock className="w-3.5 h-3.5" />
              <span>Tiempo estimado: 5-15 min</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
