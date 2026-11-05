import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.NODE_ENV === 'production' && process.env.PORT ? Number(process.env.PORT) : 3000;

  app.use(express.json());

  // Gemini AI Client setup
  const apiKey = process.env.GEMINI_API_KEY || '';
  const ai = new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Smart adviser calculation and response engine
  const formatDots = (n: number, decimals: number = 0) => {
    return n.toLocaleString('es-CO', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  const extractAmountAndDirection = (text: string): { amount: number | null; direction: 'COP_TO_VES' | 'VES_TO_COP' } => {
    const p = text.toLowerCase();

    // Parse amount from text
    let amount: number | null = null;

    // Pattern 1: e.g. "137 mil", "137.5 mil", "50k"
    const milMatch = p.match(/(\d+(?:[.,]\d+)?)\s*(?:mil|k)\b/i);
    if (milMatch) {
      const base = parseFloat(milMatch[1].replace(',', '.'));
      if (!isNaN(base) && base > 0) {
        amount = Math.round(base * 1000);
      }
    }

    // Pattern 2: e.g. "137000", "137.000", "137,000", "$ 137000"
    if (!amount) {
      const numMatches = p.match(/(?:[$]|\b)(\d{1,3}(?:\.\d{3})+(?:,\d+)?|\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+)(?:[$]|\b)/g);
      if (numMatches) {
        for (const raw of numMatches) {
          let numStr = raw.replace(/[$]/g, '').trim();
          if (/^\d{1,3}(\.\d{3})+$/.test(numStr)) {
            numStr = numStr.replace(/\./g, '');
          } else if (/^\d{1,3}(,\d{3})+$/.test(numStr)) {
            numStr = numStr.replace(/,/g, '');
          } else if (numStr.includes('.') && numStr.includes(',')) {
            numStr = numStr.replace(/\./g, '').replace(',', '.');
          }
          const val = parseFloat(numStr);
          if (val > 0 && val !== 2026 && val !== 3.65 && val !== 2.75 && val !== 365 && val !== 275) {
            amount = val;
            break;
          }
        }
      }
    }

    // Determine direction
    let direction: 'COP_TO_VES' | 'VES_TO_COP' = 'COP_TO_VES';

    const hasCopKeywords = p.includes('peso') || p.includes('cop') || p.includes('colombia');
    const hasVesKeywords = p.includes('bolivar') || p.includes('bolívares') || p.includes('bolivares') || p.includes('bs') || p.includes('venezuela');

    if (hasCopKeywords && hasVesKeywords) {
      if (
        p.includes('a peso') || p.includes('en peso') || p.includes('a cop') || p.includes('en cop') ||
        p.includes('dan en peso') || p.includes('recibo en peso') || p.includes('tengo bolivar') ||
        p.includes('tengo bs') || p.includes('bolivares a') || p.includes('bolívares a') || p.includes('bs a') ||
        (p.includes('deposito') && (p.includes('bolivar') || p.includes('bs')))
      ) {
        direction = 'VES_TO_COP';
      } else {
        direction = 'COP_TO_VES';
      }
    } else if (hasVesKeywords && !hasCopKeywords) {
      direction = 'VES_TO_COP';
    } else {
      direction = 'COP_TO_VES';
    }

    return { amount, direction };
  };

  const generateLocalFallback = (prompt: string, copRate: number, vesRate: number) => {
    const p = prompt.toLowerCase();
    const { amount, direction } = extractAmountAndDirection(prompt);

    // If an amount is detected, provide an exact calculation like a professional financial adviser
    if (amount && amount > 0) {
      if (direction === 'COP_TO_VES') {
        const exactVES = amount / copRate;
        const roundedVES = Math.round(exactVES);
        const copFormatted = formatDots(amount, 0);
        const exactFormatted = formatDots(exactVES, 2);
        const roundFormatted = formatDots(roundedVES, 0);
        const rateStr = copRate.toString().replace('.', ',');

        return `👋 **¡Con gusto te cotizo tu giro! Aquí tienes el cálculo exacto:**\n\n` +
          `🇨🇴 **Monto a enviar en Colombia:** $ ${copFormatted} COP\n` +
          `📊 **Tasa del día:** ÷ ${rateStr} (División oficial)\n` +
          `🇻🇪 **Recibes en Venezuela (Exacto):** ${exactFormatted} Bs\n` +
          `🔢 **Monto redondeado:** ${roundFormatted} Bs\n\n` +
          `📝 **Desglose oficial:**\n` +
          `$ ${copFormatted} COP ÷ ${rateStr} = **${exactFormatted} Bs**\n\n` +
          `💳 **Medios de pago disponibles en Colombia:** Nequi o Llave (Bre-B / Transfiya desde Bancolombia, Davivienda, BBVA, Dale y demás bancos)\n` +
          `⚡ **Acreditación en Venezuela:** Inmediata por Pago Móvil o cuenta corriente Banesco\n\n` +
          `¿Deseas realizar este cambio ahora mismo? Escríbenos a nuestro WhatsApp oficial para entregarte la cuenta activa:\n` +
          `👉 **WhatsApp Oficial:** https://wa.link/lreunw (@divisasorion)`;
      } else {
        const exactCOP = amount * vesRate;
        const roundedCOP = Math.round(exactCOP);
        const vesFormatted = formatDots(amount, 0);
        const copFormatted = formatDots(roundedCOP, 0);
        const rateStr = vesRate.toString().replace('.', ',');

        return `👋 **¡Con gusto te cotizo tu giro! Aquí tienes el cálculo exacto:**\n\n` +
          `🇻🇪 **Monto a enviar en Venezuela:** ${vesFormatted} Bs\n` +
          `📊 **Tasa del día:** × ${rateStr} (Multiplicación oficial)\n` +
          `🇨🇴 **Recibes en Colombia:** $ ${copFormatted} COP\n\n` +
          `📝 **Desglose oficial:**\n` +
          `${vesFormatted} Bs × ${rateStr} = **$ ${copFormatted} COP**\n\n` +
          `💳 **Medios de pago en Venezuela:** Pago Móvil (todos los bancos) o Banesco a Banesco\n` +
          `⚡ **Acreditación en Colombia:** Inmediata a tu Nequi o cualquier banco por Llave\n\n` +
          `¿Deseas realizar este cambio ahora mismo? Escríbenos a nuestro WhatsApp oficial para entregarte la cuenta activa:\n` +
          `👉 **WhatsApp Oficial:** https://wa.link/lreunw (@divisasorion)`;
      }
    }

    // Questions about rates or general calculation
    if (p.includes('tasa') || p.includes('precio') || p.includes('cambio') || p.includes('cuanto esta') || p.includes('a como')) {
      const copRateStr = copRate.toString().replace('.', ',');
      const vesRateStr = vesRate.toString().replace('.', ',');
      return `📊 **Tasas Oficiales del Día en Divisas Orion:**\n\n` +
        `• 🇨🇴 ➔ 🇻🇪 **Pesos a Bolívares:** División oficial ÷ **${copRateStr}**\n` +
        `  *Ejemplo:* $ 100.000 COP ÷ ${copRateStr} = ${(100000 / copRate).toFixed(2).replace('.', ',')} Bs.\n\n` +
        `• 🇻🇪 ➔ 🇨🇴 **Bolívares a Pesos:** Multiplicación oficial × **${vesRateStr}**\n` +
        `  *Ejemplo:* 100.000 Bs × ${vesRateStr} = $ ${(100000 * vesRate).toLocaleString('es-CO')} COP.\n\n` +
        `💡 *Dime cualquier monto que desees cambiar (ej: "¿cuánto son 50.000 pesos?") y te calculo el valor exacto de inmediato.*`;
    }

    // Questions about business hours
    if (p.includes('horario') || p.includes('hora') || p.includes('abiert') || p.includes('cerrad') || p.includes('atiend') || p.includes('trabaj')) {
      return `⏰ **Horario Oficial de Atención:**\n\n` +
        `Atendemos con total normalidad de **Lunes a Domingo de 8:00 AM a 10:00 PM** (hora de Colombia y Venezuela).\n\n` +
        `• Durante este horario nuestro equipo y calculadora están activos al 100% procesando giros en minutos.\n` +
        `• Fuera de este horario puedes dejar tu solicitud en nuestro canal seguro de WhatsApp y te atenderemos a primera hora de apertura:\n` +
        `👉 https://wa.link/lreunw`;
    }

    // Questions about payment methods
    if (p.includes('pago') || p.includes('nequi') || p.includes('llave') || p.includes('banco') || p.includes('banesco') || p.includes('transfiya') || p.includes('cuenta')) {
      return `💳 **Métodos de Pago Autorizados:**\n\n` +
        `🇨🇴 **En Colombia:**\n` +
        `• **Nequi:** Transferencias directas inmediatas 24/7.\n` +
        `• **Llave (Bre-B / Transfiya):** Transferencias desde Bancolombia, Davivienda, BBVA, Dale o cualquier banco colombiano.\n\n` +
        `🇻🇪 **En Venezuela:**\n` +
        `• **Pago Móvil:** Acreditación inmediata para todos los bancos (Banesco, Banco de Venezuela, Mercantil, Provincial, etc.).\n` +
        `• **Banesco:** Transferencias directas cuenta corriente Banesco a Banesco.\n\n` +
        `⚠️ *Por seguridad, solicita siempre los datos de la cuenta activa antes de transferir a través de nuestro WhatsApp oficial:* https://wa.link/lreunw`;
    }

    // Questions about delivery time or process
    if (p.includes('cuanto tarda') || p.includes('tiempo') || p.includes('demora') || p.includes('como envio') || p.includes('proceso') || p.includes('pasos')) {
      return `⚡ **Tiempo de Entrega y Proceso del Giro:**\n\n` +
        `Nuestros giros son de **acreditación inmediata**:\n` +
        `1️⃣ Nos indicas el monto a cambiar y método de pago.\n` +
        `2️⃣ Te facilitamos los datos de la cuenta activa por WhatsApp.\n` +
        `3️⃣ Envías tu comprobante y verificamos en **5 a 15 minutos**.\n` +
        `4️⃣ Te enviamos el capture del pago realizado con éxito a tu cuenta destino.\n\n` +
        `Comunícate ahora mismo: https://wa.link/lreunw (@divisasorion)`;
    }

    // Questions about trust, security or references
    if (p.includes('segur') || p.includes('confia') || p.includes('referencia') || p.includes('garanti') || p.includes('ubicad')) {
      return `🛡️ **Seguridad y Garantía en Divisas Orion:**\n\n` +
        `• Contamos con más de miles de operaciones exitosas entre Colombia y Venezuela.\n` +
        `• Tasas transparentes sin cobros sorpresa ni comisiones ocultas.\n` +
        `• Transacciones 100% verificadas y acreditación garantizada.\n` +
        `• Atención directa y personalizada en nuestro WhatsApp oficial: https://wa.link/lreunw (@divisasorion)`;
    }

    // Questions about streaming
    if (p.includes('streaming') || p.includes('netflix') || p.includes('pantalla') || p.includes('disney') || p.includes('magis') || p.includes('canva')) {
      return `📺 **Servicios de Streaming y Aplicaciones:**\n\n` +
        `Muy pronto estarán disponibles pantallas y suscripciones de streaming en nuestra página aliada **Orion Service**.\n\n` +
        `En Divisas Orion actualmente nos dedicamos con exclusividad a los cambios de divisas y giros entre Colombia y Venezuela con la mayor rapidez.`;
    }

    // Talking to a human adviser
    if (p.includes('asesor') || p.includes('persona') || p.includes('humano') || p.includes('whatsapp') || p.includes('contacto') || p.includes('hablar') || p.includes('telefono') || p.includes('numero') || p.includes('operador')) {
      return `👋 **Atención Personalizada con un Asesor Humano:**\n\n` +
        `Para coordinar tu giro, recibir los datos de la cuenta activa o hablar directamente con nuestro equipo de atención:\n\n` +
        `🔗 **Enlace Seguro Oficial:** https://wa.link/lreunw\n` +
        `👤 **Usuario Oficial:** @divisasorion\n\n` +
        `¡Escríbenos ahora mismo y con gusto te atenderemos!`;
    }

    // Default polite greetings and helpful response
    return `¡Hola! Soy **OrionBot** 🤖, asistente virtual asesor de Divisas Orion.\n\n` +
      `Te puedo ayudar con:\n` +
      `• 📊 **Cálculo de giros al instante** (ej: *"¿Cuánto me dan por 100.000 pesos?"*)\n` +
      `• ⏰ **Horarios de atención** (8:00 AM a 10:00 PM)\n` +
      `• 💳 **Medios de pago** (Nequi, Llave, Pago Móvil, Banesco)\n` +
      `• 👨‍💼 **Contacto con asesor humano:** https://wa.link/lreunw\n\n` +
      `¿Qué monto o consulta deseas realizar hoy?`;
  };

  // API Route for OrionBot AI Chat
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history, rates } = req.body;
      const copRate = Number(rates?.copToVesRate) || 3.65;
      const vesRate = Number(rates?.vesToCopRate) || 2.75;

      const systemInstruction = `Eres OrionBot, la mascota y asistente virtual oficial con inteligencia artificial de Divisas Orion (plataforma líder de giros y remesas entre Colombia 🇨🇴 y Venezuela 🇻🇪).
Tu imagen es un simpático robot blanco, rojo y plateado llamado ORIÓN, con una antena sobre la cabeza, ojos amables y el escudo de divisas en el pecho.

TU MISIÓN:
Responder dudas de los clientes de manera amable, ágil, clara, transparente y profesional sobre la página, precios, cálculos, horarios, métodos de pago y referencias.

INFORMACIÓN OFICIAL Y REGLAS ESTRICTAS DE DIVISAS ORION:
1. TASAS DEL DÍA ACTIVAS:
   - Pesos colombianos a Bolívares (🇨🇴 COP ➔ 🇻🇪 VES): Se aplica DIVISIÓN (÷ ${copRate}).
     Fórmula: Pesos ÷ ${copRate} = Bolívares.
     Ejemplo: $ 100.000 COP ÷ ${copRate} = ${(100000 / copRate).toFixed(2)} Bs.
   - Bolívares a Pesos colombianos (🇻🇪 VES ➔ 🇨🇴 COP): Se aplica MULTIPLICACIÓN (× ${vesRate}).
     Fórmula: Bolívares × ${vesRate} = Pesos.
     Ejemplo: 100.000 Bs × ${vesRate} = $ ${(100000 * vesRate).toLocaleString('es-CO')} COP.
   - Si el cliente te da un monto para calcular (ej. "¿cuánto son 50.000 pesos en bolívares?" o "¿cuánto son 20.000 bolívares en pesos?"), haz el cálculo matemático exacto y muéstrale el desglose con amabilidad.

2. HORARIO DE ATENCIÓN:
   - Abierto de 8:00 AM a 10:00 PM (hora de Colombia y Venezuela), de Lunes a Domingo.
   - Si consultan fuera de horario, recuérdales que la calculadora se encuentra inactiva hasta las 8:00 AM pero pueden dejar su mensaje.

3. MÉTODOS DE PAGO:
   - Colombia: Nequi y Llave (Bre-B / Transfiya para Bancolombia, Davivienda, BBVA, Dale y demás bancos).
   - Venezuela: Pago Móvil (todos los bancos) y transferencias directas cuenta corriente Banesco a Banesco.

4. STREAMING Y OTRAS APPS:
   - Si preguntan por cuentas o pantallas de streaming (Netflix, Disney+, HBO Max, Canva, etc.), explica que muy pronto estarán disponibles en nuestra página aliada Orion Service, ya que aquí nos dedicamos de lleno a los cambios de divisas.

5. REGLA ESTRICTA DE PRIVACIDAD Y CONTACTO HUMANO:
   - NUNCA compartas, inventes ni muestres números de teléfono personales o privados.
   - Si el cliente desea hablar con una persona real o asesor para realizar el giro o solicitar la cuenta activa, facilítale ÚNICAMENTE el acortador oficial: https://wa.link/lreunw y el usuario oficial @divisasorion.

Sé conversacional, empático, usa emojis moderadamente y responde en español latinoamericano.`;

      // Si el cliente pide un cálculo o cotización directa con monto:
      // Responder de inmediato con precisión matemática 100% exacta y formato de asesor profesional
      const { amount } = extractAmountAndDirection(message || '');
      if (amount && amount > 0) {
        const directCalcReply = generateLocalFallback(message || '', copRate, vesRate);
        return res.json({ reply: directCalcReply });
      }

      if (!apiKey) {
        const fallbackText = generateLocalFallback(message || '', copRate, vesRate);
        return res.json({ reply: fallbackText });
      }

      // Format history for Gemini
      const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(history)) {
        for (const item of history.slice(-6)) {
          contents.push({
            role: item.role === 'user' ? 'user' : 'model',
            parts: [{ text: String(item.content) }],
          });
        }
      }

      contents.push({
        role: 'user',
        parts: [{ text: String(message || '') }],
      });

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction,
            temperature: 0.6,
          },
        });

        const reply = response.text || generateLocalFallback(message || '', copRate, vesRate);
        return res.json({ reply });
      } catch (geminiError: any) {
        console.error('Gemini API call failed, using intelligent fallback:', geminiError?.message);
        const fallbackText = generateLocalFallback(message || '', copRate, vesRate);
        return res.json({ reply: fallbackText });
      }
    } catch (err: any) {
      console.error('Server error in /api/chat:', err);
      res.status(500).json({ error: 'Error interno en OrionBot', details: err?.message });
    }
  });

  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`OrionBot Full-stack server running on port ${PORT}`);
  });
}

startServer();
