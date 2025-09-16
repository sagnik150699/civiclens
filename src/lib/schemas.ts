import { z } from 'zod';
import { ISSUE_CATEGORIES } from './constants';

export const issueSchema = z.object({
  description: z.string().min(10, 'Please provide a more detailed description.'),
  category: z.enum(ISSUE_CATEGORIES.map(c => c.value) as [string, ...string[]], {
    errorMap: () => ({ message: "Please select a category." }),
  }),
  photoUrl: z.string().url('Invalid URL format.').optional().or(z.literal('')),
  address: z.string().min(1, 'Address is required.'),
  lat: z.string().optional(),
  lng: z.string().optional(),
});

export type IssueSchema = z.infer<typeof issueSchema>;
