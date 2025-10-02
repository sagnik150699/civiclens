
'use server';

import { issueSchema } from '@/lib/schemas';
import { revalidatePath } from 'next/cache';
import { ref, uploadBytes, getDownloadURL, type Storage } from 'firebase/storage';
import { getFirebaseAdmin } from '@/lib/server/firebase-admin';
import type { IssueStatus, IssuePriority, IssueCategory } from './data';
import { v4 as uuidv4 } from 'uuid';
import { Timestamp } from 'firebase-admin/firestore';

export type IssueFormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
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
    
    const lat = validatedFields.data.lat ? parseFloat(validatedFields.data.lat) : 0;
    const lng = validatedFields.data.lng ? parseFloat(validatedFields.data.lng) : 0;

    let photoUrl: string | null = null;

    if (photo && photo.size > 0) {
        const photoBuffer = Buffer.from(await photo.arrayBuffer());
        const photoId = uuidv4();
        const storage = bucket as unknown as Storage;
        const photoRef = ref(storage, `issues/${photoId}-${photo.name}`);
        
        await uploadBytes(photoRef, photoBuffer, {
            contentType: photo.type,
        });

        photoUrl = await getDownloadURL(photoRef);
    }

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

    const issuesCollection = db.collection('issues');
    await issuesCollection.add(newIssue);

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
