
import { initializeApp, getApps, App, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

// This function provides a robust way to initialize the Firebase Admin SDK.
export function getAdminApp(): App {
  // Check if the app is already initialized to avoid errors.
  if (getApps().length) {
    return getApps()[0];
  }

  // When running in a Google Cloud environment (like App Hosting),
  // it's best to use Application Default Credentials.
  // The SDK will automatically find the correct service account.
  const app = initializeApp({
    credential: applicationDefault(),
    projectId: 'civiclens-bexm4',
    storageBucket: 'civiclens-bexm4.appspot.com',
  });
  
  return app;
}

export function adminDb() {
  return getFirestore(getAdminApp());
}

export const adminBucket = () => getStorage(getAdminApp()).bucket();
