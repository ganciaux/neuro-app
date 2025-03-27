import { Prisma, Role, User } from "@prisma/client";
import { prisma } from '../../config/database';
import { IUserRepository } from "./IUserRepository";
import { BasePrismaRepository } from "../base/BasePrismaRepository";
import { UserFilterOptions, UserOrderByInput } from "../../models/user.model";
import { PaginationOptions, PaginatedResult } from "../../common/types";
import { UserFetchByEmailFailedError, UserFetchFailedError } from "../../errors/user.errors";

export class PrismaUserRepository extends BasePrismaRepository<
    User,
    Prisma.UserCreateInput,
    Prisma.UserUpdateInput,
    Prisma.UserWhereInput,
    Prisma.UserOrderByWithRelationInput,
    UserFilterOptions
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

    async findByRole(role: Role, pagination?: Partial<PaginationOptions>, select?: any): Promise<PaginatedResult<User>> {
        throw new Error('Method not implemented.');
    }

    async search(searchTerm: string, options?: UserFilterOptions, orderBy?: UserOrderByInput, pagination?: Partial<PaginationOptions>): Promise<User[]> {
        throw new Error('Method not implemented.');
    }
}
