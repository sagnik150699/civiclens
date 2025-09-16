
'server-only';
import { initializeApp, getApps, cert, type AppOptions } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { firebaseCredentials } from './credentials';

let db: ReturnType<typeof getFirestore> | null = null;
let bucket: ReturnType<typeof getStorage>['bucket'] | null = null;

try {
  const appOptions: AppOptions = {
    credential: cert({
      projectId: firebaseCredentials.projectId,
      clientEmail: firebaseCredentials.clientEmail,
      privateKey: firebaseCredentials.privateKey,
    }),
    storageBucket: 'civiclens-bexm4.appspot.com',
  };

  const app = getApps()[0] ?? initializeApp(appOptions);

  db = getFirestore(app);
  bucket = getStorage(app).bucket();
} catch (error) {
  console.warn(
    'Firebase Admin initialization failed. This is expected if credentials are not configured. ' +
    'The app will continue to run, but backend features will be disabled.'
  );
}

export { db, bucket };
