
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { admin, adminDb } from '@/lib/firebase-admin';
import { ISSUE_CATEGORIES, ISSUE_STATUSES } from './constants';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { collection, getDocs, query, orderBy, Timestamp, addDoc, doc, updateDoc } from 'firebase/firestore';
import type { IssueReport, IssueStatus } from '@/lib/data';


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
      if (!admin.apps.length) {
        throw new Error('Firebase Admin SDK not configured for storage.');
      }

      const buffer = Buffer.from(await photo.arrayBuffer());
      const bucket = admin.storage().bucket();
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

    if (!adminDb) {
      throw new Error('Firestore is not initialized. Check your server environment configuration.');
    }
    const db = adminDb;

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

    await addDoc(collection(db, 'issues'), newIssue);

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
    const validated = updateStatusSchema.safeParse({id, status});

    if (!validated.success) {
        return { success: false, message: "Invalid data provided."}
    }

    try {
        if (!adminDb) {
            throw new Error('Firestore is not initialized. Check your server environment configuration.');
        }
        const db = adminDb;
        const issueRef = doc(db, 'issues', id);
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
    try {
      if (!adminDb) {
        console.error('Firestore not initialized. Check server environment.');
        return [];
      };
      const db = adminDb;
      const issuesCollection = collection(db, 'issues');
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
