
'use server';

import { issueSchema } from '@/lib/schemas';
import { revalidatePath } from 'next/cache';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { getFirebaseAdmin } from '@/lib/server/firebase-admin';
import type { IssueStatus, IssuePriority, IssueCategory } from './data';
import { randomUUID } from 'crypto';

export type IssueFormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  uploadProgress?: number;
};

export async function submitIssue(prevState: IssueFormState, formData: FormData): Promise<IssueFormState> {
  try {
    const validatedFields = issueSchema.safeParse({
      description: formData.get('description'),
      category: formData.get('category'),
      address: formData.get('address'),
      lat: formData.get('lat'),
      lng: formData.get('lng'),
      photo: formData.get('photo'),
    });

    if (!validatedFields.success) {
      return {
        success: false,
        message: 'Validation failed. Please check your inputs.',
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { db, bucket } = getFirebaseAdmin();
    const { description, category, address, photo } = validatedFields.data;
    let photoUrl: string | null = null;
    
    if (photo && photo.size > 0) {
      const photoBuffer = Buffer.from(await photo.arrayBuffer());
      const photoId = randomUUID();
      const photoPath = `issues/${photoId}-${photo.name}`;
      const file = bucket.file(photoPath);

      await file.save(photoBuffer, {
        metadata: {
          contentType: photo.type,
          cacheControl: 'public, max-age=31536000',
        },
      });

      photoUrl = file.publicUrl();
    }
    
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
      createdAt: Timestamp.now(),
    };

    await addDoc(collection(db, 'issues'), newIssue);

    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true, message: 'Issue reported successfully! Our team will review it shortly.' };

  } catch (error) {
    console.error('Error submitting issue:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unexpected server error occurred. Please try again later.';
    return {
      success: false,
      message: errorMessage,
    };
  }
}
