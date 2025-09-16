
'server-only';

import { initializeApp, getApps, cert, type AppOptions } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

let db: ReturnType<typeof getFirestore> | null = null;
let bucket: ReturnType<typeof getStorage>['bucket'] | null = null;

try {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    const appOptions: AppOptions = {
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      storageBucket: 'civiclens-bexm4.firebasestorage.app',
    };

    // Initialize the app if it doesn't already exist.
    const app = getApps().length ? getApps()[0] : initializeApp(appOptions);
    db = getFirestore(app);
    bucket = getStorage(app).bucket();
    
  } else {
    // This warning will show in the server logs if credentials are not provided.
    // The app will continue to run, but database operations will fail gracefully.
    console.warn('Firebase Admin SDK not initialized. Required environment variables are missing. The app will not connect to the database.');
  }
} catch (error) {
  // Catch any unexpected errors during initialization.
  console.error('Firebase Admin initialization failed. Please check your environment variables and credentials.', error);
}

export { db, bucket };
