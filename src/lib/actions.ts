
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getFirebaseAdmin } from '@/lib/server/firebase-admin';
import { type IssuePriority, type IssueReport, type IssueStatus, normalizeIssueRecord } from '@/lib/data';
import { ISSUE_PRIORITIES, ISSUE_STATUSES } from './constants';
import type { IssueReportFirestore } from './data';
import { SESSION_COOKIE_NAME, validateAdminCredentials } from './auth';

type AuthState = { success: boolean; message: string } | undefined;

const updateStatusSchema = z.object({
  id: z.string(),
  status: z.enum(ISSUE_STATUSES),
});

const updateIssueDetailsSchema = z.object({
  id: z.string().min(1),
  status: z.enum(ISSUE_STATUSES),
  priority: z.enum(ISSUE_PRIORITIES),
  reason: z.string().trim().min(3, 'Add a short internal note.').max(240),
  address: z.string().trim().min(3, 'Address is required.'),
  lat: z.coerce.number().finite().min(-90).max(90),
  lng: z.coerce.number().finite().min(-180).max(180),
});

export async function getIssues(): Promise<IssueReport[]> {
  try {
    const { db } = getFirebaseAdmin();
    const issuesCollection = db.collection('issues');
    const issuesSnapshot = await issuesCollection.get();
    
    if (issuesSnapshot.empty) {
      return [];
    }

    const issues: IssueReport[] = issuesSnapshot.docs
      .map((doc) => normalizeIssueRecord(doc.id, doc.data() as IssueReportFirestore))
      .sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime());

    return issues;
  } catch (error) {
    console.error('Error fetching issues from Firestore:', error);
    return [];
  }
}

export async function updateIssueStatus(id: string, status: IssueStatus) {
  const validated = updateStatusSchema.safeParse({ id, status });

  if (!validated.success) {
    return { success: false, message: 'Invalid data provided.' };
  }

  try {
    const { db } = getFirebaseAdmin();
    const issueRef = db.collection('issues').doc(id);
    await issueRef.update({ status });

    const updatedSnapshot = await issueRef.get();

    revalidatePath('/admin');
    return {
      success: true,
      message: `Status updated to ${status}.`,
      issue: normalizeIssueRecord(updatedSnapshot.id, updatedSnapshot.data() as IssueReportFirestore),
    };
  } catch (error) {
    console.error('Error updating issue status:', error);
    return { success: false, message: 'Failed to update status.' };
  }
}

export async function updateIssueDetails(input: {
  id: string;
  status: IssueStatus;
  priority: IssuePriority;
  reason: string;
  address: string;
  lat: number;
  lng: number;
}) {
  const validated = updateIssueDetailsSchema.safeParse(input);

  if (!validated.success) {
    return {
      success: false,
      message: validated.error.issues[0]?.message ?? 'Invalid issue update.',
    };
  }

  try {
    const { db } = getFirebaseAdmin();
    const issueRef = db.collection('issues').doc(validated.data.id);

    await issueRef.update({
      status: validated.data.status,
      priority: validated.data.priority,
      reason: validated.data.reason,
      address: validated.data.address,
      location: {
        lat: validated.data.lat,
        lng: validated.data.lng,
      },
    });

    const updatedSnapshot = await issueRef.get();

    revalidatePath('/admin');

    return {
      success: true,
      message: 'Issue details updated.',
      issue: normalizeIssueRecord(updatedSnapshot.id, updatedSnapshot.data() as IssueReportFirestore),
    };
  } catch (error) {
    console.error('Error updating issue details:', error);
    return {
      success: false,
      message: 'Failed to update issue details.',
    };
  }
}

export async function login(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  const validation = validateAdminCredentials(username, password);

  if (validation.success) {
    const expiresIn = 60 * 60 * 24 * 5; // 5 days in seconds
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(validation.session), {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    redirect('/admin');
  }

  return { success: false, message: validation.message };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, '', {
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
  redirect(`/login`);
}
