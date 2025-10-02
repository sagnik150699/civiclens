import { initializeApp, getApps, getApp, type App, cert, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

interface FirebaseAdmin {
  app: App;
  db: Firestore;
  bucket: ReturnType<typeof getStorage>['bucket'];
}

let admin: FirebaseAdmin | null = null;

function getServiceAccount(): ServiceAccount {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!serviceAccountJson) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is not set.');
  }
  try {
    const serviceAccount = JSON.parse(serviceAccountJson);
    return {
      ...serviceAccount,
      privateKey: serviceAccount.private_key.replace(/\\n/g, '\n'),
    };
  } catch (error) {
    throw new Error('Failed to parse FIREBASE_SERVICE_ACCOUNT. Make sure it is a valid JSON string.');
  }
}

export function getFirebaseAdmin(): FirebaseAdmin {
  if (admin) {
    return admin;
  }

  try {
    const serviceAccount = getServiceAccount();
    const storageBucket = "civiclens-bexm4.appspot.com";

    let app: App;
    if (!getApps().length) {
      app = initializeApp({
        credential: cert(serviceAccount),
        storageBucket,
      });
    } else {
      app = getApp();
    }

    const db: Firestore = getFirestore(app);
    const bucket = getStorage(app).bucket();
  
    admin = { app, db, bucket };
    return admin;
  } catch (error: unknown) {
    console.error("Firebase Admin SDK initialization error:", error);
    if (error instanceof Error) {
      throw new Error(`Firebase Admin SDK initialization failed. Original error: ${error.message}`);
    }
    throw new Error('Firebase Admin SDK initialization failed due to an unknown error.');
  }
}
