
import { IBaseRepository } from "../base/IBaseRepository";
import { FileQueryOptions, FileOrderByInput, FileWhereInput } from "../../models/file.model";
import { FileCreateDTO, FileUpdateDTO, } from "../../dtos/file.dto";
import { File } from "@prisma/client";
import { PaginatedResult } from "../../common/types";
import { PaginationOptions } from "../../common/types";

/**
 * Repository interface for file operations.
 */
export interface IFileRepository extends IBaseRepository<
    File,
    FileCreateDTO,
    FileUpdateDTO,
    FileWhereInput,
    FileOrderByInput,
    FileQueryOptions
> {
    findAll(
        orderBy?: FileOrderByInput,
        paginationOptions?: Partial<PaginationOptions>,
        select?: any
    ): Promise<PaginatedResult<File> | File[]>;
}