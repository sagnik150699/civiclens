
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { ISSUE_STATUSES } from './constants';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { IssueStatus, IssueReport } from '@/lib/data';
import { mockIssues } from '@/lib/server/mock-db';

const updateStatusSchema = z.object({
    id: z.string(),
    status: z.enum(ISSUE_STATUSES)
})

export async function getIssues(): Promise<IssueReport[]> {
  // Returning mock data instead of trying to fetch from Firebase.
  return Promise.resolve(mockIssues);
}

export async function updateIssueStatus(id: string, status: IssueStatus) {
    const validated = updateStatusSchema.safeParse({id, status});

    if (!validated.success) {
        return { success: false, message: "Invalid data provided."}
    }
    
    const issueIndex = mockIssues.findIndex(issue => issue.id === id);
    if (issueIndex !== -1) {
        mockIssues[issueIndex].status = status;
        revalidatePath('/admin');
        return { success: true, message: `Status updated to ${status}`};
    }

    return { success: false, message: "Failed to update status: Issue not found."}
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
