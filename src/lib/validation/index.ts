import { z } from 'zod';

export const signUpValidation = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters.' })
    .max(50),
  username: z
    .string()
    .min(2, { message: 'Username must be at least 2 characters.' })
    .max(50),

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
    .min(5, { message: 'Caption must be at least 5 characters.' })
    .max(2200, { message: 'Caption must be less than 2200 characters.' }),
  file: z.custom<File[]>(),
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
