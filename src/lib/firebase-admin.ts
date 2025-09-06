
import admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    const serviceAccountKeyBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64;
    
    if (serviceAccountKeyBase64) {
      // Decode the base64 service account key
      const serviceAccount = JSON.parse(
        Buffer.from(serviceAccountKeyBase64, 'base64').toString('utf-8')
      );
      
      // Initialize with service account credentials
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      });
    } else {
      // Initialize with application default credentials for production environments
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      });
    }
  } catch (error) {
    console.error('Failed to initialize Firebase Admin SDK:', error);
    // You might want to throw the error in a development environment
    // to catch configuration issues early.
  }
}

// If initialization failed, admin.apps will be empty and firestore() will
// throw. Guard against this and export `null` instead.
export const adminDb = admin.apps.length ? admin.firestore() : null;
export { admin };
