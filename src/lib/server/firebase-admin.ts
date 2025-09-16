'server-only';
import { initializeApp, getApps, cert, type AppOptions } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { firebaseCredentials } from './credentials';

let db: ReturnType<typeof getFirestore> | null = null;
let bucket: ReturnType<typeof getStorage>['bucket'] | null = null;

if (firebaseCredentials.projectId !== "your-project-id" && firebaseCredentials.clientEmail !== "your-client-email@your-project-id.iam.gserviceaccount.com") {
    try {
      const appOptions: AppOptions = {
        credential: cert({
          projectId: firebaseCredentials.projectId,
          clientEmail: firebaseCredentials.clientEmail,
          privateKey: firebaseCredentials.privateKey,
        }),
        storageBucket: 'civiclens-bexm4.appspot.com',
      };

      const app = getApps().length ? getApps()[0] : initializeApp(appOptions);

      db = getFirestore(app);
      bucket = getStorage(app).bucket();
    } catch (error) {
        console.error('Firebase Admin initialization failed. Please check your credentials.', error);
    }
} else {
    console.warn('Firebase Admin SDK not initialized. Using placeholder credentials in src/lib/server/credentials.ts. The app will not connect to the database.');
}


export { db, bucket };
