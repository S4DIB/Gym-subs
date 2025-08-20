import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

/**
 * Firebase project configuration for server-side operations
 * 
 * These environment variables must be set in your deployment environment:
 * - FIREBASE_PROJECT_ID: Your Firebase project identifier
 * - FIREBASE_CLIENT_EMAIL: Service account email for admin access
 * - FIREBASE_PRIVATE_KEY: Private key for service account authentication
 * 
 * @constant {string} projectId - Firebase project identifier
 * @constant {string} clientEmail - Service account email address
 * @constant {string} privateKey - Decoded private key for authentication
 */
const projectId = process.env.FIREBASE_PROJECT_ID!;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL!;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")!;

/**
 * Firebase Admin app instance
 * 
 * This variable holds the initialized Firebase Admin application.
 * It's initialized only once and reused across the application.
 * 
 * @type {App}
 */
let app: App;

/**
 * Initialize Firebase Admin app if not already initialized
 * 
 * This ensures only one Firebase Admin instance exists across the application.
 * Uses service account credentials for server-side authentication.
 * 
 * @type {App} Initialized Firebase Admin app instance
 */
if (!getApps().length) {
  app = initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
} else {
  app = getApps()[0] as App;
}

/**
 * Firebase Admin Authentication instance
 * 
 * Provides server-side authentication capabilities:
 * - Verify user ID tokens
 * - Manage user accounts
 * - Handle authentication state
 * 
 * @constant {ReturnType<typeof getAuth>} adminAuth
 * @example
 * ```typescript
 * // Verify a user's ID token
 * const decodedToken = await adminAuth.verifyIdToken(token);
 * const userId = decodedToken.uid;
 * ```
 */
export const adminAuth = getAuth(app);

/**
 * Firebase Admin Firestore instance
 * 
 * Provides server-side database access:
 * - Read/write to Firestore collections
 * - Perform complex queries
 * - Manage database operations
 * 
 * @constant {ReturnType<typeof getFirestore>} adminDb
 * @example
 * ```typescript
 * // Get a collection reference
 * const membersRef = adminDb.collection('members');
 * 
 * // Perform a query
 * const snapshot = await membersRef.where('status', '==', 'active').get();
 * ```
 */
export const adminDb = getFirestore(app);


