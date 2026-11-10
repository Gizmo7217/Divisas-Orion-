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
    // Formula: Monto en Pesos dividido por tasa 3,50 = Bolívares
    const safeRate = copToVesRate > 0 ? copToVesRate : 3.50;
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
    // Formula: Monto en Bolívares multiplicado por tasa 2,65 = Pesos
    const safeRate = vesToCopRate > 0 ? vesToCopRate : 2.65;
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

  if (isCopToVes) {
    const fromText = `$ ${formatNumberWithDots(Math.round(options.fromAmount), 0)} COP`;
    const toExact = `${formatNumberWithDots(options.toAmount, 2)} Bs`;
    const toInteger = `${formatNumberWithDots(Math.round(options.toAmount), 0)} Bs`;
    const rateStr = options.rateApplied.toString().replace('.', ',');

    return `👋 Hola Divisas Orion (@divisasorion), deseo realizar una cotización de cambio:

🇨🇴 *Monto que deseo enviar:* ${fromText}
💳 *Método de pago preferido:* ${options.paymentMethod || 'Nequi'}
📊 *Tasa del día:* ${rateStr} (División ÷ ${rateStr})
🇻🇪 *Resultado a recibir en Venezuela:* ${toExact} (Entero: ${toInteger})
📝 *Desglose del cálculo:* ${formatNumberWithDots(Math.round(options.fromAmount), 0)} COP ÷ ${rateStr} = ${toExact}

Por favor facilítenme los datos de la cuenta activa para realizar la transferencia. Quedo atento para que me atienda su bot o asesor. ¡Muchas gracias!`;
  } else {
    const fromText = `${formatNumberWithDots(Math.round(options.fromAmount), 0)} Bs`;
    const toExact = `$ ${formatNumberWithDots(Math.round(options.toAmount), 0)} COP`;
    const rateStr = options.rateApplied.toString().replace('.', ',');

    return `👋 Hola Divisas Orion (@divisasorion), deseo realizar una cotización de cambio:

🇻🇪 *Monto que deseo enviar:* ${fromText}
💳 *Método de pago preferido:* ${options.paymentMethod || 'Pago Móvil'}
📊 *Tasa del día:* ${rateStr} (Multiplicación × ${rateStr})
🇨🇴 *Resultado a recibir en Colombia:* ${toExact}
📝 *Desglose del cálculo:* ${fromText} × ${rateStr} = ${toExact}

Por favor facilítenme los datos de la cuenta activa para realizar la transferencia. Quedo atento para que me atienda su bot o asesor. ¡Muchas gracias!`;
  }
}

export function createWhatsAppMessage(options: {
  phone?: string;
  direction: CurrencyDirection;
  fromAmount: number;
  toAmount: number;
  rateApplied: number;
  paymentMethod?: string;
  customNote?: string;
  customLink?: string;
}): string {
  const text = getRemesaMessageText(options);
  const baseLink = (options.customLink && options.customLink.trim().length > 0)
    ? options.customLink.trim()
    : 'https://wa.link/lreunw';
  const encodedText = encodeURIComponent(text);
  return baseLink.includes('?') ? `${baseLink}&text=${encodedText}` : `${baseLink}?text=${encodedText}`;
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
  phone?: string;
  productName: string;
  priceCOP: number;
  priceVES: number;
  currencyPreference?: 'COP' | 'VES';
  customLink?: string;
}): string {
  const text = getStreamingMessageText(options);
  const baseLink = (options.customLink && options.customLink.trim().length > 0)
    ? options.customLink.trim()
    : 'https://wa.link/lreunw';
  const encodedText = encodeURIComponent(text);
  return baseLink.includes('?') ? `${baseLink}&text=${encodedText}` : `${baseLink}?text=${encodedText}`;
}

export function launchProtectedWhatsApp(options: {
  phone?: string;
  text?: string;
  customLink?: string;
}): void {
  const cleanPhone = (options.phone || '573135459314').replace(/[^0-9]/g, '');

  let targetUrl: string;

  if (options.text && options.text.trim().length > 0) {
    // Cuando hay texto de cotización para enviar al bot o asesor, se usa api.whatsapp.com
    // con el número de la empresa. Esto garantiza que WhatsApp precargue y escriba DE UNA VEZ
    // el pedido completo en la barra de mensaje, listo para enviar.
    const encodedText = encodeURIComponent(options.text.trim());
    targetUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;

    // Copia automática de respaldo al portapapeles
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      try {
        navigator.clipboard.writeText(options.text);
      } catch {
        // Ignorar si el navegador restringe permisos de clipboard
      }
    }
  } else {
    // Si es un contacto general sin cotización específica, se usa el acortador wa.link
    targetUrl = (options.customLink && options.customLink.trim().length > 0)
      ? options.customLink.trim()
      : 'https://wa.link/lreunw';
  }

  // Apertura segura que no rompa el contenedor WebApk / PWA de Android ni cause errores de página:
  // Disparamos un click en un elemento <a> en el DOM con target="_blank" y rel="noopener noreferrer".
  // Esto le indica a Android que delegue limpiamente hacia WhatsApp sin interrumpir la app.
  if (typeof document !== 'undefined') {
    try {
      const linkEl = document.createElement('a');
      linkEl.href = targetUrl;
      linkEl.target = '_blank';
      linkEl.rel = 'noopener noreferrer';
      document.body.appendChild(linkEl);
      linkEl.click();
      setTimeout(() => {
        try {
          if (document.body.contains(linkEl)) {
            document.body.removeChild(linkEl);
          }
        } catch {
          // Ignorar si ya fue removido
        }
      }, 200);
      return;
    } catch {
      // Continuar con fallback
    }
  }

  if (typeof window !== 'undefined') {
    try {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    } catch {
      // noop
    }
  }
}


