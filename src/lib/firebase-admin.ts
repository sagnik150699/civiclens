
import admin from 'firebase-admin';

// Firebase Admin SDK requires valid credentials which may not always be
// available in local/test environments. Attempt initialization but swallow any
// errors so that importing this module does not crash the app.
try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
  }
} catch (error) {
  console.error('Failed to initialize Firebase Admin SDK:', error);
}

// If initialization failed, admin.apps will be empty and firestore() will
// throw. Guard against this and export `null` instead.
export const adminDb = admin.apps.length ? admin.firestore() : null;
export { admin };
