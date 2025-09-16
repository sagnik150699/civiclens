
'use server';

import { db } from '@/lib/server/firebase-admin';
import { issueSchema } from '@/lib/schemas';
import { revalidatePath } from 'next/cache';
import type { IssueStatus, IssuePriority } from './data';
import { Timestamp } from 'firebase-admin/firestore';


export async function submitIssue(prevState: any, formData: FormData) {
    try {
        if (!db) {
            return {
                success: false,
                message: 'Backend not configured. Missing Firebase Admin credentials.',
                errors: {},
            }
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
            address,
            photoUrl,
            status: 'Submitted' as IssueStatus,
            priority: 'Medium' as IssuePriority,
            reason: 'Awaiting review',
            createdAt: Timestamp.now(),
        };

        await db.collection('issues').add(newIssue);

        revalidatePath('/');
        revalidatePath('/admin');
        return { success: true, message: 'Issue reported successfully! Our team will review it shortly.', errors: {} };

    } catch (error) {
        console.error("Error submitting issue:", error);
        
        const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
        return { 
            success: false, 
            message: errorMessage, 
            errors: {} 
        };
    }
}
