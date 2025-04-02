import { z } from 'zod';
import { UserOrderByInput } from '../models/user.model';
import { UserValidator } from '../validators/user.validator';
import { Role } from '@prisma/client';
import { PaginationSchema, createPaginatedSchema } from './utils.schema';

export const emailValidation = z.string().refine(
  value => UserValidator.validateEmail(value), 
  { message: 'The email must be a valid email address.' }
);

export const userIdValidation = z.string().refine(
  value => UserValidator.validateUserId(value),
  { message: 'The user ID must be a valid UUID.' }
);

export const UserRoleValidation = z.nativeEnum(Role);

export const passwordValidation = z.string().refine(
  value => UserValidator.validatePasswordStrength(value),
  { message: 'Password is not strong enough.' }
);

export const passwordLoginValidation = z.string().min(1, { message: 'Password is required.' });

const orderByValidation = z.string()
.transform(val => {
  const [field, direction] = val.split(':');
  return { [field]: direction } as UserOrderByInput;
});

/**
 * Schema for validating user IDs.
 * - Ensures the user ID is a valid UUID.
 */
export const UserIdSchema = z.object({
  id: userIdValidation
});

/**
 * Schema for validating user emails.
 * - Ensures the email is a valid email address.
 */
export const UserEmailSchema = z.object({
  email: emailValidation
});

export const UserPasswordSchema = z.object({
  newPassword: passwordValidation,
  currentPassword: passwordValidation
}); 

export const UserOrderBySchema = z.object({
  orderBy: orderByValidation
});

/**
 * Schema for validating JWT payloads.
 * - Validates the subject (user ID), email, role, and timestamps.
 */
export const UserJWTPayloadSchema = z.object({
  /** Subject (user ID). */
  sub: userIdValidation,
  /** User email. */
  email: emailValidation,
  /** User role. */
  role: UserRoleValidation,
  /** Issued at timestamp. */
  iat: z.number().int('Invalid issued at timestamp.'),
  /** Expiration timestamp. */
  exp: z.number().int('Invalid expiration timestamp.'),
});


/**
 * Schema for validating user updates.
 * - Validates email, password, name, and role.
 */
export const UserUpdateSchema = z.object({
  /** User email. */
  email: emailValidation.optional(),
  /** User password. */
  password: passwordValidation.optional(),
  /** User name (optional). */
  name: z.string().optional(),
  /** User role. */
  role: UserRoleValidation.optional(),
});

/**
 * Schema for validating user creation.
 * - Validates email, password, role, and name (optional).
 */
export const UserCreateSchema = z.object({
  /** User email. */
  email: emailValidation,
  /** User password. */
  password: passwordValidation,
  /** User role. */
  role: UserRoleValidation.default(Role.USER),
  /** User name (optional). */
  name: z.string().optional(),
});

export const UserSearchSchema = z.object({
  searchTerm: z.string().optional(),
  email: emailValidation.optional(),
  role: UserRoleValidation.optional(),
  name: z.string().optional(),
  orderBy: orderByValidation.optional(),
  paginationOptions: PaginationSchema
});

export const UserFindAllSchema = createPaginatedSchema({
  orderBy: orderByValidation.optional(),
  role: UserRoleValidation.optional()
}).transform((data): {
  paginationOptions: { page: number; pageSize: number };
  orderBy?: UserOrderByInput;
  role?: 'USER' | 'ADMIN';
} => ({
  paginationOptions: {
    page: data.paginationOptions.page,
    pageSize: data.paginationOptions.pageSize
  },
  orderBy: data.filters.orderBy,
  role: data.filters.role
}));


