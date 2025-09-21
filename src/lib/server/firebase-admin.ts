
import { initializeApp, getApps, getApp, type App, cert, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getStorage, type Storage } from 'firebase-admin/storage';
import { firebaseConfig } from '../firebase-client';

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
    const serviceAccount: ServiceAccount = {
      projectId: firebaseConfig.projectId,
      clientEmail: `firebase-adminsdk-v59j3@${firebaseConfig.projectId}.iam.gserviceaccount.com`,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };
    
    if (!serviceAccount.privateKey || serviceAccount.privateKey.includes('YOUR_PRIVATE_KEY_HERE')) {
        throw new Error('FIREBASE_PRIVATE_KEY is not set or is a placeholder in the environment variables.');
    }

    let app: App;
    if (!getApps().length) {
      app = initializeApp({
        credential: cert(serviceAccount),
        storageBucket: firebaseConfig.storageBucket,
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
