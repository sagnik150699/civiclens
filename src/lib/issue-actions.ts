
'use server';

import { issueSchema } from '@/lib/schemas';
import { revalidatePath } from 'next/cache';
import type { IssueStatus, IssuePriority, IssueCategory } from './data';
import * as mockDb from './server/mock-db';
import type { IssueFormState } from '@/components/issue-report-form';


export async function submitIssue(prevState: IssueFormState, formData: FormData): Promise<IssueFormState> {

  try {
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

    const { description, category, address } = validatedFields.data;
    const photoUrl = validatedFields.data.photoUrl || null;
    const lat = validatedFields.data.lat ? parseFloat(validatedFields.data.lat) : 0;
    const lng = validatedFields.data.lng ? parseFloat(validatedFields.data.lng) : 0;

    const newIssue = {
      description,
      category: category as IssueCategory,
      location: { lat, lng },
      address,
      photoUrl,
      status: 'Submitted' as IssueStatus,
      priority: 'Medium' as IssuePriority, // Default priority
      reason: 'Awaiting review', // Default reason
    };

    mockDb.addIssue(newIssue);

    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true, message: 'Issue reported successfully! Our team will review it shortly.' };

  } catch (error) {
    console.error("Error submitting issue:", error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unexpected server error occurred. Please try again later.';
    return {
      success: false,
      message: errorMessage,
    };
  }
}
