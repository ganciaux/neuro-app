import { Prisma, User } from "@prisma/client";
import { BasePrismaRepository } from "../base/BasePrismaRepository";
import { IUserRepository } from "./IUserRepository";
import { UserFilterOptions, UserPublic, userPublicSelect, UserRole } from "../../models/user.model";
import { UserFetchByEmailFailedError, UserFetchByIdFailedError, UserFetchFailedError } from "../../errors/user.errors";
import { PaginationOptions, PaginatedResult } from "../../common/types";
import { prisma } from '../../config/database';
import { UserValidator } from '../../validators/user.validator';
/**
 * Implémentation du repository d'utilisateurs avec Prisma
 */
export class PrismaUserRepository extends BasePrismaRepository<
    User,
    Prisma.UserCreateInput,
    Prisma.UserUpdateInput,
    Prisma.UserWhereInput,
    Prisma.UserOrderByWithRelationInput,
    UserFilterOptions
> implements IUserRepository {
    async findUserByEmail(email: string): Promise<User | null> {
        if (!UserValidator.validateEmail(email)) {
            return null;
        }

        try {
            return await prisma.user.findUnique({ where: { email } });
        } catch (error) {
            this.handlePrismaError(
                error,
                'Failed to fetch user by email',
                UserFetchByEmailFailedError,
                email,
            );
        }
    }
    async existsByEmail(email: string): Promise<boolean> {
        if (!UserValidator.validateEmail(email)) {
            return false;
        }

        try {
            const user = await prisma.user.findUnique({
                where: { email },
                select: { id: true },
            });

            return !!user;
        } catch (error) {
            this.handlePrismaError(
                error,
                'Failed to check user existence by email',
                UserFetchByEmailFailedError,
                email,
            );
        }
    }
    findUsersByRole(role: UserRole): Promise<User[]>;
    findUsersByRole(role: UserRole, pagination?: Partial<PaginationOptions>): Promise<PaginatedResult<UserPublic>>;
    findUsersByRole(role: unknown, pagination?: unknown): Promise<{ name: string; id: string; email: string; passwordHash: string; passwordSalt: string; role: import(".prisma/client").$Enums.Role; isActive: boolean; createdAt: Date; updatedAt: Date; }[]> | Promise<PaginatedResult<UserPublic>> {
        throw new Error('Method not implemented.');
    }
    searchUsers(searchTerm: string, options?: UserFilterOptions): Promise<User[]>;
    searchUsers(searchTerm: string, pagination?: Partial<PaginationOptions>): Promise<PaginatedResult<UserPublic>>;
    searchUsers(searchTerm: unknown, pagination?: unknown): Promise<{ name: string; id: string; email: string; passwordHash: string; passwordSalt: string; role: import(".prisma/client").$Enums.Role; isActive: boolean; createdAt: Date; updatedAt: Date; }[]> | Promise<PaginatedResult<UserPublic>> {
        throw new Error('Method not implemented.');
    }
    async findUserPublicById(userId: string): Promise<UserPublic | null> {
        if (!UserValidator.validateUserId(userId)) {
            return null;
        }

        try {
            return (await prisma.user.findUnique({
                where: { id: userId },
                select: userPublicSelect,
            })) as UserPublic | null;
        } catch (error) {
            this.handlePrismaError(
                error,
                'Failed to fetch user by id',
                UserFetchByIdFailedError,
                userId,
            );
        }
    }
    async findUser(criteria: { email?: string; id?: string; }): Promise<User | null> {
        if (
            (criteria.id && !UserValidator.validateUserId(criteria.id)) ||
            (criteria.email && !UserValidator.validateEmail(criteria.email))
        ) {
            return null;
        }

        if (!criteria.id && !criteria.email) {
            return null;
        }

        try {
            const where = criteria.id
                ? { id: criteria.id }
                : { email: criteria.email };
            return await prisma.user.findUnique({ where });
        } catch (error) {
            this.handlePrismaError(
                error,
                'Failed to fetch user',
                UserFetchFailedError,
                criteria.email || criteria.id || 'unknown',
            );
        }
    }

    async findAllPublic(paginationOptions?: Partial<PaginationOptions>, filterOptions?: UserFilterOptions): Promise<PaginatedResult<UserPublic>> {
        return this.findAll(
            paginationOptions,
            filterOptions,
            userPublicSelect,
        ) as Promise<PaginatedResult<UserPublic>>;
    }
}
