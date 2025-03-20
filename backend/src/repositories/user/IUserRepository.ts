
import { IBaseRepository } from "../base/IBaseRepository";
import { UserFilterOptions, UserOrderByInput, UserRole, UserWhereInput, userPublicSelect } from "../../models/user.model";
import { UserCreateDTO, UserUpdateDTO,  } from "../../dtos/user.dto";
import { PaginatedResult, PaginationOptions } from "../../common/types";
import { User } from "@prisma/client";

/**
 * Interface pour le repository d'utilisateurs
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
        filterOptions?: UserFilterOptions,
        select?: any
    ): Promise<PaginatedResult<User>>;
    findByRole(
        role: UserRole,
        pagination?: Partial<PaginationOptions>,
    ): Promise<PaginatedResult<User>>;
    searchUsers(searchTerm: string, options?: UserFilterOptions, pagination?: Partial<PaginationOptions>): Promise<User[]>;
}