
import { IBaseRepository } from "../base/IBaseRepository";
import { UserFilterOptions, UserOrderByInput, UserWhereInput } from "../../models/user.model";
import { UserCreateDTO, UserUpdateDTO,  } from "../../dtos/user.dto";
import { PaginatedResult, PaginationOptions } from "../../common/types";
import { Role, User } from "@prisma/client";

/**
 * Repository interface for user operations.
 */
export interface IUserRepository extends IBaseRepository<
    User,
    UserCreateDTO,
    UserUpdateDTO,
    UserWhereInput,
    UserOrderByInput,
    UserFilterOptions
> {
    existsById(userId: string): Promise<boolean>;
    existsByEmail(email: string): Promise<boolean>;
    findByCriteria(criteria: { email?: string; id?: string }): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findAll(
        paginationOptions?: Partial<PaginationOptions>,
        orderBy?: UserOrderByInput,
        select?: any
    ): Promise<PaginatedResult<User>>;
    findByRole(
        role: Role,
        pagination?: Partial<PaginationOptions>,
        select?: any
    ): Promise<PaginatedResult<User>>;
    search(searchTerm: string, options?: UserFilterOptions, orderBy?: UserOrderByInput, pagination?: Partial<PaginationOptions>): Promise<User[]>;
}