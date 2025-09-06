
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { ISSUE_CATEGORIES, ISSUE_STATUSES } from './constants';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { collection, getDocs, query, orderBy, Timestamp, addDoc, doc, updateDoc } from 'firebase/firestore';
import type { IssueReport, IssueStatus } from '@/lib/data';
import admin from 'firebase-admin';

// --- Firebase Admin Initialization ---
const initializeFirebaseAdmin = () => {
  if (admin.apps.length > 0) {
    return;
  }

  const serviceAccountKeyBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64;
  if (!serviceAccountKeyBase64) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY_BASE64 environment variable is not set. Please check your .env file.');
  }

  try {
    const serviceAccountJson = Buffer.from(serviceAccountKeyBase64, 'base64').toString('utf-8');
    const serviceAccount = JSON.parse(serviceAccountJson);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
  } catch (error) {
    console.error("Failed to initialize Firebase Admin SDK:", error);
    // We throw the error to make it visible during development
    throw new Error('Server configuration error: Could not initialize Firebase Admin SDK. Check server logs.');
  }
};

const getAdminDb = () => {
  if (admin.apps.length === 0) {
    initializeFirebaseAdmin();
  }
  return admin.firestore();
};

const getAdminStorage = () => {
    if (admin.apps.length === 0) {
        initializeFirebaseAdmin();
    }
    return admin.storage();
}
// --- End of Firebase Admin Initialization ---


const issueSchema = z.object({
  description: z.string().min(10, 'Please provide a more detailed description.'),
  category: z.enum(ISSUE_CATEGORIES.map(c => c.value) as [string, ...string[]], {
    errorMap: () => ({ message: "Please select a category." }),
  }),
  photo: z.instanceof(File).optional(),
  address: z.string().min(1, 'Address is required.'),
  lat: z.string().optional(),
  lng: z.string().optional(),
});

export async function submitIssue(prevState: any, formData: FormData | null) {
  if (!formData) {
    return { success: false, message: '', errors: {} };
  }
  
  const adminDb = getAdminDb();
  if (!adminDb) {
    return { success: false, message: 'Server configuration error: Database not available.', errors: {} };
  }

  const validatedFields = issueSchema.safeParse({
    description: formData.get('description'),
    category: formData.get('category'),
    photo: formData.get('photo'),
    address: formData.get('address'),
    lat: formData.get('lat'),
    lng: formData.get('lng'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed. Please check your inputs.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  try {
    const { description, category, photo, address, lat, lng } = validatedFields.data;
    let photoUrl = null;

    if (photo && photo.size > 0) {
      const storage = getAdminStorage();
      if (!storage) {
        throw new Error('Server configuration error: Storage not available.');
      }
      
      const buffer = Buffer.from(await photo.arrayBuffer());
      const bucket = storage.bucket();
      const fileName = `issues/${Date.now()}-${photo.name}`;
      const file = bucket.file(fileName);

      await file.save(buffer, {
          metadata: {
              contentType: photo.type,
          },
      });

      await file.makePublic();
      photoUrl = file.publicUrl();
    }

    const location = {
      lat: lat ? parseFloat(lat) : 34.0522 + (Math.random() - 0.5) * 0.1,
      lng: lng ? parseFloat(lng) : -118.2437 + (Math.random() - 0.5) * 0.1,
    };

    const newIssue = {
        description,
        category,
        location,
        photoUrl,
        status: 'Submitted' as IssueStatus,
        priority: 'Medium' as const,
        address: address,
        reason: 'Awaiting review',
        createdAt: Timestamp.now(),
    };

    await addDoc(collection(adminDb, 'issues'), newIssue);

    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true, message: 'Issue reported successfully! Our team will review it shortly.', errors: {} };

  } catch (error) {
    console.error("Error submitting issue:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { success: false, message: `Submission failed: ${errorMessage}`, errors: {} };
  }
}

const updateStatusSchema = z.object({
    id: z.string(),
    status: z.enum(ISSUE_STATUSES)
})

export async function updateIssueStatus(id: string, status: IssueStatus) {
    const adminDb = getAdminDb();
    if (!adminDb) {
      return { success: false, message: 'Server configuration error: Database not available.' };
    }
    const validated = updateStatusSchema.safeParse({id, status});

    if (!validated.success) {
        return { success: false, message: "Invalid data provided."}
    }

    try {
        const issueRef = doc(adminDb, 'issues', id);
        await updateDoc(issueRef, { status });
        
        revalidatePath('/admin');
        return { success: true, message: `Status updated to ${status}`};
    } catch (error)
    {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
        return { success: false, message: `Failed to update status: ${errorMessage}`}
    }
}

export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (email === 'admin' && password === 'admin') {
    const sessionData = { user: 'admin', loggedIn: true };
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    cookies().set('session', JSON.stringify(sessionData), { maxAge: expiresIn, httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    redirect('/admin');
  } else {
      return { success: false, message: 'Invalid username or password.' };
  }
}

export async function logout() {
  cookies().set('session', '', { expires: new Date(0) });
  redirect(`/login`);
}

export const getIssues = async (): Promise<IssueReport[]> => {
    const adminDb = getAdminDb();
    if (!adminDb) {
      console.error('Database not available, cannot fetch issues.');
      return [];
    }
    try {
      const issuesCollection = collection(adminDb, 'issues');
      const q = query(issuesCollection, orderBy('createdAt', 'desc'));
      const issuesSnapshot = await getDocs(q);
      const issuesList = issuesSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: (data.createdAt as Timestamp).toDate(),
        } as IssueReport;
      });
      return issuesList;
    } catch (error) {
      console.error('Error fetching issues from Firestore: ', error);
      return [];
    }
  };
