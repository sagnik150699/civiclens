
import { z } from 'zod';
import { ISSUE_CATEGORIES } from './constants';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

function isValidCoordinate(value: string, min: number, max: number) {
  if (value.trim().length === 0) {
    return true;
  }

  const numericValue = Number(value);
  return Number.isFinite(numericValue) && numericValue >= min && numericValue <= max;
}

export const issueSchema = z.object({
  description: z.string().min(10, 'Please provide a more detailed description.'),
  category: z.enum(ISSUE_CATEGORIES.map(c => c.value) as [string, ...string[]], {
    errorMap: () => ({ message: 'Please select a category.' }),
  }),
  address: z.string().min(1, 'Address is required.'),
  lat: z
    .string()
    .optional()
    .refine((value) => value === undefined || isValidCoordinate(value, -90, 90), {
      message: 'Latitude must be between -90 and 90.',
    }),
  lng: z
    .string()
    .optional()
    .refine((value) => value === undefined || isValidCoordinate(value, -180, 180), {
      message: 'Longitude must be between -180 and 180.',
    }),
  photo: z.preprocess(
    (value) => {
      if (value instanceof File && value.size === 0) {
        return undefined;
      }
      return value;
    },
    z
      .instanceof(File)
      .optional()
      .refine((file) => !file || file.size <= MAX_FILE_SIZE, 'Max file size is 5MB.')
      .refine(
        (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
        'Only .jpg, .jpeg, .png and .webp formats are supported.'
      )
  ),
});

export type IssueSchema = z.infer<typeof issueSchema>;
