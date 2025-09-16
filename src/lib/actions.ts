
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { ISSUE_STATUSES } from './constants';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { IssueStatus, IssueReport, IssueReportFirestore } from '@/lib/data';
import { db } from '@/lib/server/firebase-admin';

const updateStatusSchema = z.object({
    id: z.string(),
    status: z.enum(ISSUE_STATUSES)
})

export async function getIssues(): Promise<IssueReport[]> {
  try {
    const snapshot = await db.collection('issues').orderBy('createdAt', 'desc').get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(doc => {
      const data = doc.data() as IssueReportFirestore;
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt.toDate(),
      };
    });
  } catch (error) {
    console.error('Error fetching issues:', error);
    return [];
  }
}

export async function updateIssueStatus(id: string, status: IssueStatus) {
    const validated = updateStatusSchema.safeParse({id, status});

    if (!validated.success) {
        return { success: false, message: "Invalid data provided."}
    }

    try {
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
