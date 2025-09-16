
'server-only';
import { initializeApp, getApps, App, cert, type AppOptions } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { firebaseCredentials } from './credentials';


let db: Firestore | null = null;
let bucket = null;

try {
  // Hardcode credentials from the credentials.ts file
  const creds = firebaseCredentials;

  if (creds && creds.projectId && creds.clientEmail && creds.privateKey && !creds.projectId.includes('your-project-id')) {
    const appOptions: AppOptions = {
      credential: cert({
        projectId: creds.projectId,
        clientEmail: creds.clientEmail,
        privateKey: creds.privateKey,
      }),
      storageBucket: 'civiclens-bexm4.appspot.com',
    };
    
    const app = getApps()[0] ?? initializeApp(appOptions);

    db = getFirestore(app);
    bucket = getStorage(app).bucket();
  } else {
    console.warn("Firebase Admin credentials not found or are placeholders in src/lib/server/credentials.ts. Please add them to enable backend functionality.");
  }

} catch (error) {
    console.error("Failed to initialize Firebase Admin SDK:", error);
}

export { db, bucket };
