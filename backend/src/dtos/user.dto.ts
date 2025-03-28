import { z } from 'zod';
import { UserCreateSchema, UserFindAllSchema, UserOrderBySchema, UserSearchSchema, UserUpdateSchema } from '../schemas/user.schema';
import { Role } from '@prisma/client';

export type UserCreateZodDTO = z.infer<typeof UserCreateSchema>;

export type UserUpdateZodDTO = z.infer<typeof UserUpdateSchema>;

export type UserOrderByZodDTO = z.infer<typeof UserOrderBySchema>;

export type UserSearchZodDTO = z.infer<typeof UserSearchSchema>;

export type UserFindAllZodDTO = z.infer<typeof UserFindAllSchema>;

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
