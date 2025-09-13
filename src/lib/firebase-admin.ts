
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';

// This function now STRICTLY requires the FIREBASE_SERVICE_ACCOUNT environment variable.
// This is the most robust way to ensure correct authentication in all environments.
export function getAdminApp(): App {
  if (getApps().length) {
    return getApps()[0];
  }

  // If the service account JSON is not set, throw an error immediately.
  // This prevents the SDK from falling back to incorrect default credentials.
  if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is not set.');
  }

  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

  // Vercel and other environments can escape newlines. This line fixes them.
  if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
  }

  return initializeApp({
    // Use the explicit service account credential.
    credential: cert(serviceAccount),
    // Use the correct storage bucket name identified from the Firebase config.
    storageBucket: 'civiclens-bexm4.firebasestorage.app',
  });
}
