
import { initializeApp, getApps, getApp, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getStorage, type Storage } from 'firebase-admin/storage';

let app: App;

if (!getApps().length) {
  app = initializeApp();
} else {
  app = getApp();
}

const db: Firestore = getFirestore(app);
const bucket: Storage['bucket'] = getStorage(app).bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);

export { db, bucket };
