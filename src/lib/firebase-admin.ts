
import { initializeApp, getApps, App, cert, applicationDefault } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

// This function provides a robust way to initialize the Firebase Admin SDK.
export function getAdminApp(): App {
  if (getApps().length) {
    return getApps()[0];
  }

  const projectId = "civiclens-bexm4";
  // The .appspot.com format is the GCS bucket name, which is what the Admin SDK needs.
  const storageBucket = "civiclens-bexm4.appspot.com"; 

  // When running in a Google Cloud environment (like App Hosting),
  // it's best to use Application Default Credentials.
  // The SDK will automatically find the correct service account.
  const credential = applicationDefault();
  
  const app = initializeApp({
    credential,
    projectId,
    storageBucket,
  });
  
  console.log("[Admin Init] Initialized with explicit projectId:", projectId, "and storageBucket:", storageBucket);
  return app;
}

export const adminBucket = () => getStorage(getAdminApp()).bucket();
