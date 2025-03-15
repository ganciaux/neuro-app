import { z } from 'zod';
import { AuthLoginSchema, AuthRegisterSchema } from '../schemas/auth.schema';

/**
 * Represents the data transfer object (DTO) for user registration.
 * - Derived from `AuthRegisterSchema`.
 */
export type AuthRegisterDTO = z.infer<typeof AuthRegisterSchema>;

/**
 * Represents the data transfer object (DTO) for user login.
 * - Derived from `AuthLoginSchema`.
 */
export type AuthLoginDTO = z.infer<typeof AuthLoginSchema>;
