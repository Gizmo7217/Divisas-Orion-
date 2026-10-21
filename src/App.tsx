import React, { useState, useEffect } from 'react';
import { CurrencyDirection, ExchangeRates } from './types';
import { INITIAL_RATES } from './data/initialData';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { Calculator } from './components/Calculator';
import { QuickTables } from './components/QuickTables';
import { PaymentMethods } from './components/PaymentMethods';
import { StreamingSection } from './components/StreamingSection';
import { HowItWorks } from './components/HowItWorks';
import { TrustAndFaq } from './components/TrustAndFaq';
import { Footer } from './components/Footer';
import { FlyerModal } from './components/FlyerModal';
import { RatesAdminModal } from './components/RatesAdminModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';

export default function App() {
  // Load saved rates or fallback to defaults
  const [rates, setRates] = useState<ExchangeRates>(() => {
    try {
      const saved = localStorage.getItem('divisas_orion_rates');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.whatsappNumber || parsed.whatsappNumber === '573100000000') {
          parsed.whatsappNumber = INITIAL_RATES.whatsappNumber;
        }
        if (!parsed.whatsappUsername) {
          parsed.whatsappUsername = INITIAL_RATES.whatsappUsername;
        }
        if (parsed.copToVesRate === 3.55) {
          parsed.copToVesRate = 3.60;
        }
        const merged = { ...INITIAL_RATES, ...parsed };
        try {
          localStorage.setItem('divisas_orion_rates', JSON.stringify(merged));
        } catch (_) {}
        return merged;
      }
    } catch (e) {
      console.error('Error reading saved rates:', e);
    }
    return INITIAL_RATES;
  });

  const [activeDirection, setActiveDirection] = useState<CurrencyDirection>('COP_TO_VES');
  const [calculatorAmount, setCalculatorAmount] = useState<number | null>(null);
  const [isFlyerModalOpen, setIsFlyerModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('calculadora');

  // Save rates to localStorage
  const handleSaveRates = (newRates: ExchangeRates) => {
    setRates(newRates);
    try {
      localStorage.setItem('divisas_orion_rates', JSON.stringify(newRates));
    } catch (e) {
      console.error('Error saving rates:', e);
    }
  };

  const handleSelectAmountFromTable = (amount: number, dir: CurrencyDirection) => {
    setActiveDirection(dir);
    setCalculatorAmount(amount);
    const calcEl = document.getElementById('calculadora');
    if (calcEl) {
      calcEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 font-sans flex flex-col selection:bg-red-700 selection:text-white">
      {/* Navigation Header */}
      <Header
        rates={rates}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenFlyerModal={() => setIsFlyerModalOpen(true)}
        activeSection={activeSection}
        onNavigate={scrollToSection}
      />

      <main className="flex-1">
        {/* Hero Banner with Rate of the Day */}
        <HeroBanner
          rates={rates}
          activeDirection={activeDirection}
          onSelectDirection={(dir) => {
            setActiveDirection(dir);
            scrollToSection('calculadora');
          }}
          onOpenFlyerModal={() => setIsFlyerModalOpen(true)}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
        />

        {/* Live Interactive Remittance Calculator */}
        <Calculator
          rates={rates}
          direction={activeDirection}
          onDirectionChange={setActiveDirection}
          onScrollToPayments={() => scrollToSection('pagos')}
          selectedAmount={calculatorAmount}
        />

        {/* Quick Tables matching the photo pill capsules */}
        <QuickTables
          rates={rates}
          onSelectAmount={handleSelectAmountFromTable}
          onOpenFlyerModal={() => setIsFlyerModalOpen(true)}
        />

        {/* Authorized Payment Methods (Nequi, Llave, Pago Móvil, Banesco) */}
        <PaymentMethods
          whatsappNumber={rates.whatsappNumber}
          whatsappUsername={rates.whatsappUsername}
        />

        {/* Streaming Services (Netflix, Spotify, Crunchyroll, Disney+, HBO, Paramount+, YouTube) */}
        <StreamingSection rates={rates} />

        {/* How It Works Steps */}
        <HowItWorks />

        {/* Testimonials & FAQs */}
        <TrustAndFaq />
      </main>

      {/* Footer */}
      <Footer
        rates={rates}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenFlyerModal={() => setIsFlyerModalOpen(true)}
      />

      {/* Modals */}
      <FlyerModal
        rates={rates}
        isOpen={isFlyerModalOpen}
        onClose={() => setIsFlyerModalOpen(false)}
      />

      <RatesAdminModal
        rates={rates}
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onSave={handleSaveRates}
      />

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp rates={rates} />
    </div>
  );
}
