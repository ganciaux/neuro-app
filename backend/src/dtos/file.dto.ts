import { z } from 'zod';
import { UserCreateSchema, UserFindAllSchema, UserOrderBySchema, UserSearchSchema, UserUpdateSchema } from '../schemas/user.schema';
import { File } from '@prisma/client';

export type FileCreateDTO = {
    id?: string;
    label?: string;
    path?: string;
    entityType: string;
    entityId: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type FileUpdateDTO = {
    id?: string;
    label?: string;
    path?: string;
    entityType: string;
    entityId: string;
    createdAt?: Date;
    updatedAt?: Date;
}
