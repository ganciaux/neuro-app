import { z } from 'zod';
import { UserCreateSchema } from '../schemas/user.schema';

/**
 * Represents the data transfer object (DTO) for creating a user.
 * - Derived from `UserCreateSchema`.
 */
export type UserCreateDTO = z.infer<typeof UserCreateSchema>;
