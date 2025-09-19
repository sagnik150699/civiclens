
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { collection, getDocs, doc, updateDoc, orderBy, query } from 'firebase/firestore';

import { getFirebaseAdmin } from '@/lib/server/firebase-admin';
import type { IssueReport, IssueStatus } from '@/lib/data';
import { ISSUE_STATUSES } from './constants';

type AuthState = { success: boolean; message: string } | undefined;

const updateStatusSchema = z.object({
    id: z.string(),
    status: z.enum(ISSUE_STATUSES)
})

export async function getIssues(): Promise<IssueReport[]> {
  try {
    const { db } = getFirebaseAdmin();
    const issuesCollection = collection(db, 'issues');
    const q = query(issuesCollection, orderBy('createdAt', 'desc'));
    const issuesSnapshot = await getDocs(q);
    
    if (issuesSnapshot.empty) {
        return [];
    }

    const issues: IssueReport[] = issuesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        description: data.description,
        category: data.category,
        location: data.location,
        address: data.address,
        photoUrl: data.photoUrl,
        status: data.status,
        priority: data.priority,
        reason: data.reason,
        createdAt: data.createdAt.toDate(),
      };
    });

    return issues;
  } catch (error) {
    console.error("Error fetching issues from Firestore:", error);
    return [];
  }
}

export async function updateIssueStatus(id: string, status: IssueStatus) {
    const validated = updateStatusSchema.safeParse({id, status});

    if (!validated.success) {
        return { success: false, message: "Invalid data provided."}
    }
    
    try {
        const { db } = getFirebaseAdmin();
        const issueRef = doc(db, 'issues', id);
        await updateDoc(issueRef, { status: status });
        
        revalidatePath('/admin');
        return { success: true, message: `Status updated to ${status}`};
    } catch (error) {
        console.error("Error updating issue status:", error);
        return { success: false, message: "Failed to update status." };
    }
}

export async function login(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (email === 'admin' && password === 'admin') {
    const sessionData = { user: 'admin', loggedIn: true };
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const cookieStore = await cookies();
    cookieStore.set('session', JSON.stringify(sessionData), { maxAge: expiresIn, httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    redirect('/admin');
  } else {
      return { success: false, message: 'Invalid username or password.' };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.set('session', '', { expires: new Date(0) });
  redirect(`/login`);
}
