
import { initializeApp, getApps, App, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

// This function is the single source of truth for the Firebase Admin App instance.
function getAdminApp(): App {
  // Check if the app is already initialized to prevent errors.
  if (getApps().length) {
    return getApps()[0];
  }

  // Initialize the app using the most robust method for Google Cloud environments.
  // This relies on Application Default Credentials and the GOOGLE_CLOUD_PROJECT env var.
  return initializeApp({
    credential: applicationDefault(),
  });
}

// Export functions to get db and storage, ensuring they use the initialized app.
export function adminDb() {
  return getFirestore(getAdminApp());
}

export const adminBucket = () => getStorage(getAdminApp()).bucket();
