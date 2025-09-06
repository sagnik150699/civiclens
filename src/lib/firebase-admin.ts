
import admin from 'firebase-admin';

// Firebase Admin SDK requires valid credentials which may not always be
// available in local/test environments. Attempt initialization but swallow any
// errors so that importing this module does not crash the app.
try {
  if (!admin.apps.length) {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64
      ? Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64, 'base64').toString('utf-8')
      : undefined;

    if (serviceAccountKey) {
      // Running in a local or CI environment with a service account key
      admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(serviceAccountKey)),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      });
    } else {
      // Running in a Google Cloud environment (e.g., App Hosting)
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      });
    }
  }
} catch (error) {
  console.error('Failed to initialize Firebase Admin SDK:', error);
}

// If initialization failed, admin.apps will be empty and firestore() will
// throw. Guard against this and export `null` instead.
export const adminDb = admin.apps.length ? admin.firestore() : null;
export { admin };
