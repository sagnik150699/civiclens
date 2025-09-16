
'server-only';
import { initializeApp, getApps, App, cert, type AppOptions } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';


let db: Firestore | null = null;
let bucket = null;

try {
  function loadCredentials() {
    // Option A: Single Base64 JSON (recommended on Vercel)
    const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
    if (b64 && b64.trim()) {
      try {
        const json = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
        return {
          projectId: json.project_id,
          clientEmail: json.client_email,
          privateKey: json.private_key,
        };
      } catch (e) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT_BASE64 is invalid Base64/JSON.');
      }
    }

    // Option B: Split env vars
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (privateKey?.includes('\\n')) {
      // Vercel/ENV friendly newline fix
      privateKey = privateKey.replace(/\\n/g, '\n');
    }

    if (!projectId || !clientEmail || !privateKey) {
      return null;
    }

    return { projectId, clientEmail, privateKey };
  }

  const creds = loadCredentials();

  if (creds) {
    const appOptions: AppOptions = {
      credential: cert({
        projectId: creds.projectId,
        clientEmail: creds.clientEmail,
        privateKey: creds.privateKey,
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'civiclens-bexm4.appspot.com',
    };
    
    const app = getApps()[0] ?? initializeApp(appOptions);

    db = getFirestore(app);
    bucket = getStorage(app).bucket();
  } else {
    console.warn("Firebase Admin environment variables not set. App will not be able to connect to Firestore. Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY, OR FIREBASE_SERVICE_ACCOUNT_BASE64.");
  }

} catch (error) {
    console.error("Failed to initialize Firebase Admin SDK:", error);
}

export { db, bucket };
