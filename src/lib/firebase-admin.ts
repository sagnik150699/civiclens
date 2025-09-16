
import { initializeApp, getApps, App, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

const FIREBASE_APP_NAME = 'firebase-admin-app-civiclens';

// This function is the single source of truth for the Firebase Admin App instance.
export function getAdminApp(): App {
  // Check if the app is already initialized to prevent errors.
  if (getApps().some(app => app.name === FIREBASE_APP_NAME)) {
    return getApps().find(app => app.name === FIREBASE_APP_NAME)!;
  }

  // Initialize the app with explicit credentials and project details.
  // This is the most robust method for Google Cloud environments like App Hosting.
  return initializeApp({
    credential: applicationDefault(),
    projectId: 'civiclens-bexm4',
    storageBucket: 'civiclens-bexm4.appspot.com',
  }, FIREBASE_APP_NAME);
}

// Export functions to get db and storage, ensuring they use the initialized app.
export function adminDb() {
  return getFirestore(getAdminApp());
}

export const adminBucket = () => getStorage(getAdminApp()).bucket();
