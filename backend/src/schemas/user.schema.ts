// Schéma Zod correspondant
import { z } from 'zod';
import { UserRole } from '../models/user.model';
import { isValidUserId } from '../services/user.service';

export const UserRoleSchema = z.nativeEnum(UserRole);

export const UserJWTPayloadSchema = z.object({
  sub: z.string().refine((value) => isValidUserId(value), {
    message: 'Invalid user ID format.',
  }),
  email: z.string().email('Invalid email format.'),
  role: z.nativeEnum(UserRole, {
    errorMap: (issue, ctx) => {
      return { message: "The role must be either 'USER' or 'ADMIN'." };
    },
  }),
  iat: z.number().int('Invalid issued at timestamp.'),
  exp: z.number().int('Invalid expiration timestamp.'),
});

export const UserIdSchema = z.object({
  userId: z.string().refine((value) => isValidUserId(value), {
    message: "The user ID must be a valid UUID.",
  }),
});

export const UserUpdateSchema = z.object({
  email: z.string().email('Invalid email format.'),
  password: z
    .string()
    .min(6, 'The password must be at least 6 characters long.'),
  name: z.string().optional(),
  role: z.nativeEnum(UserRole, {
    errorMap: (issue, ctx) => {
      return { message: "The role must be either 'USER' or 'ADMIN'." };
    },
  }),
});

export const UserCreateSchema = z.object({
  email: z.string().email('Invalid email format.'),
  password: z
    .string()
    .min(6, 'The password must be at least 6 characters long.'),
  role: z.nativeEnum(UserRole, {
    errorMap: (issue, ctx) => {
      return { message: "The role must be either 'USER' or 'ADMIN'." };
    },
  }),
  name: z.string().optional(),
});
