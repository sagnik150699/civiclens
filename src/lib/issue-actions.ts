
'use server';

import { issueSchema } from '@/lib/schemas';
import { revalidatePath } from 'next/cache';
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
    let uploadWarning: string | null = null;

    if (photo && photo.size > 0) {
      try {
        const photoArrayBuffer = await photo.arrayBuffer();
        const photoBytes = new Uint8Array(photoArrayBuffer);
        const photoId = uuidv4();
        const file = bucket.file(`issues/${photoId}-${photo.name}`);

        await file.save(photoBytes, {
          contentType: photo.type,
        });

        const [signedUrl] = await file.getSignedUrl({
          action: 'read',
          expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        photoUrl = signedUrl;
      } catch (uploadError) {
        console.error('Failed to upload issue photo to Firebase Storage:', uploadError);

        const errorMessage =
          uploadError instanceof Error ? uploadError.message : 'Unknown Firebase Storage error.';

        if (errorMessage.includes('The specified bucket does not exist')) {
          uploadWarning =
            'Issue reported successfully, but the attached photo could not be uploaded because the Firebase Storage bucket is not configured.';
        } else if (typeof uploadError === 'object' && uploadError !== null && 'code' in uploadError) {
          const errorCode = (uploadError as { code?: number }).code;
          if (errorCode === 404) {
            uploadWarning =
              'Issue reported successfully, but the attached photo could not be uploaded because the Firebase Storage bucket is not configured.';
          } else {
            throw uploadError;
          }
        } else {
          throw uploadError;
        }
      }
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
    const successMessage = uploadWarning
      ? `${uploadWarning} Our team will review your report shortly.`
      : 'Issue reported successfully! Our team will review it shortly.';

    return { success: true, message: successMessage };

  } catch (error) {
    console.error('Error submitting issue:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unexpected server error occurred. Please try again later.';
    return {
      success: false,
      message: errorMessage,
    };
  }
}
