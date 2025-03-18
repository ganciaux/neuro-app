
import { IBaseRepository } from "../base/IBaseRepository";
import { UserFilterOptions, UserOrderByInput, UserPublic, UserRole, UserWhereInput } from "../../models/user.model";
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
    findUserByEmail(email: string): Promise<User | null>;
    existsByEmail(email: string): Promise<boolean>;
    findUsersByRole(role: UserRole): Promise<User[]>;
    searchUsers(searchTerm: string, options?: UserFilterOptions): Promise<User[]>;
    findUserPublicById(userId: string): Promise<UserPublic | null>;
    findUser(criteria: { email?: string; id?: string }): Promise<User | null>;
    findAllPublic(
        paginationOptions?: Partial<PaginationOptions>,
        filterOptions?: UserFilterOptions,
    ): Promise<PaginatedResult<UserPublic>>;
    findUsersByRole(
        role: UserRole,
        pagination?: Partial<PaginationOptions>,
    ): Promise<PaginatedResult<UserPublic>>;
    searchUsers(
        searchTerm: string,
        pagination?: Partial<PaginationOptions>,
    ): Promise<PaginatedResult<UserPublic>>;
}