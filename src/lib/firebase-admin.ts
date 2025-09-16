
import { initializeApp, getApps, App, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// This is the correct way to initialize the Firebase Admin SDK in a serverless environment.
// It ensures that the app is only initialized once.
function getAdminApp(): App {
  if (getApps().length) {
    return getApps()[0];
  }
  return initializeApp({
    credential: applicationDefault(),
    storageBucket: 'civiclens-bexm4.appspot.com',
  });
}

const db = getFirestore(getAdminApp());

export { db };
