
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { ISSUE_CATEGORIES, ISSUE_STATUSES } from './constants';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Timestamp } from 'firebase-admin/firestore';
import type { IssueReport, IssueStatus } from '@/lib/data';
import { adminDb } from '@/lib/adminDb';

const issueSchema = z.object({
  description: z.string().min(10, 'Please provide a more detailed description.'),
  category: z.enum(ISSUE_CATEGORIES.map(c => c.value) as [string, ...string[]], {
    errorMap: () => ({ message: "Please select a category." }),
  }),
  photoUrl: z.string().url('Invalid URL format.').optional().or(z.literal('')),
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
        photoUrl: formData.get('photoUrl'),
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
    const db = adminDb();
    const { description, category, address, lat, lng } = validatedFields.data;
    const photoUrl = validatedFields.data.photoUrl || null;

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

    await db.collection('issues').add(newIssue);

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
        const db = adminDb();
        const issueRef = db.collection('issues').doc(id);
        await issueRef.update({ status });
        
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
      const db = adminDb();
      const issuesCollection = db.collection('issues');
      const q = issuesCollection.orderBy('createdAt', 'desc');
      const issuesSnapshot = await q.get();
      const issuesList = issuesSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: (data.createdAt as Timestamp).toDate(),
        } as unknown as IssueReport;
      });
      return issuesList;
    } catch (error) {
      console.error('Error fetching issues from Firestore: ', error);
      return [];
    }
  };
