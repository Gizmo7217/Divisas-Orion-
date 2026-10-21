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
    return '21 de octubre';
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
    // Formula: Monto en Pesos dividido por tasa 3,60 = Bolívares
    const safeRate = copToVesRate > 0 ? copToVesRate : 3.60;
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

export function createWhatsAppMessage(options: {
  phone: string;
  direction: CurrencyDirection;
  fromAmount: number;
  toAmount: number;
  rateApplied: number;
  paymentMethod?: string;
  customNote?: string;
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

  const text = `🔴 *CONSULTA DE GIRO - DIVISAS ORION (@divisasorion)* 🔴
✨ _"Cambia rápido y seguro con nosotros"_ ✨

👋 Hola, deseo realizar una operación de cambio:

➡️ *Operación:* ${isCopToVes ? '🇨🇴 Colombia (Pesos) a 🇻🇪 Venezuela (Bolívares)' : '🇻🇪 Venezuela (Bolívares) a 🇨🇴 Colombia (Pesos)'}
💰 *Monto a enviar:* ${fromText}
📊 *Tasa acordada:* ${options.rateApplied.toString().replace('.', ',')}
💵 *Monto a recibir:* ${toExact} (Aprox. ${toInteger})
💳 *Método de pago deseado:* ${options.paymentMethod || 'A coordinar (Nequi / Llave / Pago Móvil / Banesco)'}

Por favor confírmenme si la tasa está disponible y los datos para realizar la transferencia. ¡Muchas gracias!`;

  return `https://wa.me/${options.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
}

export function createStreamingWhatsAppMessage(options: {
  phone: string;
  productName: string;
  priceCOP: number;
  priceVES: number;
  currencyPreference?: 'COP' | 'VES';
}): string {
  const roundedVES = Math.round(options.priceVES);

  const text = `🎬 *SOLICITUD STREAMING - DIVISAS ORION (@divisasorion)* 🍿

👋 Hola, deseo contratar el siguiente servicio:

📺 *Servicio:* ${options.productName}
💰 *Precio en Pesos:* ${formatCOP(options.priceCOP)}
🇻🇪 *Precio en Bolívares (Tasa del día):* ${formatNumberWithDots(roundedVES, 0)} Bs
⚡ *Entrega:* Inmediata con garantía de 30 días
💳 *Pago disponible:* Nequi / Llave en Colombia o Pago Móvil / Banesco en Venezuela

Por favor facilítenme los datos para transferir y la entrega de mi pantalla. ¡Muchas gracias!`;

  return `https://wa.me/${options.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
}
