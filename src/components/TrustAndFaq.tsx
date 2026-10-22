import React, { useState } from 'react';
import { FAQS, TESTIMONIALS } from '../data/initialData';
import { HelpCircle, ChevronDown, ChevronUp, Star, ShieldCheck, HeartHandshake, Zap } from 'lucide-react';

export const TrustAndFaq: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-neutral-200">
      {/* Testimonials */}
      <div className="mb-14">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>Clientes Satisfechos</span>
          </div>
          <h2 className="text-3xl font-black text-neutral-900 tracking-tight">
            Lo que dicen nuestros clientes
          </h2>
          <p className="mt-1 text-sm text-neutral-600">
            Cientos de envíos exitosos cada semana entre Colombia y Venezuela.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item, idx) => (
            <div
              key={idx}
              className="bg-neutral-50 rounded-3xl border border-neutral-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-neutral-700 italic leading-relaxed mb-4">
                  "{item.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-extrabold text-neutral-900 block">{item.name}</span>
                  <span className="text-neutral-500 text-[11px] font-semibold">{item.city}</span>
                </div>
                <span className="text-[10px] text-neutral-400 bg-neutral-200/60 px-2 py-0.5 rounded-full">
                  {item.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div>
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-900 text-xs font-bold uppercase tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-red-700" />
            <span>Resolvemos tus dudas</span>
          </div>
          <h2 className="text-3xl font-black text-neutral-900 tracking-tight">
            Preguntas Frecuentes
          </h2>
        </div>

        <div className="space-y-3 max-w-3xl mx-auto">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-neutral-300 overflow-hidden shadow-sm transition-all"
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-neutral-900 hover:text-red-800 transition-colors"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-5 h-5 text-red-700 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                )}
              </button>

              {openFaq === idx && (
                <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
