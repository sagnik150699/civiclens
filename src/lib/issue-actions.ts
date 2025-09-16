'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { ISSUE_CATEGORIES } from './constants';
import { Timestamp } from 'firebase-admin/firestore';
import type { IssueStatus } from '@/lib/data';
import { adminDb } from '@/lib/firebase-admin';

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
