export type CurrencyDirection = 'COP_TO_VES' | 'VES_TO_COP';

export interface ExchangeRates {
  copToVesRate: number; // e.g. 3.60 (COP / rate = VES)
  vesToCopRate: number; // e.g. 2.75 (VES * rate = COP)
  lastUpdated: string;
  whatsappNumber: string; // e.g. 573135459314 (internal protected)
  whatsappUsername: string; // '@divisasorion'
  whatsappLink?: string; // e.g. 'https://wa.link/lreunw'
  businessName: string;
  slogan: string;
}

export interface PaymentMethodDetail {
  id: string;
  country: 'Colombia' | 'Venezuela';
  name: string;
  badge: string;
  iconName: string;
  headline: string;
  bankName: string;
  notes: string;
  color: string;
  whatsappPrompt: string;
}

export interface StreamingProduct {
  id: string;
  name: string;
  tagline: string;
  priceCOP: number;
  priceVES: number;
  category: 'Apps IA & Productividad' | 'Diseño & Edición' | 'Idiomas & Estudio' | 'Películas & Series' | 'Música' | 'Anime' | string;
  profiles: string;
  quality: string;
  warranty: string;
  color: string;
  badge?: string;
  popular?: boolean;
  features: string[];
}

export type UsdtType = 'BUY_USDT' | 'SELL_USDT'; // Comprar USDT o Vender USDT
export type UsdtFiat = 'COP' | 'VES'; // Con Pesos o Bolívares

export interface QuickRow {
  fromAmount: number;
  toAmount: number;
  formattedFrom: string;
  formattedToExact: string;
  formattedToInteger: string;
}

export interface ClientReview {
  id: string;
  name: string;
  country: 'Colombia' | 'Venezuela';
  countryFlag: string;
  originCity: string;
  destinationCity: string;
  operationType: string;
  comment: string;
  rating: number;
  timeAgo: string;
  verified: boolean;
  avatarColor: string;
}
