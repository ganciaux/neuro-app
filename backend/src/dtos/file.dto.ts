import { z } from 'zod';
import { UserCreateSchema, UserFindAllSchema, UserOrderBySchema, UserSearchSchema, UserUpdateSchema } from '../schemas/user.schema';
import { FileType, EntityType } from '@prisma/client';

export type FileCreateDTO = {
    id?: string;
    label: string;
    path: string;
    entityType: EntityType;
    fileType: FileType;
    entityId: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type FileUpdateDTO = {
    id?: string;
    label?: string;
    path?: string;
    fileType?: FileType;
    entityType?: EntityType;
    entityId?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
