import admin from 'firebase-admin';

if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.applicationDefault(),
            databaseURL: `https://${process.env.GCLOUD_PROJECT}.firebaseio.com`,
        });
    } catch (error) {
        console.log('Firebase admin initialization error', error);
    }
}

export const adminDb = admin.firestore();
