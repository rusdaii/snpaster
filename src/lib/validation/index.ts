import { z } from 'zod';

const MAX_FILE_SIZE = 1024 * 1024 * 5;

export const signUpValidation = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters.' })
    .max(50),
  username: z
    .string()
    .min(2, { message: 'Username must be at least 2 characters.' })
    .max(50)
    .regex(
      /^[a-z0-9_]+$/,
      'Username can only contain lowercase, numbers, and underscores.'
    ),

  email: z.string().email({ message: 'Invalid email address.' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters.' }),
});

export const signInValidation = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters.' }),
});

export const postValidation = z.object({
  caption: z
    .string()
    .max(2200, { message: 'Caption must be less than 2200 characters.' }),
  file: z
    .custom<File[]>()
    .refine((files) => files.length > 0, {
      message: 'Please select a file.',
    })
    .refine((files) => files[0]?.size <= MAX_FILE_SIZE, {
      message: 'File size must be less than 5MB.',
    }),
  location: z.string(),
  tags: z.string(),
});

export const ProfileValidation = z.object({
  file: z.custom<File[]>(),
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  username: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email(),
  bio: z.string(),
});

export const commentValidation = z.object({
  comment: z
    .string()
    .min(5, { message: 'Comment must be at least 5 characters.' })
    .max(2200, { message: 'Comment must be less than 2200 characters.' }),
});
