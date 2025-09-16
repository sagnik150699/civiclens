
'use server';

import { initializeApp, getApps, App, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

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
