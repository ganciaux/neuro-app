import { z } from 'zod';
import { UserRole } from '../models/user.model';
import { isValidUserId } from '../services/user.service';

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
  sub: z.string().refine((value) => isValidUserId(value), {
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
  userId: z.string().refine((value) => isValidUserId(value), {
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
    .min(6, 'The password must be at least 6 characters long.'),
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
