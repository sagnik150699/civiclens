
import { initializeApp, getApps, App, cert, applicationDefault } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

function safeParseJSON(str?: string) {
  if (!str) return null;
  try {
    const parsed = JSON.parse(str);
    // Vercel and other environments can escape newlines. This line fixes them.
    if (parsed.private_key) {
        parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
    }
    return parsed;
  } catch {
    return null;
  }
}

// This function provides a robust way to initialize the Firebase Admin SDK.
export function getAdminApp(): App {
  if (getApps().length) {
    return getApps()[0];
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT || "civiclens-bexm4";
  const resolvedBucket = process.env.FIREBASE_STORAGE_BUCKET || "civiclens-bexm4.firebasestorage.app";

  const serviceAccount = safeParseJSON(process.env.FIREBASE_SERVICE_ACCOUNT);
  
  const app = initializeApp({
    credential: serviceAccount ? cert(serviceAccount) : applicationDefault(),
    projectId,
    storageBucket: resolvedBucket,
  });
  
  console.log("[Admin Init] projectId:", projectId, "bucket:", resolvedBucket);
  return app;
}

export const adminBucket = () => getStorage(getAdminApp()).bucket();
