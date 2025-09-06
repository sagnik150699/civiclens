
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { prioritizeIssueReport } from '@/ai/flows/prioritize-issue-reports';
import { addIssue, updateIssueStatus as dbUpdateIssueStatus, type IssuePriority, type IssueStatus } from '@/lib/data';
import { admin } from '@/lib/firebase-admin';
import { ISSUE_CATEGORIES, ISSUE_STATUSES } from './constants';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const issueSchema = z.object({
  description: z.string().min(10, 'Please provide a more detailed description.'),
  category: z.enum(ISSUE_CATEGORIES.map(c => c.value) as [string, ...string[]], {
    errorMap: () => ({ message: "Please select a category." }),
  }),
  photo: z.instanceof(File, {message: 'A photo is required.'}).refine(file => file.size > 0, 'A photo is required.').refine(file => file.size < 4 * 1024 * 1024, 'Photo must be less than 4MB.'),
  address: z.string().min(1, 'Address is required.'),
  lat: z.string().optional(),
  lng: z.string().optional(),
});

export async function submitIssue(prevState: any, formData: FormData | null) {
  // This is the initial state call from useActionState.
  // It should not proceed to validation if form data is not present.
  if (!formData) {
    return { success: false, message: '', errors: {} };
  }

  const validatedFields = issueSchema.safeParse({
    description: formData.get('description'),
    category: formData.get('category'),
    photo: formData.get('photo'),
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
    const { description, category, photo, address, lat, lng } = validatedFields.data;

    const buffer = Buffer.from(await photo.arrayBuffer());
    const photoDataUri = `data:${photo.type};base64,${buffer.toString('base64')}`;
    
    const bucket = admin.storage().bucket();
    const fileName = `issues/${Date.now()}-${photo.name}`;
    const file = bucket.file(fileName);

    await file.save(buffer, {
        metadata: {
            contentType: photo.type,
        },
    });

    await file.makePublic();
    const photoUrl = file.publicUrl();

    const aiResult = await prioritizeIssueReport({ description, photoDataUri });

    const location = {
      lat: lat ? parseFloat(lat) : 34.0522 + (Math.random() - 0.5) * 0.1,
      lng: lng ? parseFloat(lng) : -118.2437 + (Math.random() - 0.5) * 0.1,
    };

    await addIssue({
      description,
      category,
      location,
      photoUrl,
      status: 'Submitted',
      priority: (aiResult.priority as IssuePriority) || 'Medium',
      reason: aiResult.reason || 'AI analysis failed.',
      address: address,
    });

    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true, message: 'Issue reported successfully! Our team will review it shortly.', errors: {} };

  } catch (error) {
    console.error("Error submitting issue:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { success: false, message: `Submission failed: ${errorMessage}`, errors: {} };
  }
}

const updateStatusSchema = z.object({
    id: z.string(),
    status: z.enum(ISSUE_STATUSES)
})

export async function updateIssueStatus(id: string, status: IssueStatus) {
    const validated = updateStatusSchema.safeParse({id, status});

    if (!validated.success) {
        return { success: false, message: "Invalid data provided."}
    }

    try {
        const success = await dbUpdateIssueStatus(id, status);
        if (success) {
            revalidatePath('/admin');
            return { success: true, message: `Status updated to ${status}`};
        }
        return { success: false, message: "Failed to update status."}
    } catch (error) {
        console.error(error);
        return { success: false, message: "Failed to update status."}
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
