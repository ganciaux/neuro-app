import { Prisma, File } from '@prisma/client';
import { IFileRepository } from './IFileRepository';
import { BasePrismaRepository } from '../base/BasePrismaRepository';
import { FileQueryOptions, FileOrderByInput } from '../../models/file.model';
import { PaginationOptions, PaginatedResult } from '../../common/types';

export class PrismaFileRepository
  extends BasePrismaRepository<
    File,
    Prisma.FileCreateInput,
    Prisma.FileUpdateInput,
    Prisma.FileWhereInput,
    Prisma.FileOrderByWithRelationInput,
    FileQueryOptions
  >
  implements IFileRepository
{
  async findAll(
    orderBy?: FileOrderByInput,
    paginationOptions?: Partial<PaginationOptions>,
    select?: any,
  ): Promise<PaginatedResult<File> | File[]> {
    return await this.find(
      undefined,
      undefined,
      undefined,
      paginationOptions,
      select,
      orderBy,
    );
  }
}
