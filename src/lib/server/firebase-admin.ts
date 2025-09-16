import { initializeApp, getApps, App, cert, type AppOptions } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let db: Firestore | null = null;

try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    // Vercel/Firebase App Hosting stores multiline envs escaped; fix newlines:
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
        console.warn('Firebase Admin environment variables not set. App will not be able to connect to Firestore. Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.');
    } else {
        const app =
        getApps()[0] ??
        initializeApp({
            credential: cert({ projectId, clientEmail, privateKey }),
        } as AppOptions);

        db = getFirestore(app);
    }
} catch (error) {
    console.error("Failed to initialize Firebase Admin SDK:", error);
}


export { db };
