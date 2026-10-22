import React, { useState } from 'react';
import { SATISFIED_CLIENTS } from '../data/initialData';
import { ClientReview, ExchangeRates } from '../types';
import { Star, ShieldCheck, CheckCircle2, MessageCircle, Heart, Users, Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { launchProtectedWhatsApp } from '../utils/formatters';

import { ExperienceFormModal } from './ExperienceFormModal';

interface SatisfiedClientsProps {
  rates: ExchangeRates;
  onOpenWhatsApp?: (msg: string, title?: string) => void;
}

export const SatisfiedClients: React.FC<SatisfiedClientsProps> = ({ rates, onOpenWhatsApp }) => {
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'Colombia' | 'Venezuela'>('ALL');
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState<boolean>(false);

  // Load reviews from localStorage or fallback to defaults
  const [reviews, setReviews] = useState<ClientReview[]>(() => {
    try {
      const saved = localStorage.getItem('divisas_orion_client_reviews');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {}
    return SATISFIED_CLIENTS;
  });

  const handleAddReview = (newReview: ClientReview) => {
    setReviews((prev) => {
      const updated = [newReview, ...prev];
      try {
        localStorage.setItem('divisas_orion_client_reviews', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const filteredReviews =
    selectedFilter === 'ALL'
      ? reviews
      : reviews.filter((client) => client.country === selectedFilter);

  const handleOpenExperienceModal = () => {
    setIsExperienceModalOpen(true);
  };

  return (
    <section id="testimonios" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 border border-red-200 text-red-900 text-xs font-bold uppercase tracking-wider mb-3">
          <Heart className="w-3.5 h-3.5 text-red-700 fill-red-700" />
          <span>Comunidad Verificada • Colombia & Venezuela</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight">
          Clientes Satisfechos
        </h2>

        <p className="mt-3 text-sm sm:text-base text-neutral-600 leading-relaxed">
          La confianza de miles de familias y usuarios que envían sus giros, comercian USDT Binance y adquieren suscripciones de IA con{' '}
          <strong className="text-neutral-900 font-bold">Divisas Orion</strong> todos los días.
        </p>

        {/* Live Social Proof Stats */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-3.5 border border-neutral-200 shadow-sm text-center">
            <div className="flex items-center justify-center gap-1 text-amber-400 font-black text-lg sm:text-xl">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span>4.9 / 5.0</span>
            </div>
            <div className="text-[11px] text-neutral-500 font-medium mt-0.5">
              Calificación Promedio
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3.5 border border-neutral-200 shadow-sm text-center">
            <div className="text-emerald-600 font-black text-lg sm:text-xl">
              5 - 15 min
            </div>
            <div className="text-[11px] text-neutral-500 font-medium mt-0.5">
              Acreditación Promedio
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3.5 border border-neutral-200 shadow-sm text-center">
            <div className="text-neutral-900 font-black text-lg sm:text-xl">
              +5.000
            </div>
            <div className="text-[11px] text-neutral-500 font-medium mt-0.5">
              Operaciones Exitosas
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3.5 border border-neutral-200 shadow-sm text-center">
            <div className="text-red-700 font-black text-lg sm:text-xl flex items-center justify-center gap-1">
              <ShieldCheck className="w-5 h-5 text-red-600" />
              <span>100%</span>
            </div>
            <div className="text-[11px] text-neutral-500 font-medium mt-0.5">
              Fondos Garantizados
            </div>
          </div>
        </div>

        {/* Country Filter Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedFilter('ALL')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              selectedFilter === 'ALL'
                ? 'bg-neutral-900 text-white shadow-md'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
            }`}
          >
            Todos los testimonios ({reviews.length})
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter('Colombia')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedFilter === 'Colombia'
                ? 'bg-[#7B0606] text-white shadow-md'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
            }`}
          >
            <span>🇨🇴</span>
            <span>Desde Colombia ({reviews.filter((c) => c.country === 'Colombia').length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter('Venezuela')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedFilter === 'Venezuela'
                ? 'bg-[#7B0606] text-white shadow-md'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
            }`}
          >
            <span>🇻🇪</span>
            <span>Desde Venezuela ({reviews.filter((c) => c.country === 'Venezuela').length})</span>
          </button>
        </div>
      </div>

      {/* Testimonials Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReviews.map((client) => {
          const initials = client.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2);

          return (
            <div
              key={client.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-neutral-200/80 shadow-md hover:shadow-xl hover:border-red-500/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Header: User Info & Route */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    {/* User Avatar */}
                    <div
                      className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${client.avatarColor} text-white font-black text-sm flex items-center justify-center shadow-md flex-shrink-0`}
                    >
                      {initials}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-neutral-900 text-sm sm:text-base">
                          {client.name}
                        </span>
                        {client.verified && (
                          <span
                            title="Operación Verificada"
                            className="inline-flex items-center text-emerald-600"
                          >
                            <CheckCircle2 className="w-4 h-4 fill-emerald-100" />
                          </span>
                        )}
                      </div>

                      {/* Origin & Destination route */}
                      <div className="flex items-center gap-1 text-[11px] text-neutral-500 font-medium mt-0.5">
                        <span className="text-sm">{client.countryFlag}</span>
                        <span>{client.originCity}</span>
                        <ArrowRight className="w-3 h-3 text-neutral-400 inline" />
                        <span>{client.destinationCity.split(',')[0]}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] text-neutral-400 font-medium whitespace-nowrap bg-neutral-100 px-2 py-0.5 rounded-full">
                    {client.timeAgo}
                  </span>
                </div>

                {/* Rating Stars & Operation Badge */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: client.rating }).map((_, starIdx) => (
                      <Star
                        key={starIdx}
                        className="w-4 h-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>

                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200">
                    {client.operationType}
                  </span>
                </div>

                {/* Testimonial Quote */}
                <p className="text-xs sm:text-sm text-neutral-700 italic leading-relaxed">
                  "{client.comment}"
                </p>
              </div>

              {/* Bottom Footer Info */}
              <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
                <span className="flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Transferencia completada</span>
                </span>
                <span className="font-mono text-[10px] text-neutral-400">
                  Vía WhatsApp @divisasorion
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Community Invite Footer Banner */}
      <div className="mt-12 bg-gradient-to-r from-neutral-900 via-[#1e0204] to-neutral-900 border-2 border-red-500/30 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-black text-white">
              ¿Ya realizaste tu transacción con nosotros?
            </h4>
            <p className="text-xs sm:text-sm text-neutral-300 mt-0.5">
              Tu opinión ayuda a conectar y dar tranquilidad a miles de familias entre Colombia y Venezuela.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenExperienceModal}
          className="whitespace-nowrap bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-lg transition-all flex items-center gap-2 transform hover:scale-105"
        >
          <MessageCircle className="w-4 h-4 fill-neutral-950" />
          <span>Compartir Mi Experiencia</span>
        </button>
      </div>

      {/* Experience Form Modal */}
      <ExperienceFormModal
        isOpen={isExperienceModalOpen}
        onClose={() => setIsExperienceModalOpen(false)}
        onSubmitReview={handleAddReview}
        rates={rates}
      />
    </section>
  );
};
