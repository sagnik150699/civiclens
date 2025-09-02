'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { prioritizeIssueReport } from '@/ai/flows/prioritize-issue-reports';
import { addIssue, updateIssueStatus as dbUpdateIssueStatus, type IssuePriority, type IssueStatus } from '@/lib/data';
import { ISSUE_CATEGORIES, ISSUE_STATUSES } from './constants';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';

const issueSchema = z.object({
  description: z.string().min(10, 'Please provide a more detailed description.'),
  category: z.enum(ISSUE_CATEGORIES.map(c => c.value) as [string, ...string[]]),
  photo: z.any().refine(file => file?.size > 0, 'A photo is required.'),
  address: z.string().optional(),
  lat: z.string().optional(),
  lng: z.string().optional(),
  captcha: z.string().min(1, 'Please solve the captcha.'),
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
  let photoDataUri: string | undefined = undefined;
  
  try {
    if (photo && photo.size > 0) {
      const buffer = Buffer.from(await photo.arrayBuffer());
      photoDataUri = `data:${photo.type};base64,${buffer.toString('base64')}`;
    } else {
        // This should not be reached if client-side validation is working
        return { success: false, message: 'A photo is required.' };
    }

    const aiResult = await prioritizeIssueReport({ description, photoDataUri });

    const location = {
      lat: lat ? parseFloat(lat) : 34.0522 + (Math.random() - 0.5) * 0.1,
      lng: lng ? parseFloat(lng) : -118.2437 + (Math.random() - 0.5) * 0.1,
    };

    await addIssue({
      description,
      category,
      location,
      photoUrl: "https://picsum.photos/400/300", // Placeholder, as we don't store the image itself
      status: 'Submitted',
      priority: (aiResult.priority as IssuePriority) || 'Medium',
      reason: aiResult.reason || 'AI analysis failed.',
      address: address || 'N/A',
    });

    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true, message: 'Issue reported successfully!' };

  } catch (error) {
    console.error(error);
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
        await dbUpdateIssueStatus(id, status);
        revalidatePath('/admin');
        return { success: true, message: `Status updated to ${status}`};
    } catch (error) {
        console.error(error);
        return { success: false, message: "Failed to update status."}
    }
}


const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export async function login(prevState: any, formData: FormData) {
  const locale = await getLocale();
  const validatedFields = loginSchema.safeParse({
    username: formData.get('username'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid data.',
    };
  }
  
  const { username, password } = validatedFields.data;
  
  if (username === 'admin' && password === 'admin') {
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    cookies().set('session', 'admin-logged-in', { expires, httpOnly: true });
    redirect(`/${locale}/admin`);
  }

  return { message: 'Invalid username or password.' };
}

export async function logout() {
  const locale = await getLocale();
  cookies().set('session', '', { expires: new Date(0) });
  redirect(`/${locale}/login`);
}
