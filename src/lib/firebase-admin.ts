

import { initializeApp, getApps, App, cert, applicationDefault } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

// This function provides a robust way to initialize the Firebase Admin SDK.
export function getAdminApp(): App {
  if (getApps().length) {
    return getApps()[0];
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT || "civiclens-bexm4";
  const resolvedBucket = process.env.FIREBASE_STORAGE_BUCKET || "civiclens-bexm4.firebasestorage.app";

  const serviceAccountEnv = process.env.FIREBASE_SERVICE_ACCOUNT;
  let credential;

  if (serviceAccountEnv) {
    // If the service account JSON is in an env var, parse it and use it.
    const serviceAccount = JSON.parse(serviceAccountEnv);
    // Vercel and other environments can escape newlines. This line fixes them.
    if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }
    credential = cert(serviceAccount);
  } else {
    // Otherwise, use Application Default Credentials.
    credential = applicationDefault();
  }

  const app = initializeApp({
    credential,
    projectId,
    storageBucket: resolvedBucket,
  });
  
  console.log("[Admin Init] projectId:", projectId, "bucket:", resolvedBucket);
  return app;
}

export const adminBucket = () => getStorage(getAdminApp()).bucket();
