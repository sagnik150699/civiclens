
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';

export function getAdminApp(): App {
  const apps = getApps();
  if (apps.length) {
    return apps[0];
  }

  // This logic correctly handles various ways of providing credentials
  // and was incorrectly replaced in previous attempts.
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // This is the recommended approach for environments like Vercel.
    const svc = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    return initializeApp({
      credential: cert({
        projectId: svc.project_id,
        clientEmail: svc.client_email,
        privateKey: svc.private_key.replace(/\\n/g, '\n'),
      }),
      projectId: svc.project_id,
      storageBucket: 'civiclens-bexm4.appspot.com',
    });
  } else {
    // This allows for local development using separate environment variables.
    return initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: 'civiclens-bexm4.appspot.com',
    });
  }
}
