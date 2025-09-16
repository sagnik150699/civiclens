'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { ISSUE_STATUSES } from './constants';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { IssueStatus } from '@/lib/data';
import { adminDb } from '@/lib/firebase-admin';

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

export const getIssues = async (): Promise<import('./data').IssueReport[]> => {
    try {
      const db = adminDb();
      const issuesCollection = db.collection('issues');
      const q = issuesCollection.orderBy('createdAt', 'desc');
      const issuesSnapshot = await q.get();
      const issuesList = issuesSnapshot.docs.map(doc => {
        const data = doc.data();
        const { Timestamp } = await import('firebase-admin/firestore');
        return {
          id: doc.id,
          ...data,
          createdAt: (data.createdAt as InstanceType<typeof Timestamp>).toDate(),
        } as unknown as import('./data').IssueReport;
      });
      return issuesList;
    } catch (error) {
      console.error('Error fetching issues from Firestore: ', error);
      return [];
    }
  };
