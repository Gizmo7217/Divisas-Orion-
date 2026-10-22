import React, { useState } from 'react';
import { FAQS, TESTIMONIALS } from '../data/initialData';
import { Star, ShieldCheck, ChevronDown, ChevronUp, HelpCircle, CheckCircle2 } from 'lucide-react';

export const TrustAndFaq: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-neutral-200">
      {/* Testimonials */}
      <div className="mb-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Confianza y Seguridad Comprobada</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
            Lo Que Dicen Nuestros Clientes
          </h2>
          <p className="mt-2 text-sm sm:text-base text-neutral-600 max-w-xl mx-auto">
            Cientos de familias y comercios confían en Divisas Orion para sus remesas y pantallas streaming.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testi, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-6 border-2 border-neutral-200 shadow-md flex flex-col justify-between hover:border-red-500/30 hover:shadow-lg transition-all"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {Array.from({ length: testi.rating }).map((_, r) => (
                    <Star key={r} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-neutral-700 italic leading-relaxed">
                  "{testi.comment}"
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-neutral-900 text-sm block">
                    {testi.name}
                  </span>
                  <span className="text-xs text-neutral-500 font-medium">
                    {testi.city}
                  </span>
                </div>
                <span className="text-[10px] text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
                  {testi.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-100 text-red-900 text-xs font-bold uppercase tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-red-700" />
            <span>Preguntas Frecuentes</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
            Todo lo que Necesitas Saber
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;

            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border-2 border-neutral-200/90 overflow-hidden shadow-sm transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-neutral-900 text-sm sm:text-base hover:text-red-700 transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className="flex-shrink-0 text-neutral-400">
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
