
'use server';

import { issueSchema } from '@/lib/schemas';
import { revalidatePath } from 'next/cache';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, bucket } from '@/lib/server/firebase-admin';

import type { IssueStatus, IssuePriority, IssueCategory } from './data';

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
        message: "Validation failed. Please check your inputs.",
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { description, category, address, photo } = validatedFields.data;
    let photoUrl: string | null = null;
    
    if (photo && photo.size > 0) {
        const photoBuffer = Buffer.from(await photo.arrayBuffer());
        const photoId = crypto.randomUUID();
        const photoPath = `issues/${photoId}-${photo.name}`;
        
        const storageRef = ref(bucket.name, photoPath);
        await uploadBytes(storageRef, photoBuffer, { contentType: photo.type });
        photoUrl = await getDownloadURL(storageRef);
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
    console.error("Error submitting issue:", error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unexpected server error occurred. Please try again later.';
    return {
      success: false,
      message: errorMessage,
    };
  }
}
