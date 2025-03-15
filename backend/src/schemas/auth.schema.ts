import { z } from 'zod';

/**
 * Schema for user login.
 * - Validates the email and password fields.
 */
export const AuthLoginSchema = z.object({
  /** Email address of the user. */
  email: z.string().email({ message: 'Invalid email format.' }),
  /** Password of the user. */
  password: z
    .string()
    .min(6, { message: 'The password must be at least 6 characters long.' }),
});

/**
 * Schema for user registration.
 * - Validates the email and password fields.
 */
export const AuthRegisterSchema = z.object({
  /** Email address of the user. */
  email: z.string().email('Invalid email format.'),
  /** Password of the user. */
  password: z
    .string()
    .min(6, 'The password must be at least 6 characters long.'),
});
