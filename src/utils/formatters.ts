import { CurrencyDirection } from '../types';

export function getColombiaDate(): string {
  try {
    return new Intl.DateTimeFormat('es-CO', {
      timeZone: 'America/Bogota',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date());
  } catch (e) {
    return '22 de octubre';
  }
}

/**
 * Returns true if current time in Colombia (America/Bogota)
 * is between 8:00 AM and 10:00 PM (Monday to Sunday).
 * Between 10:01 PM and 7:59 AM it returns false (Closed).
 */
export function isBusinessOpenColombia(): boolean {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Bogota',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    });
    const parts = formatter.formatToParts(new Date());
    const hour = parseInt(parts.find((p) => p.type === 'hour')?.value || '0', 10);
    const minute = parseInt(parts.find((p) => p.type === 'minute')?.value || '0', 10);
    const currentMinutes = hour * 60 + minute;

    // Horario: 8:00 am (480 min) a 10:00 pm (1320 min)
    // 10:01 pm en adelante (>= 1321) y hasta las 7:59 am (<= 479) está CERRADO
    return currentMinutes >= 480 && currentMinutes <= 1320;
  } catch (e) {
    const now = new Date();
    let colHours = now.getUTCHours() - 5;
    if (colHours < 0) colHours += 24;
    const colMinutes = colHours * 60 + now.getUTCMinutes();
    return colMinutes >= 480 && colMinutes <= 1320;
  }
}

export function formatNumberWithDots(val: number, decimals: number = 0): string {
  if (isNaN(val)) return '0';
  const parts = val.toFixed(decimals).split('.');
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  if (decimals > 0 && parts[1]) {
    return `${integerPart},${parts[1]}`;
  }
  return integerPart;
}

export function formatCOP(amount: number): string {
  return `$ ${formatNumberWithDots(Math.round(amount), 0)} COP`;
}

export function formatVES(amount: number, includeDecimals: boolean = true): string {
  if (!includeDecimals) {
    return `${formatNumberWithDots(Math.round(amount), 0)} Bs`;
  }
  return `${formatNumberWithDots(amount, 2)} Bs`;
}

export function formatVESInteger(amount: number): string {
  return `${formatNumberWithDots(Math.round(amount), 0)} Bs`;
}

export interface CalculationResult {
  fromAmount: number;
  toAmount: number;
  direction: CurrencyDirection;
  rateApplied: number;
  formattedFrom: string;
  formattedToExact: string;
  formattedToInteger: string;
  explanationFormula: string;
}

export function calculateRemesa(
  amount: number,
  direction: CurrencyDirection,
  copToVesRate: number,
  vesToCopRate: number
): CalculationResult {
  const safeAmount = Math.max(0, amount || 0);

  if (direction === 'COP_TO_VES') {
    // Formula: Monto en Pesos dividido por tasa 3,55 = Bolívares
    const safeRate = copToVesRate > 0 ? copToVesRate : 3.55;
    const vesResult = safeAmount / safeRate;
    return {
      fromAmount: safeAmount,
      toAmount: vesResult,
      direction,
      rateApplied: safeRate,
      formattedFrom: formatCOP(safeAmount),
      formattedToExact: formatVES(vesResult, true),
      formattedToInteger: formatVESInteger(vesResult),
      explanationFormula: `${formatNumberWithDots(safeAmount, 0)} ÷ ${safeRate.toString().replace('.', ',')} = ${formatVES(vesResult, true)}`,
    };
  } else {
    // Formula: Monto en Bolívares multiplicado por tasa 2,75 = Pesos
    const safeRate = vesToCopRate > 0 ? vesToCopRate : 2.75;
    const copResult = safeAmount * safeRate;
    return {
      fromAmount: safeAmount,
      toAmount: copResult,
      direction,
      rateApplied: safeRate,
      formattedFrom: formatVES(safeAmount, false),
      formattedToExact: formatCOP(copResult),
      formattedToInteger: formatCOP(Math.round(copResult)),
      explanationFormula: `${formatNumberWithDots(safeAmount, 0)} Bs × ${safeRate.toString().replace('.', ',')} = ${formatCOP(copResult)}`,
    };
  }
}


export function getRemesaMessageText(options: {
  direction: CurrencyDirection;
  fromAmount: number;
  toAmount: number;
  rateApplied: number;
  paymentMethod?: string;
}): string {
  const isCopToVes = options.direction === 'COP_TO_VES';
  const fromText = isCopToVes
    ? formatCOP(options.fromAmount)
    : formatVES(options.fromAmount, false);
  const toExact = isCopToVes
    ? formatVES(options.toAmount, true)
    : formatCOP(options.toAmount);
  const toInteger = isCopToVes
    ? formatVESInteger(options.toAmount)
    : formatCOP(Math.round(options.toAmount));

  return `🔴 *CONSULTA DE GIRO - DIVISAS ORION (@divisasorion)* 🔴
✨ _"Cambia rápido y seguro con nosotros"_ ✨

👋 Hola, deseo realizar una operación de cambio:

➡️ *Operación:* ${isCopToVes ? '🇨🇴 Colombia (Pesos) a 🇻🇪 Venezuela (Bolívares)' : '🇻🇪 Venezuela (Bolívares) a 🇨🇴 Colombia (Pesos)'}
💰 *Monto a enviar:* ${fromText}
📊 *Tasa acordada:* ${options.rateApplied.toString().replace('.', ',')}
💵 *Monto a recibir:* ${toExact} (Aprox. ${toInteger})
💳 *Método de pago deseado:* ${options.paymentMethod || 'A coordinar (Nequi / Llave / Pago Móvil / Banesco)'}

Por favor confírmenme si la tasa está disponible y los datos para realizar la transferencia. ¡Muchas gracias!`;
}

export function createWhatsAppMessage(options: {
  phone: string;
  direction: CurrencyDirection;
  fromAmount: number;
  toAmount: number;
  rateApplied: number;
  paymentMethod?: string;
  customNote?: string;
  customLink?: string;
}): string {
  const text = getRemesaMessageText(options);
  const link = (options.customLink && options.customLink.trim().length > 0)
    ? options.customLink.trim()
    : 'https://wa.link/lreunw';
  return `${link}${link.includes('?') ? '&' : '?'}text=${encodeURIComponent(text)}`;
}

export function getStreamingMessageText(options: {
  productName: string;
  priceCOP: number;
  priceVES: number;
}): string {
  const roundedVES = Math.round(options.priceVES);
  return `🎬 *SOLICITUD STREAMING - DIVISAS ORION (@divisasorion)* 🍿

👋 Hola, deseo contratar el siguiente servicio:

📺 *Servicio:* ${options.productName}
💰 *Precio en Pesos:* ${formatCOP(options.priceCOP)}
🇻🇪 *Precio en Bolívares (Tasa del día):* ${formatNumberWithDots(roundedVES, 0)} Bs
⚡ *Entrega:* Inmediata con garantía de 30 días
💳 *Pago disponible:* Nequi / Llave en Colombia o Pago Móvil / Banesco en Venezuela

Por favor facilítenme los datos para transferir y la entrega de mi pantalla. ¡Muchas gracias!`;
}

export function createStreamingWhatsAppMessage(options: {
  phone: string;
  productName: string;
  priceCOP: number;
  priceVES: number;
  currencyPreference?: 'COP' | 'VES';
  customLink?: string;
}): string {
  const text = getStreamingMessageText(options);
  const link = (options.customLink && options.customLink.trim().length > 0)
    ? options.customLink.trim()
    : 'https://wa.link/lreunw';
  return `${link}${link.includes('?') ? '&' : '?'}text=${encodeURIComponent(text)}`;
}

export function launchProtectedWhatsApp(options: {
  phone: string;
  text: string;
  customLink?: string;
}): void {
  const encodedText = encodeURIComponent(options.text);
  const link = (options.customLink && options.customLink.trim().length > 0)
    ? options.customLink.trim()
    : 'https://wa.link/lreunw';

  // Blindaje 100%: usa el enlace encriptado oficial wa.link/lreunw
  // La barra de direcciones NUNCA muestra api.whatsapp.com/send/?phone= ni el número de celular
  const finalUrl = link.includes('?')
    ? `${link}&text=${encodedText}`
    : `${link}?text=${encodedText}`;

  window.open(finalUrl, '_blank');
}
