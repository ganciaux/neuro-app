import { z } from 'zod';
import { UserRole } from '../models/user.model';
import { UserValidator } from '../validators/user.validator';

/**
 * Schema for validating user roles.
 * - Uses the `UserRole` enum.
 */
export const UserRoleSchema = z.nativeEnum(UserRole);

/**
 * Schema for validating JWT payloads.
 * - Validates the subject (user ID), email, role, and timestamps.
 */
export const UserJWTPayloadSchema = z.object({
  /** Subject (user ID). */
  sub: z.string().refine((value) => UserValidator.validateUserId(value), {
    message: 'Invalid user ID format.',
  }),
  /** User email. */
  email: z.string().email('Invalid email format.'),
  /** User role. */
  role: z.nativeEnum(UserRole, {
    errorMap: (issue, ctx) => {
      return { message: "The role must be either 'USER' or 'ADMIN'." };
    },
  }),
  /** Issued at timestamp. */
  iat: z.number().int('Invalid issued at timestamp.'),
  /** Expiration timestamp. */
  exp: z.number().int('Invalid expiration timestamp.'),
});

/**
 * Schema for validating user IDs.
 * - Ensures the user ID is a valid UUID.
 */
export const UserIdSchema = z.object({
  /** User ID. */
  userId: z.string().refine((value) => UserValidator.validateUserId(value), {
    message: 'The user ID must be a valid UUID.',
  }),
});

/**
 * Schema for validating user updates.
 * - Validates email, password, name, and role.
 */
export const UserUpdateSchema = z.object({
  /** User email. */
  email: z.string().email('Invalid email format.'),
  /** User password. */
  password: z
    .string()
    .min(6, 'The password must be at least 6 characters long.')
    .optional(),
  /** User name (optional). */
  name: z.string().optional(),
  /** User role. */
  role: z.nativeEnum(UserRole, {
    errorMap: (issue, ctx) => {
      return { message: "The role must be either 'USER' or 'ADMIN'." };
    },
  }),
});

/**
 * Schema for validating user creation.
 * - Validates email, password, role, and name (optional).
 */
export const UserCreateSchema = z.object({
  /** User email. */
  email: z.string().email('Invalid email format.'),
  /** User password. */
  password: z
    .string()
    .min(6, 'The password must be at least 6 characters long.'),
  /** User role. */
  role: z.nativeEnum(UserRole, {
    errorMap: (issue, ctx) => {
      return { message: "The role must be either 'USER' or 'ADMIN'." };
    },
  }),
  /** User name (optional). */
  name: z.string().optional(),
});

/**
 * Schema for validating user search.
 * - Validates page, pageSize, email, role, and name (optional).
 */
export const UserSearchSchema = z.object({
  /** Page number. */
  page: z
    .string()
    .regex(/^\d+$/, 'Page must be a number.')
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0, 'Page must be greater than 0.'),
  /** Page size. */
  pageSize: z
    .string()
    .regex(/^\d+$/, 'Page size must be a number.')
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0, 'Page size must be greater than 0.'),
  /** User email (optional). */
  email: z.string().email('Invalid email format.').optional(),
  /** User role (optional). */
  role: z
    .nativeEnum(UserRole, {
      errorMap: () => ({ message: "The role must be either 'USER' or 'ADMIN'." }),
    })
    .optional(),
  /** User name (optional). */
  name: z.string().optional(),
});
