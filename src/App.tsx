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
import { SatisfiedClients } from './components/SatisfiedClients';
import { TrustAndFaq } from './components/TrustAndFaq';
import { Footer } from './components/Footer';
import { FlyerModal } from './components/FlyerModal';
import { OrionBotChat } from './components/OrionBotChat';
import { getColombiaDate, launchProtectedWhatsApp } from './utils/formatters';
import { saveRatesToCloud, listenToCloudRates } from './lib/firebase';

export default function App() {
  // Load saved rates or fallback to defaults
  const [rates, setRates] = useState<ExchangeRates>(() => {
    const todayColombia = getColombiaDate();
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
        if (!parsed.whatsappLink || parsed.whatsappLink.trim() === '') {
          parsed.whatsappLink = 'https://wa.link/lreunw';
        }
        parsed.copToVesRate = 3.50;
        const merged = {
          ...INITIAL_RATES,
          ...parsed,
          copToVesRate: 3.50,
          vesToCopRate: 3.65,
          whatsappLink: 'https://wa.link/lreunw', // Always prioritize the user's official encrypted link
          lastUpdated: todayColombia, // Always active date for today in Colombia
        };
        try {
          localStorage.setItem('divisas_orion_rates', JSON.stringify(merged));
        } catch (_) {}
        return merged;
      }
    } catch (e) {
      console.error('Error reading saved rates:', e);
    }
    return { ...INITIAL_RATES, lastUpdated: todayColombia };
  });

  const [activeDirection, setActiveDirection] = useState<CurrencyDirection>('COP_TO_VES');
  const [calculatorAmount, setCalculatorAmount] = useState<number | null>(null);
  const [isFlyerModalOpen, setIsFlyerModalOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('calculadora');

  // Listen to cloud rates from Firestore across all devices
  useEffect(() => {
    // Sync current default rates to Firestore cloud
    saveRatesToCloud({
      ...INITIAL_RATES,
      copToVesRate: 3.50,
      vesToCopRate: 3.65,
    });

    const unsub = listenToCloudRates((cloudRates) => {
      if (cloudRates && typeof cloudRates.copToVesRate === 'number' && typeof cloudRates.vesToCopRate === 'number') {
        setRates((prev) => ({
          ...prev,
          ...cloudRates,
        }));
      }
    });
    return () => unsub();
  }, []);

  // Direct 1-click WhatsApp redirect using encrypted wa.link/lreunw
  const handleOpenSecureWhatsApp = (messageText: string) => {
    launchProtectedWhatsApp({
      phone: rates.whatsappNumber,
      text: messageText,
      customLink: rates.whatsappLink || 'https://wa.link/lreunw',
    });
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
        onOpenFlyerModal={() => setIsFlyerModalOpen(true)}
        activeSection={activeSection}
        onNavigate={scrollToSection}
        onOpenWhatsApp={handleOpenSecureWhatsApp}
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
        />

        {/* Live Interactive Remittance Calculator */}
        <Calculator
          rates={rates}
          direction={activeDirection}
          onDirectionChange={setActiveDirection}
          onScrollToPayments={() => scrollToSection('pagos')}
          selectedAmount={calculatorAmount}
          onOpenWhatsApp={handleOpenSecureWhatsApp}
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
          whatsappLink={rates.whatsappLink}
          onOpenWhatsApp={handleOpenSecureWhatsApp}
        />

        {/* Banner Próximamente Servicios de Streaming & Apps en Orion Service */}
        <StreamingSection />

        {/* How It Works Steps */}
        <HowItWorks />

        {/* Clientes Satisfechos (Testimonios y rutas Colombia ➔ Venezuela) */}
        <SatisfiedClients
          rates={rates}
          onOpenWhatsApp={handleOpenSecureWhatsApp}
        />

        {/* FAQs */}
        <TrustAndFaq />
      </main>

      {/* Footer */}
      <Footer
        rates={rates}
        onOpenFlyerModal={() => setIsFlyerModalOpen(true)}
        onOpenWhatsApp={handleOpenSecureWhatsApp}
      />

      {/* Modals */}
      <FlyerModal
        rates={rates}
        isOpen={isFlyerModalOpen}
        onClose={() => setIsFlyerModalOpen(false)}
      />


      {/* Floating Mascot with OrionBot AI Chat */}
      <OrionBotChat
        rates={rates}
        onOpenWhatsApp={handleOpenSecureWhatsApp}
      />
    </div>
  );
}
