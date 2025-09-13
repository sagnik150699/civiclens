
import { initializeApp, getApps, App, cert, applicationDefault } from 'firebase-admin/app';

export function getAdminApp(): App {
  if (getApps().length) {
    return getApps()[0];
  }

  const credential = process.env.FIREBASE_SERVICE_ACCOUNT
    ? cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
    : applicationDefault();

  return initializeApp({
    credential,
    storageBucket: 'civiclens-bexm4.firebasestorage.app',
  });
}
