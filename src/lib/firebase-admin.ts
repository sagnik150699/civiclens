
import { initializeApp, getApps, App, cert, applicationDefault } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

// This function provides a robust way to initialize the Firebase Admin SDK.
export function getAdminApp(): App {
  if (getApps().length) {
    return getApps()[0];
  }

  // --- Explicit Configuration ---
  // The Admin SDK must use the .appspot.com GCS bucket name.
  const projectId = "civiclens-bexm4";
  const storageBucket = "civiclens-bexm4.appspot.com"; 

  let credential;
  const serviceAccountEnv = process.env.FIREBASE_SERVICE_ACCOUNT;
  
  if (serviceAccountEnv) {
    try {
        let serviceAccount = JSON.parse(serviceAccountEnv);
        // Vercel and other environments can escape newlines. This line fixes them.
        if (serviceAccount.private_key) {
            serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
        }
        credential = cert(serviceAccount);
    } catch (e) {
        console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT. Falling back to default credentials.", e);
        credential = applicationDefault();
    }
  } else {
    credential = applicationDefault();
  }
  
  const app = initializeApp({
    credential,
    projectId,
    storageBucket,
  });
  
  console.log("[Admin Init] Initialized with explicit projectId:", projectId, "and storageBucket:", storageBucket);
  return app;
}

export const adminBucket = () => getStorage(getAdminApp()).bucket();
