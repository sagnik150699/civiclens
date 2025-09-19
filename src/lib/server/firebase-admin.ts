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

  let app: App;
  if (!getApps().length) {
    app = initializeApp({
      credential: {
        projectId: 'civiclens-bexm4',
        clientEmail: `firebase-adminsdk-v59j3@civiclens-bexm4.iam.gserviceaccount.com`,
        privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
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
