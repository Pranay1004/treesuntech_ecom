/**
 * Lazy Firebase initialization
 * Only loads Firebase SDK when actually needed (Auth/Admin pages)
 * This significantly reduces initial bundle size on non-auth pages
 */

let cachedAuth: any = null;
let cachedDb: any = null;
let cachedGoogleProvider: any = null;
let cachedAppleProvider: any = null;

export async function getFirebaseInstances() {
  // Return cached instances if already loaded
  if (cachedAuth && cachedDb) {
    return {
      auth: cachedAuth,
      db: cachedDb,
      googleProvider: cachedGoogleProvider,
      appleProvider: cachedAppleProvider,
    };
  }

  // Dynamically import Firebase only when needed
  const { initializeApp } = await import('firebase/app');
  const {
    getAuth,
    GoogleAuthProvider,
    OAuthProvider,
  } = await import('firebase/auth');
  const { getFirestore } = await import('firebase/firestore');

  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  };

  // Validate that required config is present
  const requiredKeys: (keyof typeof firebaseConfig)[] = [
    'apiKey',
    'authDomain',
    'projectId',
    'appId',
  ];
  const missingKeys = requiredKeys.filter((key) => !firebaseConfig[key]);

  if (missingKeys.length > 0) {
    console.error(
      'Firebase config incomplete. Missing environment variables:',
      missingKeys
        .map((key) => `VITE_FIREBASE_${key.toUpperCase()}`)
        .join(', ')
    );
    if (typeof window !== 'undefined') {
      console.error(
        'Please add environment variables to your Vercel project settings or .env.local for local development'
      );
    }
  }

  const app = initializeApp(firebaseConfig);

  cachedAuth = getAuth(app);
  cachedDb = getFirestore(app);
  cachedGoogleProvider = new GoogleAuthProvider();

  // Apple OAuth Provider
  cachedAppleProvider = new OAuthProvider('apple.com');
  cachedAppleProvider.addScope('email');
  cachedAppleProvider.addScope('name');

  return {
    auth: cachedAuth,
    db: cachedDb,
    googleProvider: cachedGoogleProvider,
    appleProvider: cachedAppleProvider,
  };
}

export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || '';
