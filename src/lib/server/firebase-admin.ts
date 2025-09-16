'server-only';

import { initializeApp, getApps, cert, type AppOptions } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

let db: ReturnType<typeof getFirestore> | null = null;
let bucket: ReturnType<typeof getStorage>['bucket'] | null = null;

try {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // Replace escaped newlines with actual newlines
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (projectId && clientEmail && privateKey) {
    const appOptions: AppOptions = {
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      storageBucket: 'civiclens-bexm4.appspot.com',
    };

    const app = getApps().length ? getApps()[0] : initializeApp(appOptions);
    db = getFirestore(app);
    bucket = getStorage(app).bucket();
  } else {
    console.warn('Firebase Admin SDK not initialized. Required environment variables (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY) are missing. The app will not connect to the database.');
  }
} catch (error) {
  console.error('Firebase Admin initialization failed. Please check your environment variables and credentials.', error);
}

export { db, bucket };
