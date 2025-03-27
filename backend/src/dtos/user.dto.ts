import { z } from 'zod';
import { UserCreateSchema, UserUpdateSchema } from '../schemas/user.schema';
import { Role } from '@prisma/client';
/**
 * Represents the data transfer object (DTO) for creating a user.
 * - Derived from `UserCreateSchema`.
 */
export type UserCreateZodDTO = z.infer<typeof UserCreateSchema>;

export type UserUpdateZodDTO = z.infer<typeof UserUpdateSchema>;

export type UserCreateDTO = {
    name?: string;
    id?: string;
    email: string;
    passwordHash: string;
    passwordSalt: string;
    role?: Role;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export type UserUpdateDTO = {
    name?: string;
    id?: string;
    email?: string;
    passwordHash?: string;
    passwordSalt?: string;
    role?: Role;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
