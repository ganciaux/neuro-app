import { z } from 'zod';
import { UserOrderByFields, UserOrderByInput } from '../models/user.model';
import { UserValidator } from '../validators/user.validator';
import { createSearchSchema, PaginationSchema } from './utils.schema';
import { Role } from '@prisma/client';

/**
 * Schema for validating user roles.
 * - Uses the `UserRole` enum.
 */
export const UserRoleSchema = z.nativeEnum(Role);

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
  role: z.nativeEnum(Role, {
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
  role: z.nativeEnum(Role, {
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
  role: z.nativeEnum(Role, {
    errorMap: (issue, ctx) => {
      return { message: "The role must be either 'USER' or 'ADMIN'." };
    },
  }),
  /** User name (optional). */
  name: z.string().optional(),
});

type OrderByValue = { [K in keyof UserOrderByInput]?: 'asc' | 'desc' };

export const UserSearchSchema = createSearchSchema({
  searchTerm: z.string().optional(), // Champ générique pour recherche globale
  email: z.string().email().optional(),
  role: z.nativeEnum(Role).optional(),
  name: z.string().optional(),
  orderBy: z.string()
    .transform(val => {
      const [field, direction] = val.split(':');
      return { [field]: direction } as OrderByValue;
    })
    .optional()
  /*
  orderBy: z.custom<keyof UserOrderByInput>(val => {
    const [field, direction] = String(val).split(':');
    return Object.keys(UserOrderByFields).includes(field) && ['asc', 'desc'].includes(direction);
  }).optional()*/
});

export const UserFindAllSchema = PaginationSchema.extend({
  orderBy: z.enum(["createdAt:asc", "createdAt:desc", "name:asc", "name:desc"]).optional(),
});
