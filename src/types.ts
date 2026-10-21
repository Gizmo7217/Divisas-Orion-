export type CurrencyDirection = 'COP_TO_VES' | 'VES_TO_COP';

export interface ExchangeRates {
  copToVesRate: number; // e.g. 3.55 (COP / rate = VES)
  vesToCopRate: number; // e.g. 2.75 (VES * rate = COP)
  lastUpdated: string;
  whatsappNumber: string; // e.g. 573135459314
  whatsappUsername: string; // '@divisasorion'
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
  category: 'Películas & Series' | 'Música' | 'Anime' | 'Video & Entretenimiento';
  profiles: string;
  quality: string;
  warranty: string;
  color: string;
  badge?: string;
  popular?: boolean;
  features: string[];
}

export interface QuickRow {
  fromAmount: number;
  toAmount: number;
  formattedFrom: string;
  formattedTo: string;
}
