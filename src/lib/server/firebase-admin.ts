
import { initializeApp, getApps, getApp, type App, cert } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getStorage, type Storage } from 'firebase-admin/storage';

interface FirebaseAdmin {
  app: App;
  db: Firestore;
  bucket: Storage['bucket'];
}

let admin: FirebaseAdmin | null = null;

export function getFirebaseAdmin(): FirebaseAdmin {
  if (admin) {
    return admin;
  }

  try {
    const serviceAccount = {
        projectId: 'civiclens-bexm4',
        clientEmail: `firebase-adminsdk-v59j3@civiclens-bexm4.iam.gserviceaccount.com`,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };

    if (!serviceAccount.privateKey) {
        throw new Error('FIREBASE_PRIVATE_KEY is not set in the environment variables.');
    }

    let app: App;
    if (!getApps().length) {
      app = initializeApp({
        credential: cert(serviceAccount),
        storageBucket: 'civiclens-bexm4.appspot.com',
      });
    } else {
      app = getApp();
    }
  
    const db: Firestore = getFirestore(app);
    const bucket: Storage['bucket'] = getStorage(app).bucket();
  
    admin = { app, db, bucket };
    return admin;
  } catch (error: any) {
    console.error("Firebase Admin SDK initialization error:", error);
    // Re-throw a more descriptive error to help with debugging
    throw new Error(`Firebase Admin SDK initialization failed. This is often due to an invalid or missing private key in your .env file. Original error: ${error.message}`);
  }
}
