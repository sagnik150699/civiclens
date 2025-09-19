
import { initializeApp, getApps, getApp, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getStorage, type Storage } from 'firebase-admin/storage';

let app: App;
let db: Firestore;
let bucket: Storage['bucket'];

try {
  if (!getApps().length) {
    app = initializeApp();
  } else {
    app = getApp();
  }

  db = getFirestore(app);
  bucket = getStorage(app).bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
  
} catch (error) {
    console.error('Firebase Admin initialization failed:', error);
}

export { db, bucket };
