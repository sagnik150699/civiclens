
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';

function getAdminApp(): App {
  const apps = getApps();
  if (apps.length) {
    return apps[0];
  }

  // Recommended: store the whole service account JSON in one env var
  // e.g. FIREBASE_SERVICE_ACCOUNT (stringified JSON)
  if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is not set.');
  }
  const svc = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

  return initializeApp({
    credential: cert({
      projectId: svc.project_id,
      clientEmail: svc.client_email,
      // Important on Vercel/similar environments: fix escaped newlines
      privateKey: svc.private_key.replace(/\\n/g, '\n'),
    }),
    projectId: svc.project_id,
    storageBucket: 'civiclens-bexm4.appspot.com',
  });
}

export { getAdminApp };
