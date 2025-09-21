
import { z } from 'zod';
import { ISSUE_CATEGORIES } from './constants';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];


export const issueSchema = z.object({
  description: z.string().min(10, 'Please provide a more detailed description.'),
  category: z.enum(ISSUE_CATEGORIES.map(c => c.value) as [string, ...string[]], {
    errorMap: () => ({ message: "Please select a category." }),
  }),
  address: z.string().min(1, 'Address is required.'),
  lat: z.string().optional(),
  lng: z.string().optional(),
  photo: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, `Max file size is 10MB.`)
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
});

export type IssueSchema = z.infer<typeof issueSchema>;
