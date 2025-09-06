
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { prioritizeIssueReport } from '@/ai/flows/prioritize-issue-reports';
import { addIssue, updateIssueStatus as dbUpdateIssueStatus, type IssuePriority, type IssueStatus } from '@/lib/data';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ISSUE_CATEGORIES, ISSUE_STATUSES } from './constants';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const issueSchema = z.object({
  description: z.string().min(10, 'Please provide a more detailed description.'),
  category: z.enum(ISSUE_CATEGORIES.map(c => c.value) as [string, ...string[]]),
  photo: z.any().refine(file => file?.size > 0, 'A photo is required.'),
  address: z.string().min(1, 'Address is required.'),
  lat: z.string().optional(),
  lng: z.string().optional(),
  captcha: z.string().min(1, { message: 'Please solve the captcha.' }),
});

export async function submitIssue(prevState: any, formData: FormData) {
  const validatedFields = issueSchema.safeParse({
    description: formData.get('description'),
    category: formData.get('category'),
    photo: formData.get('photo'),
    address: formData.get('address'),
    lat: formData.get('lat'),
    lng: formData.get('lng'),
    captcha: formData.get('captcha'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed. Please check your inputs.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const captchaQuestion = formData.get('captchaQuestion') as string;
  const [num1, num2] = captchaQuestion.split('+').map(Number);
  const expectedAnswer = num1 + num2;

  if (parseInt(validatedFields.data.captcha, 10) !== expectedAnswer) {
    return {
        success: false,
        message: 'Incorrect CAPTCHA answer. Please try again.',
    };
  }
  
  const { description, category, address, lat, lng } = validatedFields.data;
  const photo = formData.get('photo') as File;
  
  try {
    const buffer = Buffer.from(await photo.arrayBuffer());
    const photoDataUri = `data:${photo.type};base64,${buffer.toString('base64')}`;
    
    const storageRef = ref(storage, `issues/${Date.now()}-${photo.name}`);
    const uploadResult = await uploadBytes(storageRef, buffer, {
        contentType: photo.type,
    });
    const photoUrl = await getDownloadURL(uploadResult.ref);

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
    return { success: true, message: 'Issue reported successfully!' };

  } catch (error) {
    console.error("Error submitting issue:", error);
    return { success: false, message: 'An unexpected error occurred.' };
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

export async function login(email: string, password: string): Promise<{ success: boolean; message: string }> {
  if (email === 'admin' && password === 'admin') {
    const sessionData = { user: 'admin', loggedIn: true };
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    cookies().set('session', JSON.stringify(sessionData), { maxAge: expiresIn, httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    return { success: true, message: 'Login successful.' };
  }
  
  return { success: false, message: 'Invalid username or password.' };
}

export async function logout() {
  cookies().set('session', '', { expires: new Date(0) });
  redirect(`/login`);
}
