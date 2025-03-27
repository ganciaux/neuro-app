import { Prisma, Role, User } from "@prisma/client";
import { prisma } from '../../config/database';
import { IUserRepository } from "./IUserRepository";
import { BasePrismaRepository } from "../base/BasePrismaRepository";
import { UserQueryOptions, UserOrderByInput } from "../../models/user.model";
import { PaginationOptions, PaginatedResult } from "../../common/types";
import { UserFetchByEmailFailedError, UserFetchFailedError, UserFetchByRoleFailedError } from "../../errors/user.errors";

export class PrismaUserRepository extends BasePrismaRepository<
    User,
    Prisma.UserCreateInput,
    Prisma.UserUpdateInput,
    Prisma.UserWhereInput,
    Prisma.UserOrderByWithRelationInput,
    UserQueryOptions
> implements IUserRepository {
    async existsById(userId: string): Promise<boolean> {
        return !!this.findById(userId);
    }
    async existsByEmail(email: string): Promise<boolean> {
        return !!this.findByEmail(email);
    }

    async findByCriteria(criteria: { email?: string; id?: string; }): Promise<User | null> {
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

    async findByEmail(email: string): Promise<User | null> {
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

    async findAll(
        orderBy?: UserOrderByInput,
        paginationOptions?: Partial<PaginationOptions>,
        select?: any
    ): Promise<PaginatedResult<User> | User[]> {
        return await this.find(undefined, paginationOptions, select, orderBy);
    }

    async findByRole(role: Role, pagination?: Partial<PaginationOptions>, select?: any): Promise<PaginatedResult<User> | User[]> {
        return await this.find({ role }, pagination, select);
    }

    async search(queryOptions?: UserQueryOptions, orderBy?: UserOrderByInput, pagination?:
        Partial<PaginationOptions>,select?: any): Promise<PaginatedResult<User> | User[]> {
        return await this.find(queryOptions, pagination, select, orderBy);
    }
}
