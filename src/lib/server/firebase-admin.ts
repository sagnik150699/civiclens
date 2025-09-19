
import { initializeApp, getApps, getApp, type App } from 'firebase-admin/app';
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

  if (!process.env.FIREBASE_PRIVATE_KEY) {
    throw new Error('FIREBASE_PRIVATE_KEY is not set in the environment variables.');
  }

  const serviceAccount = {
    projectId: 'civiclens-bexm4',
    clientEmail: `firebase-adminsdk-v59j3@civiclens-bexm4.iam.gserviceaccount.com`,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
  };

  let app: App;
  if (!getApps().length) {
    app = initializeApp({
      credential: {
        projectId: serviceAccount.projectId,
        clientEmail: serviceAccount.clientEmail,
        privateKey: serviceAccount.privateKey,
      },
    });
  } else {
    app = getApp();
  }

  const db: Firestore = getFirestore(app);
  const bucket: Storage['bucket'] = getStorage(app).bucket('civiclens-bexm4.appspot.com');

  admin = { app, db, bucket };
  return admin;
}
