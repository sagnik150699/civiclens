
'use server';

import { initializeApp, getApps, getApp, type App, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getStorage, type Storage } from 'firebase-admin/storage';
import { firebaseConfig } from '../firebase-client';


let app: App;

if (!getApps().length) {
    app = initializeApp({
        credential: {
            projectId: firebaseConfig.projectId,
            clientEmail: `firebase-adminsdk-v59j3@${firebaseConfig.projectId}.iam.gserviceaccount.com`,
            privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
        },
        storageBucket: firebaseConfig.storageBucket,
    });
} else {
  app = getApp();
}

const db: Firestore = getFirestore(app);
const bucket: Storage['bucket'] = getStorage(app).bucket();

export { db, bucket };
