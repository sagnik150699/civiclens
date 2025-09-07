
import { initializeApp, getApps, App, cert, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { getAuth } from 'firebase-admin/auth';

const {
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
  GOOGLE_APPLICATION_CREDENTIALS,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
} = process.env;

function buildCredential() {
  // Use ADC if explicitly configured or available in environment
  if (GOOGLE_APPLICATION_CREDENTIALS && GOOGLE_APPLICATION_CREDENTIALS.trim() !== '') {
    return applicationDefault();
  }

  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
    const missing = [
      !FIREBASE_PROJECT_ID && 'FIREBASE_PROJECT_ID',
      !FIREBASE_CLIENT_EMAIL && 'FIREBASE_CLIENT_EMAIL',
      !FIREBASE_PRIVATE_KEY && 'FIREBASE_PRIVATE_KEY',
    ]
      .filter(Boolean)
      .join(', ');
    throw new Error(
      `Firebase Admin credentials missing: ${missing}. ` +
      `Set GOOGLE_APPLICATION_CREDENTIALS for ADC or provide the three explicit env vars.`
    );
  }

  const privateKey = FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

  return cert({
    projectId: FIREBASE_PROJECT_ID,
    clientEmail: FIREBASE_CLIENT_EMAIL,
    privateKey,
  });
}

function getAdminApp(): App {
  const apps = getApps();
  if (apps.length) {
    return apps[0];
  }
  return initializeApp({ 
    credential: buildCredential(),
    storageBucket: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

function getAdminStorage() {
  return getStorage(getAdminApp());
}

function getAdminAuth() {
  return getAuth(getAdminApp());
}

export { getAdminApp, getAdminStorage, getAdminAuth };
