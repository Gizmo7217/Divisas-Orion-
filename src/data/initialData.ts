import { ExchangeRates, PaymentMethodDetail, StreamingProduct } from '../types';
import { getColombiaDate } from '../utils/formatters';

export const INITIAL_RATES: ExchangeRates = {
  copToVesRate: 3.60,
  vesToCopRate: 2.75,
  lastUpdated: getColombiaDate(),
  whatsappNumber: '573135459314', // Default backend number (kept hidden from UI)
  whatsappUsername: '@divisasorion', // Public username for communication
  businessName: 'Divisas Orion',
  slogan: 'Cambia rápido y seguro con nosotros',
};

export const PAYMENT_METHODS: PaymentMethodDetail[] = [
  // Colombia
  {
    id: 'nequi',
    country: 'Colombia',
    name: 'Nequi',
    badge: 'Inmediato 24/7',
    iconName: 'Smartphone',
    headline: 'Transferencia al instante desde tu aplicación Nequi',
    bankName: 'Nequi Colombia',
    notes: 'Aceptamos transferencias directas de Nequi a Nequi. Solicita la cuenta activa antes de enviar para confirmar cupo y acreditar de inmediato.',
    color: 'from-pink-600 to-purple-800',
    whatsappPrompt: 'Hola Divisas Orion, deseo consultar los datos activos para transferir por Nequi en Colombia.',
  },
  {
    id: 'llave',
    country: 'Colombia',
    name: 'Llave (Bre-B / Transfiya)',
    badge: 'Cualquier banco colombiano',
    iconName: 'Key',
    headline: 'Envía desde Bancolombia, Davivienda, BBVA, Dale o cualquier entidad bancaria',
    bankName: 'Red Interbancaria Transfiya / Llaves Digitales',
    notes: 'Transfiere mediante número de celular / llave interbancaria disponible al instante en cualquier entidad financiera.',
    color: 'from-amber-500 to-red-600',
    whatsappPrompt: 'Hola Divisas Orion, deseo consultar la Llave activa para transferir desde mi banco en Colombia.',
  },
  // Venezuela
  {
    id: 'pago-movil',
    country: 'Venezuela',
    name: 'Pago Móvil',
    badge: 'Crédito inmediato interbancario',
    iconName: 'Zap',
    headline: 'Transferencia interbancaria inmediata en Bolívares (VES)',
    bankName: 'Banesco / BDV / Mercantil / Provincial',
    notes: 'Pago Móvil disponible para todos los bancos venezolanos. Solicita el teléfono, cédula y banco activo por WhatsApp.',
    color: 'from-emerald-600 to-teal-800',
    whatsappPrompt: 'Hola Divisas Orion, deseo consultar los datos activos para hacer un Pago Móvil en Venezuela.',
  },
  {
    id: 'banesco',
    country: 'Venezuela',
    name: 'Banesco Venezuela',
    badge: 'Transferencia Mismo Banco',
    iconName: 'Building2',
    headline: 'Transferencias directas cuenta corriente Banesco a Banesco',
    bankName: 'Banesco Banco Universal',
    notes: 'Acreditación instantánea sin comisiones interbancarias. Solicita el número de cuenta corriente y RIF verificado.',
    color: 'from-blue-700 to-indigo-900',
    whatsappPrompt: 'Hola Divisas Orion, deseo consultar los datos activos de cuenta Banesco para transferir en Venezuela.',
  },
];

export const STREAMING_PRODUCTS: StreamingProduct[] = [
  {
    id: 'netflix',
    name: 'Perfil Netflix',
    tagline: 'Pantalla Ultra HD 4K con PIN privado exclusivo',
    priceCOP: 14500,
    priceVES: 4028, // 14500 / 3.60 = 4028 Bs
    category: 'Películas & Series',
    profiles: '1 Perfil privado con PIN',
    quality: 'Ultra HD 4K + HDR',
    warranty: 'Garantía 30 días',
    color: 'from-red-600 to-rose-950',
    popular: true,
    badge: 'Más Pedido',
    features: [
      'Perfil exclusivo con tu nombre y clave PIN',
      'Sin interrupciones ni pantallas ocupadas',
      'Renovable mes a mes sin perder historial',
      'Smart TV, celular, computadora o tablet',
    ],
  },
  {
    id: 'disney-sin-deportes',
    name: 'Perfil Disney+ (No Trae Deportes)',
    tagline: 'Disney, Pixar, Marvel y Star Wars sin ESPN',
    priceCOP: 5500,
    priceVES: 1528, // 5500 / 3.60 = 1528 Bs
    category: 'Películas & Series',
    profiles: '1 Perfil privado (Sin deportes)',
    quality: '4K Ultra HD',
    warranty: 'Garantía 30 días',
    color: 'from-blue-600 to-indigo-950',
    badge: 'Super Precio',
    features: [
      'Todo el catálogo clásico y estrenos de Disney',
      'Películas de Marvel, Star Wars y Pixar',
      'Perfil personal con clave de acceso',
      'Calidad de video Ultra HD',
    ],
  },
  {
    id: 'disney-espn',
    name: 'Perfil Disney+ ESPN (Sí Trae Deportes)',
    tagline: 'Disney, Marvel, Star Wars y todos los deportes en vivo de ESPN',
    priceCOP: 8200,
    priceVES: 2278, // 8200 / 3.60 = 2278 Bs
    category: 'Películas & Series',
    profiles: '1 Perfil privado con ESPN',
    quality: '4K Ultra HD + Deportes en Vivo',
    warranty: 'Garantía 30 días',
    color: 'from-blue-700 to-rose-900',
    popular: true,
    badge: 'Fútbol & ESPN',
    features: [
      'Partidos en vivo de Champions, ligas y ESPN',
      'Todo el catálogo completo Disney+, Pixar, Marvel',
      'Perfil exclusivo asignado con PIN',
      'Transmisiones en vivo sin cortes',
    ],
  },
  {
    id: 'hbo',
    name: 'Perfil HBO Max',
    tagline: 'Series icónicas HBO Original, Warner Bros y DC',
    priceCOP: 5500,
    priceVES: 1528, // 5500 / 3.60 = 1528 Bs
    category: 'Películas & Series',
    profiles: '1 Perfil privado',
    quality: '4K UHD y audio Dolby',
    warranty: 'Garantía 30 días',
    color: 'from-purple-600 to-indigo-950',
    badge: 'Series Top',
    features: [
      'House of the Dragon, The Last of Us, Harry Potter',
      'Estrenos directo de cine y series completas',
      'Perfil con clave de acceso',
      'Estabilidad garantizada los 30 días',
    ],
  },
  {
    id: 'prime-video',
    name: 'Perfil Prime Video',
    tagline: 'Series originales Amazon, películas de estreno y fútbol',
    priceCOP: 7400,
    priceVES: 2056, // 7400 / 3.60 = 2056 Bs
    category: 'Películas & Series',
    profiles: '1 Perfil privado',
    quality: 'Full HD / 4K HDR',
    warranty: 'Garantía 30 días',
    color: 'from-sky-600 to-blue-900',
    features: [
      'The Boys, El Señor de los Anillos y miles de películas',
      'Sin caídas y con perfil exclusivo',
      'Descargas para ver sin internet',
      'Activación rápida con garantía',
    ],
  },
  {
    id: 'canva-pro',
    name: 'Perfil Canva Pro',
    tagline: 'Diseño gráfico profesional, millones de plantillas e IA',
    priceCOP: 9200,
    priceVES: 2556, // 9200 / 3.60 = 2556 Bs
    category: 'Diseño & Productividad',
    profiles: 'Acceso Pro / Equipo',
    quality: 'Todas las herramientas Pro habilitadas',
    warranty: 'Garantía 30 días',
    color: 'from-cyan-600 to-teal-900',
    popular: true,
    badge: 'Diseño & Trabajo',
    features: [
      'Quita fondos en un clic y herramientas de IA',
      'Millones de fotos, videos y fuentes premium',
      'Kits de marcas y redimensionamiento mágico',
      'Uso en PC, tablet o celular',
    ],
  },
  {
    id: 'crunchyroll',
    name: 'Perfil Crunchyroll',
    tagline: 'Mega Fan con estrenos simultáneos con Japón sin publicidad',
    priceCOP: 7400,
    priceVES: 2056, // 7400 / 3.60 = 2056 Bs
    category: 'Anime',
    profiles: '1 Perfil Mega Fan',
    quality: 'Full HD 1080p sin anuncios',
    warranty: 'Garantía 30 días',
    color: 'from-orange-500 to-amber-900',
    badge: 'Anime Oficial',
    features: [
      'Capítulos nuevos 1 hora después de Japón',
      'Doblaje al español latino y subtítulos oficiales',
      'Sin anuncios ni interrupciones',
      'Soporte multi-dispositivo',
    ],
  },
  {
    id: 'spotify',
    name: 'Perfil Spotify',
    tagline: 'Música sin anuncios, playlists offline y máxima calidad',
    priceCOP: 11000,
    priceVES: 3056, // 11000 / 3.60 = 3056 Bs
    category: 'Música',
    profiles: 'Cuenta Premium Individual',
    quality: 'Audio muy alto (320 kbps)',
    warranty: 'Garantía 30 días',
    color: 'from-emerald-500 to-emerald-900',
    popular: true,
    badge: 'Música Top',
    features: [
      'Cero publicidad en canciones y podcasts',
      'Descarga tu música para escuchar offline',
      'Saltos ilimitados de canciones',
      'Activación directa garantizada',
    ],
  },
  {
    id: 'youtube-premium-colombia',
    name: 'YouTube Premium (Solo para Colombia)',
    tagline: 'Activación directa con tu propio correo personal de Gmail',
    priceCOP: 10000,
    priceVES: 2778, // 10000 / 3.60 = 2778 Bs
    category: 'Video & Entretenimiento',
    profiles: 'Con tu propio correo (Gmail)',
    quality: '1080p Premium / 4K + YouTube Music',
    warranty: 'Garantía mensual 30 días',
    color: 'from-red-600 to-rose-950',
    popular: true,
    badge: '🇨🇴 Solo para Colombia',
    features: [
      'Se activa directamente en tu propio correo personal',
      'Cero anuncios en todos los videos de YouTube',
      'Reproducción en segundo plano y pantalla apagada',
      'Incluye YouTube Music Premium sin publicidad',
    ],
  },
];

export const PRESET_COP_AMOUNTS = [
  50000,
  100000,
  200000,
  500000,
  1000000,
  1500000,
  2000000,
];

export const PRESET_VES_AMOUNTS = [
  5000,
  10000,
  20000,
  50000,
  100000,
  200000,
  300000,
];

export const FAQS = [
  {
    q: '¿Cómo funciona la tasa de Pesos a Bolívares (COP a VES)?',
    a: 'Para enviar de Colombia a Venezuela, tomas la cantidad de pesos colombianos que deseas enviar y la divides entre la tasa del día (por ejemplo, 3,60). El resultado obtenido es exactamente lo que recibe el beneficiario en su cuenta bancaria o Pago Móvil en Bolívares, con números enteros y decimales exactos.',
  },
  {
    q: '¿Cómo funciona la tasa de Bolívares a Pesos (VES a COP)?',
    a: 'Para enviar de Venezuela a Colombia, multiplicas la cantidad de bolívares por la tasa acordada del día (ejemplo: 2,75). El resultado es el monto exacto en pesos que se transfiere por Nequi o Llave en Colombia.',
  },
  {
    q: '¿Cuánto tiempo tarda en hacerse efectivo el giro?',
    a: 'Nuestros giros son casi inmediatos. Una vez verificado el comprobante de pago por Nequi, Llave, Pago Móvil o Banesco, el envío se procesa en un lapso estimado de 5 a 15 minutos.',
  },
  {
    q: '¿Cuáles son los métodos de pago aceptados y cómo obtengo los datos para transferir?',
    a: 'En Colombia aceptamos Nequi y Llave (para transferencias desde cualquier banco), y en Venezuela aceptamos Pago Móvil y Banesco. Por motivos de seguridad y disponibilidad de cuentas, los datos oficiales para transferir se solicitan directamente por WhatsApp a nuestro usuario oficial @divisasorion al momento de realizar tu operación.',
  },
  {
    q: '¿Cómo funcionan las pantallas streaming y qué garantía tienen?',
    a: 'Las pantallas streaming de Netflix, Spotify, Disney+, Max, Crunchyroll, Paramount+ y YouTube Premium se entregan al instante luego del pago. Cuentan con soporte y garantía completa de 30 días con renovación garantizada sin perder tus favoritos ni perfiles.',
  },
];

export const TESTIMONIALS = [
  {
    name: 'Carlos Mendoza',
    city: 'Bogotá ➔ Caracas',
    rating: 5,
    comment: 'Siempre envío por Divisas Orion. La tasa de 3,60 es la más justa del mercado y el Pago Móvil le llega a mi mamá en menos de 10 minutos. Totalmente recomendados.',
    time: 'Hace 2 horas',
  },
  {
    name: 'Mariangel Contreras',
    city: 'Medellín ➔ Maracaibo',
    rating: 5,
    comment: 'Excelente atención por WhatsApp. Pago por Nequi y me transfieren a Banesco súper rápido. Además compré mi pantalla de Netflix y funciona perfecto con PIN.',
    time: 'Ayer',
  },
  {
    name: 'José Gregorio Silva',
    city: 'Valencia ➔ Cúcuta / Cali',
    rating: 5,
    comment: 'Cambié de Bolívares a Pesos por primera vez a la tasa de 2,75 y me llegó a mi Nequi sin demoras. Confiables y transparentes con los números.',
    time: 'Hace 3 días',
  },
];
