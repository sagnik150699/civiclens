'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { prioritizeIssueReport } from '@/ai/flows/prioritize-issue-reports';
import { addIssue, updateIssueStatus as dbUpdateIssueStatus, type IssuePriority, type IssueStatus } from '@/lib/data';
import { ISSUE_CATEGORIES, ISSUE_STATUSES } from './constants';

const issueSchema = z.object({
  description: z.string().min(10, 'Please provide a more detailed description.'),
  category: z.enum(ISSUE_CATEGORIES.map(c => c.value) as [string, ...string[]]),
});

export async function submitIssue(prevState: any, formData: FormData) {
  const validatedFields = issueSchema.safeParse({
    description: formData.get('description'),
    category: formData.get('category'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const { description, category } = validatedFields.data;
  const photo = formData.get('photo') as File;
  let photoDataUri: string | undefined = undefined;
  let photoUrl: string | null = null;
  
  try {
    if (photo && photo.size > 0) {
      const buffer = Buffer.from(await photo.arrayBuffer());
      photoDataUri = `data:${photo.type};base64,${buffer.toString('base64')}`;
      // In a real app, you'd upload this to a storage service and get a URL.
      // Here, we'll just use a placeholder.
      photoUrl = "https://picsum.photos/400/300";
    }

    const aiResult = await prioritizeIssueReport({ description, photoDataUri });

    // Mock location data
    const location = {
      lat: 34.0522 + (Math.random() - 0.5) * 0.1,
      lng: -118.2437 + (Math.random() - 0.5) * 0.1,
    };

    await addIssue({
      description,
      category,
      location,
      photoUrl,
      status: 'Submitted',
      priority: (aiResult.priority as IssuePriority) || 'Medium',
      reason: aiResult.reason || 'AI analysis failed.',
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
