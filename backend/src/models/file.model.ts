import { EntityType, File, FileType } from '@prisma/client';
import { QueryOptions, StringFields } from '../common/types';
import { prisma } from '../config/database';


/**
 * Represents a file object.
 */
export type FilePublic = Omit<
  File,
  'createdAt' | 'updatedAt'
>;

export const FileModel = {
  name: 'File' as const,

  allFields: Object.keys(prisma.file.fields) as Array<keyof File>,

  defaultFields: [
    'id',
    'label',
    'path',
    'fileType',
    'entityType',
    'entityId',
    'createdAt',
    'updatedAt',
  ] as const satisfies Array<keyof File>,

  searchableFields: ['label', 'fileType', 'entityType', 'entityId'] as const satisfies Array<
    StringFields<File>
  >,

  relations: [] as const,
};

/**
 * Represents the filter options for file queries.
 */
export interface FileQueryOptions extends QueryOptions {
  id?: string;
  label?: string;
  path?: string;
  fileType?: FileType;
  entityType?: EntityType;
  entityId?: string;
}

/**
 * Represents the where input for file queries.
 */
export interface FileWhereInput {
  id?: string;
  label?: string;
  path?: string;
  fileType?: FileType;
  entityType?: EntityType;
  entityId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Represents the order by input for file queries.
 */
export interface FileOrderByInput {
  label?: 'asc' | 'desc';
  path?: 'asc' | 'desc';
  createdAt?: 'asc' | 'desc';
  updatedAt?: 'asc' | 'desc';
}

export type FileOptions = {
  label?: string;
  path?: string;
  fileType?: FileType;
  entityType?: EntityType;
  entityId?: string;
};
