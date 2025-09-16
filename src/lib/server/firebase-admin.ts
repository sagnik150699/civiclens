
import { initializeApp, getApps, cert, type AppOptions } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

// These environment variables are automatically populated by Firebase App Hosting.
const firebaseCredentials = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
};

let db: ReturnType<typeof getFirestore> | null = null;
let bucket: ReturnType<typeof getStorage>['bucket'] | null = null;

try {
  // Check if all necessary credentials are provided
  if (firebaseCredentials.project_id && firebaseCredentials.private_key && firebaseCredentials.client_email) {
    
    const appOptions: AppOptions = {
        credential: cert(firebaseCredentials as any),
        storageBucket: `${firebaseCredentials.project_id}.appspot.com`,
    };

    // Initialize the app if it doesn't already exist.
    const app = getApps().length === 0 ? initializeApp(appOptions) : getApps()[0];
    
    db = getFirestore(app);
    bucket = getStorage(app).bucket();
  } else {
    console.warn("Firebase Admin credentials are not fully configured in environment variables. Backend will not function.");
  }
} catch (error) {
    console.error('Firebase Admin initialization failed:', error);
}

export { db, bucket };
