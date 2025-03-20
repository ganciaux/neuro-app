import { Prisma, PrismaClient } from '@prisma/client';
import { IBaseRepository } from './IBaseRepository';
import { PrismaError } from '../../errors/prisma.errors';
import {
  BaseFilterOptions,
  PaginatedResult,
  PaginationOptions,
} from '../../common/types';

/**
 * Implémentation de base du repository avec Prisma
 */
export abstract class BasePrismaRepository<
  T,
  CreateInput,
  UpdateInput,
  WhereInput,
  OrderByInput,
  FilterOptions extends BaseFilterOptions,
> implements
  IBaseRepository<
    T,
    CreateInput,
    UpdateInput,
    WhereInput,
    OrderByInput,
    FilterOptions
  > {
  /** Default page size. */
  protected readonly DEFAULT_PAGE_SIZE = 10;
  /** Maximum page size. */
  protected readonly MAX_PAGE_SIZE = 100;

  /**
   * Constructor for the BasePrismaRepository class.
   * @param prismaClient - Prisma client.
   * @param prismaModel - Prisma model.
   * @param modelName - Model name.
   * @param allowedSortFields - Allowed sort fields.
   * @param searchFields - Searchable fields.
   */
  constructor(
    protected prismaClient: PrismaClient,
    protected prismaModel: any,
    protected modelName: string,
    protected allowedSortFields: string[],
    protected searchFields: string[] = [],
  ) { }

  /**
   * Handles Prisma errors uniformly.
   */
  protected handlePrismaError(
    error: unknown,
    errorMessage: string,
    customErrorConstructor: any,
    ...params: any[]
  ): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const statusCode = error.code === 'P2025' ? 404 : 500; // Not found vs server error
      throw new PrismaError(errorMessage, error.code, statusCode);
    } else {
      throw new customErrorConstructor(...params);
    }
  }

  /**
   * Normalizes pagination options.
   */
  protected normalizePagination(
    pagination?: Partial<PaginationOptions>,
  ): PaginationOptions {
    const page = pagination?.page && pagination.page > 0 ? pagination.page : 1;
    const pageSize =
      pagination?.pageSize && pagination.pageSize > 0
        ? Math.min(pagination.pageSize, this.MAX_PAGE_SIZE)
        : this.DEFAULT_PAGE_SIZE;

    return { page, pageSize };
  }

  /**
   * Builds the search filter.
   */
  protected buildSearchFilter(
    searchTerm?: string,
  ): Prisma.Enumerable<any> | undefined {
    if (!searchTerm || this.searchFields.length === 0) return undefined;

    return this.searchFields.map((field) => ({
      [field]: { contains: searchTerm, mode: 'insensitive' },
    }));
  }

  /**
   * Builds the filters for the search.
   */
  protected buildFilter(options?: any): WhereInput {
    if (!options) return {} as WhereInput;

    const filter: any = {};

    if (options.searchTerm) {
      const searchFilters = this.buildSearchFilter(options.searchTerm);
      if (searchFilters) {
        filter.OR = searchFilters;
      }
    }

    return filter as WhereInput;
  }

  /**
   * Builds the sorting order.
   */
  protected buildOrderBy(options?: any): OrderByInput {
    if (!options?.sortBy)
      return { createdAt: 'desc' } as unknown as OrderByInput;

    const sortOrder = options.sortOrder || 'asc';

    // Check if the sort field is allowed
    const sortField = this.allowedSortFields.includes(options.sortBy)
      ? options.sortBy
      : 'createdAt';

    return { [sortField]: sortOrder } as unknown as OrderByInput;
  }

  /**
   * Finds all items with pagination and filters.
   */
  async findAll(
    paginationOptions?: Partial<PaginationOptions>,
    filterOptions?: any,
    select?: any,
  ): Promise<PaginatedResult<T>> {
    try {
      const { page, pageSize } = this.normalizePagination(paginationOptions);
      const where = this.buildFilter(filterOptions);
      const orderBy = this.buildOrderBy(filterOptions);

      const [items, total] = await Promise.all([
        this.prismaModel.findMany({
          select,
          where,
          orderBy,
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        this.prismaModel.count({ where }),
      ]);

      return {
        data: items,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      };
    } catch (error) {
      this.handlePrismaError(
        error,
        `Failed to fetch ${this.modelName} items`,
        Error,
        `Failed to fetch ${this.modelName} items`,
      );
    }
  }

  /**
   * Finds an item by ID.
   */
  async findById(id: string, select?: any): Promise<T | null> {
    try {
      return await this.prismaModel.findUnique({
        where: { id },
        select,
      });
    } catch (error) {
      this.handlePrismaError(
        error,
        `Failed to fetch ${this.modelName} by ID`,
        Error,
        `Failed to fetch ${this.modelName} with ID ${id}`,
      );
    }
  }

  /**
   * Creates a new item.
   */
  async create(data: CreateInput): Promise<T> {
    return this.prismaModel.create({ data });
  }

  /**
   * Updates an item.
   */
  async update(id: string, data: UpdateInput): Promise<T> {
    try {
      return await this.prismaModel.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      this.handlePrismaError(
        error,
        `Failed to update ${this.modelName}`,
        Error,
        `Failed to update ${this.modelName} with ID ${id}`,
      );
    }
  }

  /**
   * Deletes an item.
   */
  async delete(id: string): Promise<T> {
    try {
      return await this.prismaModel.delete({
        where: { id },
      });
    } catch (error) {
      this.handlePrismaError(
        error,
        `Failed to delete ${this.modelName}`,
        Error,
        `Failed to delete ${this.modelName} with ID ${id}`,
      );
    }
  }

  /**
   * Gets the total number of items.
   */
  async count(where?: WhereInput): Promise<number> {
    try {
      return await this.prismaModel.count({ where });
    } catch (error) {
      this.handlePrismaError(
        error,
        `Failed to get ${this.modelName} count`,
        Error,
        `Failed to count ${this.modelName} items`,
      );
    }
  }
}
