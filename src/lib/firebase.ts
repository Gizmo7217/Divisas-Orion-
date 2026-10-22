import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { ClientReview, ExchangeRates } from '../types';

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firestore with specific database ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const REVIEWS_COLLECTION = 'reviews';
const SETTINGS_COLLECTION = 'settings';
const RATES_DOC = 'rates';

/**
 * Save a new client review to Firestore cloud database
 */
export async function saveReviewToCloud(review: ClientReview): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, REVIEWS_COLLECTION), {
      name: review.name,
      country: review.country,
      countryFlag: review.countryFlag,
      originCity: review.originCity,
      destinationCity: review.destinationCity,
      operationType: review.operationType,
      comment: review.comment,
      rating: review.rating,
      timeAgo: review.timeAgo || 'Hace un momento',
      verified: review.verified ?? true,
      avatarColor: review.avatarColor || 'from-amber-500 to-red-600',
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (err) {
    console.warn('Error saving review to Firebase, falling back to local:', err);
    throw err;
  }
}

/**
 * Fetch all client reviews from Firestore
 */
export async function fetchCloudReviews(): Promise<ClientReview[]> {
  try {
    const q = query(collection(db, REVIEWS_COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const reviews: ClientReview[] = [];
    snapshot.forEach((d) => {
      const data = d.data();
      reviews.push({
        id: d.id,
        name: data.name || 'Cliente',
        country: data.country || 'Colombia',
        countryFlag: data.countryFlag || '🇨🇴',
        originCity: data.originCity || data.country || 'Colombia',
        destinationCity: data.destinationCity || 'Venezuela',
        operationType: data.operationType || 'Remesa',
        comment: data.comment || '',
        rating: typeof data.rating === 'number' ? data.rating : 5,
        timeAgo: data.timeAgo || 'Reciente',
        verified: data.verified ?? true,
        avatarColor: data.avatarColor || 'from-amber-500 to-red-600',
      });
    });
    return reviews;
  } catch (err) {
    console.warn('Could not fetch cloud reviews:', err);
    return [];
  }
}

/**
 * Real-time listener for cloud reviews
 */
export function listenToCloudReviews(callback: (reviews: ClientReview[]) => void): () => void {
  try {
    const q = query(collection(db, REVIEWS_COLLECTION), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const reviews: ClientReview[] = [];
        snapshot.forEach((d) => {
          const data = d.data();
          reviews.push({
            id: d.id,
            name: data.name || 'Cliente',
            country: data.country || 'Colombia',
            countryFlag: data.countryFlag || '🇨🇴',
            originCity: data.originCity || data.country || 'Colombia',
            destinationCity: data.destinationCity || 'Venezuela',
            operationType: data.operationType || 'Remesa',
            comment: data.comment || '',
            rating: typeof data.rating === 'number' ? data.rating : 5,
            timeAgo: data.timeAgo || 'Reciente',
            verified: data.verified ?? true,
            avatarColor: data.avatarColor || 'from-amber-500 to-red-600',
          });
        });
        callback(reviews);
      },
      (error) => {
        console.warn('Real-time reviews listener error:', error);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Failed to attach real-time reviews listener:', err);
    return () => {};
  }
}

/**
 * Save rates to cloud
 */
export async function saveRatesToCloud(rates: ExchangeRates): Promise<void> {
  try {
    await setDoc(doc(db, SETTINGS_COLLECTION, RATES_DOC), {
      copToVesRate: rates.copToVesRate,
      vesToCopRate: rates.vesToCopRate,
      lastUpdated: rates.lastUpdated,
      whatsappNumber: rates.whatsappNumber,
      whatsappUsername: rates.whatsappUsername,
      whatsappLink: rates.whatsappLink,
      slogan: rates.slogan,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Error saving rates to cloud:', err);
  }
}

/**
 * Real-time listener for rates
 */
export function listenToCloudRates(callback: (rates: Partial<ExchangeRates>) => void): () => void {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, RATES_DOC);
    const unsubscribe = onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          callback(data as Partial<ExchangeRates>);
        }
      },
      (error) => {
        console.warn('Rates listener error:', error);
      }
    );
    return unsubscribe;
  } catch (err) {
    return () => {};
  }
}
