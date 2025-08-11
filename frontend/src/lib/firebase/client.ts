import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Validate config
const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
const missingKeys = requiredKeys.filter(key => !firebaseConfig[key as keyof typeof firebaseConfig]);

if (missingKeys.length > 0) {
  console.error('Missing Firebase config keys:', missingKeys);
  throw new Error(`Firebase configuration incomplete. Missing: ${missingKeys.join(', ')}`);
}

// Ensure only one Firebase app instance
let app: FirebaseApp;

if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    console.log('Firebase app initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Firebase app:', error);
    throw error;
  }
} else {
  app = getApps()[0]!;
  console.log('Using existing Firebase app instance');
}

// Initialize auth and firestore with the same app instance
export const auth = getAuth(app);
export const db = getFirestore(app);

// Configure Google provider with custom parameters
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Prevent multiple auth instances
if (typeof window !== 'undefined') {
  // Only run in browser
  if ((window as any).__FIREBASE_AUTH_INSTANCE__) {
    console.warn('Firebase Auth already initialized');
  } else {
    (window as any).__FIREBASE_AUTH_INSTANCE__ = auth;
  }
}

// Export a function to check if Firebase is ready
export const isFirebaseReady = () => {
  return !!app && !!auth && !!db;
};


