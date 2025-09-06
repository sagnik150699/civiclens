// src/lib/firebase-admin.ts
import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import admin from 'firebase-admin';

const {
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
  GOOGLE_APPLICATION_CREDENTIALS,
} = process.env;

function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const privateKey = FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (GOOGLE_APPLICATION_CREDENTIALS) {
    // For deployed environments (like Firebase App Hosting or Cloud Run),
    // rely on Application Default Credentials.
    return initializeApp();
  }

  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !privateKey) {
    const missing = [
      !FIREBASE_PROJECT_ID && 'FIREBASE_PROJECT_ID',
      !FIREBASE_CLIENT_EMAIL && 'FIREBASE_CLIENT_EMAIL',
      !FIREBASE_PRIVATE_KEY && 'FIREBASE_PRIVATE_KEY',
    ]
      .filter(Boolean)
      .join(', ');

    throw new Error(
      `Firebase Admin credentials missing. Please set the following environment variables: ${missing}`
    );
  }

  return initializeApp({
    credential: cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
}

function getAdminDb() {
  const app = getAdminApp();
  return getFirestore(app);
}

function getAdminStorage() {
  const app = getAdminApp();
  return getStorage(app);
}


export { getAdminApp, getAdminDb, getAdminStorage };
