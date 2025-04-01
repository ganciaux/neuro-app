import { z } from 'zod';
import { emailValidation, passwordValidation } from './user.schema';

/**
 * Schema for user login.
 * - Validates the email and password fields.
 */
export const AuthLoginSchema = z.object({
  /** Email address of the user. */
  email: emailValidation,
  /** Password of the user. */
  password: passwordValidation
});

/**
 * Schema for user registration.
 * - Validates the email and password fields.
 */
export const AuthRegisterSchema = z.object({
  /** Email address of the user. */
  email: emailValidation,
  /** Password of the user. */
  password: passwordValidation
});
