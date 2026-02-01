import { z } from 'zod';

export const authValidation = {
  login: z.object({
    email: z
      .string()
      .email('Please enter a valid email'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters'),
  }),
  register: z.object({
    firstName: z
      .string()
      .min(1, 'First name is required')
      .max(50, 'First name is too long'),
    lastName: z
      .string()
      .min(1, 'Last name is required')
      .max(50, 'Last name is too long'),
    email: z
      .string()
      .email('Please enter a valid email'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(100, 'Password is too long'),
  }),
};