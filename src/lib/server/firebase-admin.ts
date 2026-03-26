
import 'server-only';

import {
  initializeApp,
  getApps,
  getApp,
  type App,
  cert,
  type ServiceAccount,
  applicationDefault,
} from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

interface FirebaseAdmin {
  app: App;
  db: Firestore;
  bucket: ReturnType<ReturnType<typeof getStorage>['bucket']>;
}

let admin: FirebaseAdmin | null = null;

function getProjectId() {
  return (
    process.env.FIREBASE_PROJECT_ID ??
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ??
    process.env.GOOGLE_CLOUD_PROJECT ??
    process.env.GCLOUD_PROJECT ??
    'civiclens-bexm4'
  );
}

function getStorageBucket(projectId: string) {
  return (
    process.env.FIREBASE_STORAGE_BUCKET ??
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ??
    `${projectId}.firebasestorage.app`
  );
}

function getServiceAccount(): ServiceAccount | null {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (serviceAccountJson) {
    try {
      const serviceAccount = JSON.parse(serviceAccountJson);
      const privateKey = serviceAccount.private_key ?? serviceAccount.privateKey;
      if (typeof privateKey !== 'string' || privateKey.length === 0) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT is missing a private key.');
      }
      return {
        ...serviceAccount,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      };
    } catch (error) {
      if (error instanceof Error && error.message === 'FIREBASE_SERVICE_ACCOUNT is missing a private key.') {
        throw error;
      }
      throw new Error(
        'Failed to parse FIREBASE_SERVICE_ACCOUNT. Make sure it is a valid JSON string.'
      );
    }
  }

  const projectId = getProjectId();
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (clientEmail && privateKey) {
    return {
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, '\n'),
    };
  }

  return null;
}

export function getFirebaseAdmin(): FirebaseAdmin {
  if (admin) {
    return admin;
  }

  try {
    const serviceAccount = getServiceAccount();
    const projectId = getProjectId();
    const storageBucket = getStorageBucket(projectId);

    let app: App;
    if (!getApps().length) {
      app = initializeApp({
        credential: serviceAccount ? cert(serviceAccount) : applicationDefault(),
        projectId,
        storageBucket,
      });
    } else {
      app = getApp();
    }

    const db: Firestore = getFirestore(app);
    const bucket = getStorage(app).bucket();
    const initializedAdmin: FirebaseAdmin = { app, db, bucket };

    admin = initializedAdmin;
    return initializedAdmin;
  } catch (error: unknown) {
    console.error("Firebase Admin SDK initialization error:", error);
    if (error instanceof Error) {
      throw new Error(`Firebase Admin SDK initialization failed. Original error: ${error.message}`);
    }
    throw new Error('Firebase Admin SDK initialization failed due to an unknown error.');
  }
}
