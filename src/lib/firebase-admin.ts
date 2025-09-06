
import admin from 'firebase-admin';

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        databaseURL: `https://${process.env.GCLOUD_PROJECT}.firebaseio.com`,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
}

export const adminDb = admin.firestore();
export { admin };
