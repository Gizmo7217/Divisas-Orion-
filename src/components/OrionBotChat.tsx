import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Sparkles, ExternalLink, RefreshCw } from 'lucide-react';
import { ExchangeRates } from '../types';
import { launchProtectedWhatsApp, isBusinessOpenColombia } from '../utils/formatters';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

interface OrionBotChatProps {
  rates: ExchangeRates;
  onOpenWhatsApp?: (msg: string, title?: string) => void;
}

export const OrionBotChat: React.FC<OrionBotChatProps> = ({ rates, onOpenWhatsApp }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showBubble, setShowBubble] = useState<boolean>(true);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isBusinessOpen, setIsBusinessOpen] = useState<boolean>(() => isBusinessOpenColombia());
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const mascotImg = '/assets/aistudio/1793807393048_3b23d3b2.jpg';

  // Check schedule periodically
  useEffect(() => {
    const checkSchedule = () => {
      setIsBusinessOpen(isBusinessOpenColombia());
    };
    const interval = setInterval(checkSchedule, 30000);
    return () => clearInterval(interval);
  }, []);

  // Initial welcome message from OrionBot
  const initialMessage: Message = {
    id: 'welcome-1',
    role: 'model',
    content: `¡Hola! 👋 Soy **OrionBot**, tu asistente virtual con inteligencia artificial de Divisas Orion 🤖.\n\nEstoy aquí para resolver tus dudas sobre:\n• 📊 **Tasas del día y cálculos** (COP ÷ ${rates.copToVesRate.toString().replace('.', ',')} | VES × ${rates.vesToCopRate.toString().replace('.', ',')})\n• ⏰ **Horarios de atención** (8:00 AM a 10:00 PM)\n• 💳 **Medios de pago** (Nequi, Llave, Pago Móvil, Banesco)\n• 🔒 **Referencias y seguridad**\n\n¿En qué puedo ayudarte hoy?`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  const [messages, setMessages] = useState<Message[]>([initialMessage]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 250);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
          rates: {
            copToVesRate: rates.copToVesRate,
            vesToCopRate: rates.vesToCopRate,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      const botReply = data.reply || 'Disculpa, no pude procesar la respuesta en este momento. Puedes comunicarte por nuestro enlace oficial.';

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        role: 'model',
        content: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error fetching OrionBot reply:', error);

      // Intelligent local calculation fallback
      const p = text.toLowerCase();
      const copRate = rates.copToVesRate;
      const vesRate = rates.vesToCopRate;

      // Extract amount
      let amount: number | null = null;
      const milMatch = p.match(/(\d+(?:[.,]\d+)?)\s*(?:mil|k)\b/i);
      if (milMatch) {
        const base = parseFloat(milMatch[1].replace(',', '.'));
        if (!isNaN(base) && base > 0) amount = Math.round(base * 1000);
      }
      if (!amount) {
        const numMatches = p.match(/(?:[$]|\b)(\d{1,3}(?:\.\d{3})+(?:,\d+)?|\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+)(?:[$]|\b)/g);
        if (numMatches) {
          for (const raw of numMatches) {
            let numStr = raw.replace(/[$]/g, '').trim();
            if (/^\d{1,3}(\.\d{3})+$/.test(numStr)) numStr = numStr.replace(/\./g, '');
            else if (/^\d{1,3}(,\d{3})+$/.test(numStr)) numStr = numStr.replace(/,/g, '');
            const val = parseFloat(numStr);
            if (val > 0 && val !== 2026 && val !== 3.50 && val !== 3.60 && val !== 3.70 && val !== 3.65 && val !== 2.75 && val !== 2.65 && val !== 350 && val !== 360 && val !== 370 && val !== 365 && val !== 275 && val !== 265) {
              amount = val;
              break;
            }
          }
        }
      }

      let fallbackReply = '';
      if (amount && amount > 0) {
        const isVes = (p.includes('bolivar') || p.includes('bs')) && (
          p.includes('a peso') || p.includes('en peso') || p.includes('tengo bolivar') ||
          p.includes('tengo bs') || p.includes('bolivares a') || p.includes('bs a') || !p.includes('peso')
        );
        if (!isVes) {
          const exactVES = amount / copRate;
          const roundedVES = Math.round(exactVES);
          fallbackReply = `👋 **¡Con gusto te cotizo tu giro! Aquí tienes el cálculo exacto:**\n\n` +
            `🇨🇴 **Monto a enviar en Colombia:** $ ${amount.toLocaleString('es-CO')} COP\n` +
            `📊 **Tasa del día:** ÷ ${copRate.toString().replace('.', ',')} (División oficial)\n` +
            `🇻🇪 **Recibes en Venezuela (Exacto):** ${exactVES.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs\n` +
            `🔢 **Monto redondeado:** ${roundedVES.toLocaleString('es-CO')} Bs\n\n` +
            `📝 **Desglose oficial:**\n$ ${amount.toLocaleString('es-CO')} COP ÷ ${copRate.toString().replace('.', ',')} = **${exactVES.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs**\n\n` +
            `💳 **Medios de pago:** Nequi o Llave (Bre-B / Transfiya / Bancolombia / Davivienda)\n` +
            `⚡ **Acreditación:** Inmediata por Pago Móvil o Banesco\n\n` +
            `¿Deseas realizar este cambio ahora mismo? Escríbenos a nuestro WhatsApp oficial:\n👉 https://wa.link/lreunw (@divisasorion)`;
        } else {
          const exactCOP = amount * vesRate;
          fallbackReply = `👋 **¡Con gusto te cotizo tu giro! Aquí tienes el cálculo exacto:**\n\n` +
            `🇻🇪 **Monto a enviar en Venezuela:** ${amount.toLocaleString('es-CO')} Bs\n` +
            `📊 **Tasa del día:** × ${vesRate.toString().replace('.', ',')} (Multiplicación oficial)\n` +
            `🇨🇴 **Recibes en Colombia:** $ ${Math.round(exactCOP).toLocaleString('es-CO')} COP\n\n` +
            `📝 **Desglose oficial:**\n${amount.toLocaleString('es-CO')} Bs × ${vesRate.toString().replace('.', ',')} = **$ ${Math.round(exactCOP).toLocaleString('es-CO')} COP**\n\n` +
            `💳 **Medios de pago:** Pago Móvil (todos los bancos) o Banesco\n` +
            `⚡ **Acreditación:** Inmediata a Nequi o cualquier banco por Llave\n\n` +
            `¿Deseas realizar este cambio ahora mismo? Escríbenos a nuestro WhatsApp oficial:\n👉 https://wa.link/lreunw (@divisasorion)`;
        }
      } else {
        fallbackReply = `¡Hola! Soy OrionBot 🤖 Te informo que la tasa activa de Pesos a Bolívares es división ÷ **${copRate.toString().replace('.', ',')}** y de Bolívares a Pesos es multiplicación × **${vesRate.toString().replace('.', ',')}**. Nuestro horario es de 8:00 AM a 10:00 PM. Si deseas hablar con un asesor humano para coordinar tu giro, ingresa a nuestro enlace seguro: https://wa.link/lreunw`;
      }

      const fallbackMessage: Message = {
        id: `bot-${Date.now()}`,
        role: 'model',
        content: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAdviserWhatsApp = () => {
    const msg = 'Hola Divisas Orion, deseo hablar con un asesor humano para realizar una consulta y coordinar un giro.';
    if (onOpenWhatsApp) {
      onOpenWhatsApp(msg, 'Atención Divisas Orion');
    } else {
      launchProtectedWhatsApp({
        phone: rates.whatsappNumber,
        text: msg,
        customLink: rates.whatsappLink || 'https://wa.link/lreunw',
      });
    }
  };

  const handleResetChat = () => {
    setMessages([initialMessage]);
  };

  // Quick suggestion chips
  const quickQuestions = [
    '¿A cuánto está el cambio de Pesos a Bolívares?',
    '¿A cuánto está el cambio de Bolívares a Pesos?',
    '¿Cuál es el horario de atención?',
    '¿Cuáles métodos de pago reciben?',
    'Quiero hablar con un asesor humano',
  ];

  return (
    <>
      {/* ========================================================================= */}
      {/* FLOATING MASCOT & SPEECH BUBBLE (Bottom Right)                            */}
      {/* ========================================================================= */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end pointer-events-none">
        {/* Floating Greeting Speech Bubble */}
        {!isOpen && showBubble && (
          <div
            onClick={() => {
              setIsOpen(true);
              setShowBubble(false);
            }}
            className="pointer-events-auto mb-2 cursor-pointer bg-white/95 backdrop-blur-md text-neutral-900 rounded-2xl shadow-2xl p-3.5 pr-8 border-2 border-red-500/40 text-xs max-w-[270px] sm:max-w-xs relative animate-bounce transition-all hover:scale-102 hover:border-red-600"
          >
            {/* Close button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowBubble(false);
              }}
              className="absolute top-2.5 right-2.5 text-neutral-400 hover:text-neutral-700 p-0.5 rounded-full transition-colors"
              title="Cerrar saludo"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="font-black text-[#7B0606] text-xs">OrionBot IA en Vivo</span>
            </div>

            <p className="font-extrabold text-neutral-800 text-[13px] mt-1 leading-snug">
              ¡Hola! Soy OrionBot 🤖
            </p>
            <p className="text-neutral-600 text-xs mt-0.5">
              ¿En qué puedo ayudarte? Tócame para resolver tus dudas sobre tasas, cálculos y giros.
            </p>
          </div>
        )}

        {/* Floating Mascot Avatar Button */}
        {!isOpen && (
          <button
            type="button"
            onClick={() => {
              setIsOpen(true);
              setShowBubble(false);
            }}
            className="pointer-events-auto group relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-white via-neutral-100 to-red-100 border-4 border-red-600 shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 hover:shadow-red-900/50"
            title="Abrir chat con OrionBot IA"
          >
            {/* Ambient Pulse Ring */}
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-30"></span>

            {/* Mascot Image */}
            <div className="w-full h-full rounded-full overflow-hidden p-1 flex items-center justify-center bg-white">
              <img
                src={mascotImg}
                alt="OrionBot Mascota"
                className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            {/* Online Green Badge */}
            <span className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center shadow-md">
              <span className="w-2 h-2 bg-white rounded-full"></span>
            </span>

            {/* AI Sparkle Badge */}
            <span className="absolute -top-1 -left-1 bg-red-700 text-white rounded-full p-1 shadow border border-white">
              <Sparkles className="w-3 h-3 animate-spin" style={{ animationDuration: '4s' }} />
            </span>
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* ORIONBOT CHAT WINDOW MODAL / DRAWER                                       */}
      {/* ========================================================================= */}
      {isOpen && (
        <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-1.5rem)] sm:w-[410px] h-[600px] max-h-[88vh] bg-gradient-to-b from-neutral-950 via-[#180a0a] to-[#240808] text-white rounded-3xl shadow-2xl border-2 border-red-600/70 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-red-950 via-[#4c0505] to-[#7B0606] border-b border-red-700/60 flex items-center justify-between relative shadow-md">
            <div className="flex items-center gap-3">
              {/* Mascot Avatar with frame */}
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-amber-300 bg-white p-0.5 shadow flex-shrink-0">
                <img
                  src={mascotImg}
                  alt="OrionBot Avatar"
                  className="w-full h-full object-contain"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border border-white rounded-full"></span>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-base sm:text-lg text-white tracking-tight flex items-center gap-1">
                    <span>OrionBot</span>
                    <Bot className="w-4 h-4 text-amber-300" />
                  </h3>
                  <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-400/40">
                    IA
                  </span>
                </div>
                <p className="text-[11px] text-red-200 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                  <span>En línea • Asistente Divisas Orion</span>
                </p>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                className="p-1.5 text-neutral-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Reiniciar chat"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-neutral-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Cerrar chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Adviser Banner (WhatsApp Oficial wa.link) */}
          <div className="bg-black/40 border-b border-red-900/40 px-3.5 py-2 flex items-center justify-between gap-2 text-xs">
            <span className="text-neutral-300 text-[11px] truncate">
              ¿Prefieres atención con una persona real?
            </span>
            <button
              type="button"
              onClick={handleOpenAdviserWhatsApp}
              className="flex-shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all shadow-sm"
              title="Abrir WhatsApp oficial"
            >
              <MessageCircle className="w-3 h-3 fill-white" />
              <span>Hablar por WhatsApp</span>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-sm selection:bg-red-700 selection:text-white">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              const hasWaLink = msg.content.includes('wa.link/lreunw');

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 rounded-full overflow-hidden border border-amber-400 bg-white p-0.5 flex-shrink-0 mt-0.5">
                      <img src={mascotImg} alt="Bot" className="w-full h-full object-contain" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-3 shadow-md ${
                      isUser
                        ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-tr-none'
                        : 'bg-neutral-900/90 border border-red-900/60 text-neutral-100 rounded-tl-none'
                    }`}
                  >
                    <div className="whitespace-pre-line text-xs sm:text-[13px] leading-relaxed">
                      {msg.content}
                    </div>

                    {/* Interactive Button if message references WhatsApp adviser */}
                    {hasWaLink && !isUser && (
                      <div className="mt-2.5 pt-2 border-t border-neutral-700/60">
                        <button
                          type="button"
                          onClick={handleOpenAdviserWhatsApp}
                          className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-white" />
                          <span>Hablar con Asesor en WhatsApp</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    <div
                      className={`text-[9px] mt-1 text-right ${
                        isUser ? 'text-red-200' : 'text-neutral-500'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-start gap-2.5 justify-start animate-in fade-in duration-200">
                <div className="w-7 h-7 rounded-full overflow-hidden border border-amber-400 bg-white p-0.5 flex-shrink-0 mt-0.5">
                  <img src={mascotImg} alt="Bot" className="w-full h-full object-contain" />
                </div>
                <div className="bg-neutral-900/90 border border-red-900/60 text-neutral-300 rounded-2xl rounded-tl-none p-3 shadow-md flex items-center gap-2">
                  <span className="text-xs text-neutral-400 font-medium">OrionBot está pensando</span>
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3 pt-2 pb-1 border-t border-red-900/40 bg-neutral-950/70 overflow-x-auto flex gap-1.5 scrollbar-none">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(q)}
                disabled={isLoading}
                className="whitespace-nowrap bg-neutral-900 hover:bg-red-950 text-neutral-300 hover:text-white border border-neutral-700/60 hover:border-red-500/60 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all flex-shrink-0 disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-neutral-950 border-t border-red-900/60 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Escribe tu pregunta a OrionBot..."
              disabled={isLoading}
              className="flex-1 bg-neutral-900 border border-neutral-700 focus:border-red-500 text-white placeholder-neutral-500 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 disabled:opacity-40 text-white p-2.5 rounded-xl transition-all shadow-md flex-shrink-0"
              title="Enviar mensaje"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Privacy Footer */}
          <div className="bg-black px-3 py-1 text-center text-[10px] text-neutral-500 border-t border-neutral-900">
            <span>Privacidad protegida: para atención personal humana usa nuestro acortador oficial wa.link</span>
          </div>
        </div>
      )}
    </>
  );
};
