
import { initializeApp, getApps, App, cert, applicationDefault } from 'firebase-admin/app';

// This function provides a robust way to initialize the Firebase Admin SDK.
// It prioritizes a service account from an environment variable, but falls back
// to Application Default Credentials, which works in many Google Cloud environments
// and for local development with `gcloud auth application-default login`.
export function getAdminApp(): App {
  if (getApps().length) {
    return getApps()[0];
  }

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

  return initializeApp({
    credential,
    // Explicitly set the correct storage bucket. This was a key part of the fix.
    storageBucket: 'civiclens-bexm4.appspot.com',
  });
}
