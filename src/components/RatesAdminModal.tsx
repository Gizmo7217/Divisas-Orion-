import React, { useState } from 'react';
import { ExchangeRates } from '../types';
import { INITIAL_RATES } from '../data/initialData';
import { getColombiaDate } from '../utils/formatters';
import { Settings, Save, RotateCcw, X, ShieldAlert, Check } from 'lucide-react';

interface RatesAdminModalProps {
  rates: ExchangeRates;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newRates: ExchangeRates) => void;
}

export const RatesAdminModal: React.FC<RatesAdminModalProps> = ({
  rates,
  isOpen,
  onClose,
  onSave,
}) => {
  const [copToVes, setCopToVes] = useState<string>(rates.copToVesRate.toString());
  const [vesToCop, setVesToCop] = useState<string>(rates.vesToCopRate.toString());
  const [whatsapp, setWhatsapp] = useState<string>(rates.whatsappNumber);
  const [whatsappUsername, setWhatsappUsername] = useState<string>(rates.whatsappUsername || '@divisasorion');
  const [slogan, setSlogan] = useState<string>(rates.slogan);
  const [showSavedNotification, setShowSavedNotification] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedCopToVes = parseFloat(copToVes.replace(',', '.')) || 3.60;
    const parsedVesToCop = parseFloat(vesToCop.replace(',', '.')) || 2.75;

    const updated: ExchangeRates = {
      ...rates,
      copToVesRate: parsedCopToVes,
      vesToCopRate: parsedVesToCop,
      whatsappNumber: whatsapp.trim() || rates.whatsappNumber,
      whatsappUsername: whatsappUsername.trim() || '@divisasorion',
      slogan: slogan.trim() || rates.slogan,
      lastUpdated: getColombiaDate(),
    };

    onSave(updated);
    setShowSavedNotification(true);
    setTimeout(() => {
      setShowSavedNotification(false);
      onClose();
    }, 1200);
  };

  const handleResetDefaults = () => {
    setCopToVes(INITIAL_RATES.copToVesRate.toString());
    setVesToCop(INITIAL_RATES.vesToCopRate.toString());
    setWhatsapp(INITIAL_RATES.whatsappNumber);
    setWhatsappUsername(INITIAL_RATES.whatsappUsername || '@divisasorion');
    setSlogan(INITIAL_RATES.slogan);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-neutral-900 border-2 border-red-600/50 rounded-3xl shadow-2xl p-6 sm:p-8 text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-red-800 flex items-center justify-center text-white border border-red-500/40">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white">Administrador de Tasas</h3>
            <p className="text-xs text-neutral-400">Actualiza las tasas del día y contacto</p>
          </div>
        </div>

        {showSavedNotification && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>¡Tasas actualizadas con éxito en toda la web!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rate 1: COP to VES (Division) */}
          <div>
            <label className="block text-xs font-bold text-red-300 uppercase tracking-wider mb-1">
              Tasa COP ➔ VES (Pesos a Bolívares):
            </label>
            <div className="relative">
              <input
                type="text"
                value={copToVes}
                onChange={(e) => setCopToVes(e.target.value)}
                placeholder="Ej. 3.60"
                className="w-full bg-neutral-950 border-2 border-neutral-700 focus:border-red-500 rounded-xl py-2.5 px-3 text-lg font-black text-white outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-500">
                División (÷)
              </span>
            </div>
            <span className="text-[11px] text-neutral-400">
              Ejemplo: $ 100.000 COP ÷ {copToVes} = Bs
            </span>
          </div>

          {/* Rate 2: VES to COP (Multiplication) */}
          <div>
            <label className="block text-xs font-bold text-red-300 uppercase tracking-wider mb-1">
              Tasa VES ➔ COP (Bolívares a Pesos):
            </label>
            <div className="relative">
              <input
                type="text"
                value={vesToCop}
                onChange={(e) => setVesToCop(e.target.value)}
                placeholder="Ej. 2.75"
                className="w-full bg-neutral-950 border-2 border-neutral-700 focus:border-red-500 rounded-xl py-2.5 px-3 text-lg font-black text-white outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-500">
                Multiplicación (×)
              </span>
            </div>
            <span className="text-[11px] text-neutral-400">
              Ejemplo: 10.000 Bs × {vesToCop} = COP
            </span>
          </div>

          {/* Public Username */}
          <div>
            <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
              Nombre de Usuario Público (Visible):
            </label>
            <input
              type="text"
              value={whatsappUsername}
              onChange={(e) => setWhatsappUsername(e.target.value)}
              placeholder="@divisasorion"
              className="w-full bg-neutral-950 border-2 border-neutral-700 focus:border-amber-400 rounded-xl py-2.5 px-3 text-sm font-bold text-amber-300 outline-none font-mono"
            />
            <span className="text-[11px] text-neutral-400">
              Este nombre de usuario es el que verán los clientes en la web (el número de teléfono queda oculto por seguridad).
            </span>
          </div>

          {/* WhatsApp Private Number */}
          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
              Número WhatsApp Privado (Solo para enlaces internos):
            </label>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="Ej. 573135459314"
              className="w-full bg-neutral-950 border-2 border-neutral-700 focus:border-red-500 rounded-xl py-2.5 px-3 text-sm font-semibold text-white outline-none"
            />
            <span className="text-[11px] text-neutral-400">
              Número al que se redirigen los mensajes (no se muestra en texto en la web).
            </span>
          </div>

          {/* Slogan */}
          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
              Eslogan del negocio:
            </label>
            <input
              type="text"
              value={slogan}
              onChange={(e) => setSlogan(e.target.value)}
              placeholder="Cambia rápido y seguro con nosotros"
              className="w-full bg-neutral-950 border-2 border-neutral-700 focus:border-red-500 rounded-xl py-2.5 px-3 text-sm font-semibold text-white outline-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-3.5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer</span>
            </button>

            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Tasas</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
