
import { initializeApp, getApps, App, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

const FIREBASE_APP_NAME = 'firebase-admin-app-civiclens';

export function getAdminApp(): App {
  const apps = getApps();
  const existingApp = apps.find(app => app.name === FIREBASE_APP_NAME);
  if (existingApp) {
    return existingApp;
  }

  return initializeApp({
    credential: applicationDefault(),
    projectId: 'civiclens-bexm4',
    storageBucket: 'civiclens-bexm4.appspot.com',
  }, FIREBASE_APP_NAME);
}

export function adminDb() {
  return getFirestore(getAdminApp());
}

export const adminBucket = () => getStorage(getAdminApp()).bucket();
