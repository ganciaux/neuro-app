
import { IBaseRepository } from "../base/IBaseRepository";
import { UserQueryOptions, UserOrderByInput, UserWhereInput } from "../../models/user.model";
import { UserCreateDTO, UserUpdateDTO, } from "../../dtos/user.dto";
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
    UserQueryOptions
> {
    existsById(userId: string): Promise<boolean>;
    existsByEmail(email: string): Promise<boolean>;
    findByCriteria(criteria: { email?: string; id?: string }): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findAll(
        orderBy?: UserOrderByInput,
        paginationOptions?: Partial<PaginationOptions>,
        select?: any
    ): Promise<PaginatedResult<User> | User[]>;
    findByRole(
        role: Role,
        pagination?: Partial<PaginationOptions>,
        select?: any
    ): Promise<PaginatedResult<User> | User[]>;
    search(queryOptions?: UserQueryOptions, orderBy?: UserOrderByInput, pagination?: Partial<PaginationOptions>, select?: any): Promise<PaginatedResult<User> | User[]>;
}