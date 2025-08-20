import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * Firebase client configuration object
 * 
 * Contains all necessary configuration for Firebase client-side operations.
 * These values are safe to expose in the browser and are used for:
 * - Authentication (login, logout, user management)
 * - Database access (read/write operations)
 * - Storage operations
 * 
 * @constant {Object} firebaseConfig
 * @property {string} apiKey - Firebase API key for client authentication
 * @property {string} authDomain - Domain for Firebase authentication
 * @property {string} projectId - Firebase project identifier
 * @property {string} storageBucket - Firebase storage bucket URL
 * @property {string} messagingSenderId - Firebase messaging sender ID
 * @property {string} appId - Firebase application ID
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

/**
 * Required Firebase configuration keys for validation
 * 
 * @constant {string[]} requiredKeys
 */
const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];

/**
 * Validate Firebase configuration completeness
 * 
 * Checks if all required environment variables are set before initializing Firebase.
 * Throws an error if any required keys are missing.
 * 
 * @throws {Error} When Firebase configuration is incomplete
 */
const missingKeys = requiredKeys.filter(key => !firebaseConfig[key as keyof typeof firebaseConfig]);

if (missingKeys.length > 0) {
  console.error('Missing Firebase config keys:', missingKeys);
  throw new Error(`Firebase configuration incomplete. Missing: ${missingKeys.join(', ')}`);
}

/**
 * Firebase app instance
 * 
 * Holds the initialized Firebase application. Ensures only one instance
 * exists across the application to prevent conflicts.
 * 
 * @type {FirebaseApp}
 */
let app: FirebaseApp;

/**
 * Initialize Firebase app if not already initialized
 * 
 * This ensures only one Firebase app instance exists across the application.
 * Uses the validated configuration object for initialization.
 * 
 * @type {FirebaseApp} Initialized Firebase app instance
 * @throws {Error} When Firebase initialization fails
 */
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

/**
 * Firebase Authentication instance for client-side operations
 * 
 * Provides client-side authentication capabilities:
 * - User sign-in/sign-out
 * - Authentication state management
 * - Google authentication provider
 * 
 * @constant {ReturnType<typeof getAuth>} auth
 * @example
 * ```typescript
 * // Sign in with email/password
 * const userCredential = await signInWithEmailAndPassword(auth, email, password);
 * 
 * // Listen to auth state changes
 * onAuthStateChanged(auth, (user) => {
 *   if (user) console.log('User signed in:', user.email);
 * });
 * ```
 */
export const auth = getAuth(app);

/**
 * Firebase Firestore instance for client-side database operations
 * 
 * Provides client-side database access:
 * - Read/write to Firestore collections
 * - Real-time data synchronization
 * - Query operations
 * 
 * @constant {ReturnType<typeof getFirestore>} db
 * @example
 * ```typescript
 * // Get a document
 * const docRef = doc(db, 'members', 'memberId');
 * const docSnap = await getDoc(docRef);
 * 
 * // Add a document
 * await addDoc(collection(db, 'members'), memberData);
 * ```
 */
export const db = getFirestore(app);

/**
 * Google authentication provider for sign-in
 * 
 * Configured with custom parameters to ensure users can select
 * their Google account when signing in.
 * 
 * @constant {GoogleAuthProvider} googleProvider
 * @example
 * ```typescript
 * // Sign in with Google
 * const result = await signInWithPopup(auth, googleProvider);
 * ```
 */
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

/**
 * Prevent multiple auth instances in development
 * 
 * This check helps identify if multiple Firebase Auth instances
 * are being created, which can cause issues in development.
 * Only runs in browser environment.
 */
if (typeof window !== 'undefined') {
  // Only run in browser
  if ((window as any).__FIREBASE_AUTH_INSTANCE__) {
    console.warn('Firebase Auth already initialized');
  } else {
    (window as any).__FIREBASE_AUTH_INSTANCE__ = auth;
  }
}

/**
 * Check if Firebase is ready for use
 * 
 * Validates that all Firebase services (app, auth, db) are properly initialized
 * and ready for use. This is useful for ensuring Firebase is ready before
 * attempting operations.
 * 
 * @function isFirebaseReady
 * @returns {boolean} True if Firebase is fully initialized and ready
 * 
 * @example
 * ```typescript
 * if (isFirebaseReady()) {
 *   // Firebase is ready, proceed with operations
 *   await signInWithEmailAndPassword(auth, email, password);
 * } else {
 *   // Wait for Firebase to be ready
 *   console.log('Firebase not ready yet');
 * }
 * ```
 */
export const isFirebaseReady = () => {
  return !!app && !!auth && !!db;
};


