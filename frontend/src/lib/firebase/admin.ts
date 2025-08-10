import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const projectId = process.env.FIREBASE_PROJECT_ID!;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL!;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")!;

let app: App;

if (!getApps().length) {
  app = initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
} else {
  app = getApps()[0] as App;
}

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);


