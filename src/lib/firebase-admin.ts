
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';

export function getAdminApp(): App {
  const apps = getApps();
  if (apps.length) {
    return apps[0];
  }

  // This relies on the FIREBASE_SERVICE_ACCOUNT environment variable being set.
  // It should contain the stringified JSON of your service account key.
  if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is not set.');
  }
  const svc = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

  // Initialize the app with the service account credentials and the correct storage bucket.
  return initializeApp({
    credential: cert({
      projectId: svc.project_id,
      clientEmail: svc.client_email,
      // This replace() is critical for environments like Vercel that escape newlines.
      privateKey: svc.private_key.replace(/\\n/g, '\n'),
    }),
    projectId: svc.project_id,
    storageBucket: 'civiclens-bexm4.appspot.com',
  });
}
