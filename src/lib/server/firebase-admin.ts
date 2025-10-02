
import { initializeApp, getApps, getApp, type App, cert, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { firebaseConfig } from '../firebase-client';

interface FirebaseAdmin {
  app: App;
  db: Firestore;
  bucket: ReturnType<typeof getStorage>['bucket'];
}

let admin: FirebaseAdmin | null = null;

export function getFirebaseAdmin(): FirebaseAdmin {
  if (admin) {
    return admin;
  }

  try {
    const serviceAccount = buildServiceAccountFromEnv();

    const rawStorageBucket =
      process.env.FIREBASE_STORAGE_BUCKET ??
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ??
      firebaseConfig.storageBucket ??
      (serviceAccount.projectId ? `${serviceAccount.projectId}.appspot.com` : undefined);

    const storageBucket = normalizeStorageBucket(rawStorageBucket);

    if (!serviceAccount.clientEmail) {
      throw new Error('Firebase Admin client email is not configured.');
    }

    if (!serviceAccount.privateKey || serviceAccount.privateKey.includes('YOUR_PRIVATE_KEY_HERE')) {
      throw new Error('FIREBASE_PRIVATE_KEY is not set or is a placeholder in the environment variables.');
    }

    if (!storageBucket) {
      throw new Error(
        'Firebase storage bucket is not configured. Set FIREBASE_STORAGE_BUCKET, NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, or ensure your Firebase project has a default bucket.'
      );
    }

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
    const bucket = getStorage(app).bucket(storageBucket);
  
    admin = { app, db, bucket };
    return admin;
  } catch (error: unknown) {
    console.error("Firebase Admin SDK initialization error:", error);
    if (error instanceof Error) {
      throw new Error(`Firebase Admin SDK initialization failed. This is often due to an invalid or missing private key in your .env file. Original error: ${error.message}`);
    }
    throw new Error('Firebase Admin SDK initialization failed due to an unknown error.');
  }
}

function buildServiceAccountFromEnv(): ServiceAccount {
  const serviceAccountEnv = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (serviceAccountEnv) {
    try {
      const parsed = JSON.parse(serviceAccountEnv) as {
        project_id?: string;
        client_email?: string;
        private_key?: string;
      };

      return {
        projectId: parsed.project_id ?? firebaseConfig.projectId,
        clientEmail: parsed.client_email,
        privateKey: parsed.private_key?.replace(/\\n/g, '\n'),
      };
    } catch {
      throw new Error('FIREBASE_SERVICE_ACCOUNT is defined but could not be parsed as JSON.');
    }
  }

  return {
    projectId: process.env.FIREBASE_PROJECT_ID ?? firebaseConfig.projectId,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };
}

function normalizeStorageBucket(bucket: string | undefined): string | undefined {
  if (!bucket) {
    return bucket;
  }

  let normalizedBucket = bucket.trim();

  if (normalizedBucket.startsWith('gs://')) {
    normalizedBucket = normalizedBucket.slice('gs://'.length);
  }

  // Strip any accidental path suffixes so we only keep the bucket identifier.
  const slashIndex = normalizedBucket.indexOf('/');
  if (slashIndex !== -1) {
    normalizedBucket = normalizedBucket.slice(0, slashIndex);
  }

  return normalizedBucket;
}
