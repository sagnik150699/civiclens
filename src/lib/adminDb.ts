
import { getFirestore } from 'firebase-admin/firestore';
import { getAdminApp } from '@/lib/firebase-admin';

export function adminDb() {
  const app = getAdminApp();
  return getFirestore(app);
}
