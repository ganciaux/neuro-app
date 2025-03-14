import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaError } from '../errors/prisma.errors';

/**
 * Pagination options for queries.
 */
export interface PaginationOptions {
  /** Page number (starts at 1). */
  page: number;
  /** Number of items per page. */
  pageSize: number;
}

/**
 * Paginated result of a query.
 */
export interface PaginatedResult<T> {
  /** Data returned. */
  data: T[];
  /** Total number of items. */
  total: number;
  /** Current page number. */
  page: number;
  /** Number of items per page. */
  pageSize: number;
  /** Total number of pages. */
  totalPages: number;
}

/**
 * Base filtering options for queries.
 */
export interface BaseFilterOptions {
  /** Field to sort by. */
  sortBy?: string;
  /** Sort order ('asc' or 'desc'). */
  sortOrder?: 'asc' | 'desc';
  /** Search term. */
  searchTerm?: string;
}

/**
 * Base class for services using Prisma.
 * @template T - Entity type.
 * @template CreateInput - Type of data for creation.
 * @template UpdateInput - Type of data for updates.
 * @template WhereInput - Type of filters.
 * @template OrderByInput - Type of sorting options.
 * @template FilterOptions - Type of filtering options.
 */
export abstract class BaseService<
  T,
  CreateInput,
  UpdateInput,
  WhereInput,
  OrderByInput,
  FilterOptions extends BaseFilterOptions
> {
  /** Default page size. */
  protected readonly DEFAULT_PAGE_SIZE = 10;
  /** Maximum page size. */
  protected readonly MAX_PAGE_SIZE = 100;

  /**
   * Constructor for the BaseService class.
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
    protected searchFields: string[] = []
  ) {}

  /**
   * Handles Prisma errors uniformly.
   * @param error - Error to handle.
   * @param errorMessage - Custom error message.
   * @param customErrorConstructor - Custom error constructor.
   * @param params - Additional parameters for the error constructor.
   * @throws {PrismaError} If the error is a Prisma error.
   * @throws {Error} If the error is generic.
   */
  protected handlePrismaError(error: unknown, errorMessage: string, customErrorConstructor: any, ...params: any[]): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const statusCode = error.code === 'P2025' ? 404 : 500; // Not found vs server error
      throw new PrismaError(errorMessage, error.code, statusCode);
    } else {
      throw new customErrorConstructor(...params);
    }
  }

  /**
   * Normalizes pagination options.
   * @param pagination - Pagination options.
   * @returns Normalized pagination options.
   */
  protected normalizePagination(pagination?: Partial<PaginationOptions>): PaginationOptions {
    const page = pagination?.page && pagination.page > 0 ? pagination.page : 1;
    const pageSize = pagination?.pageSize && pagination.pageSize > 0 
      ? Math.min(pagination.pageSize, this.MAX_PAGE_SIZE)
      : this.DEFAULT_PAGE_SIZE;
    
    return { page, pageSize };
  }

  /**
   * Builds the search filter.
   * @param searchTerm - Search term.
   * @returns Prisma search filter.
   */
  protected buildSearchFilter(searchTerm?: string): Prisma.Enumerable<any> | undefined {
    if (!searchTerm || this.searchFields.length === 0) return undefined;

    return this.searchFields.map(field => ({
      [field]: { contains: searchTerm, mode: 'insensitive' }
    }));
  }

  /**
   * Builds the filters for the search.
   * This method should be overridden in specific classes.
   * @param options - Filtering options.
   * @returns Prisma filters.
   */
  protected buildFilter(options?: FilterOptions): WhereInput {
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
   * @param options - Filtering options.
   * @returns Prisma sorting order.
   */
  protected buildOrderBy(options?: FilterOptions): OrderByInput {
    if (!options?.sortBy) return { createdAt: 'desc' } as unknown as OrderByInput;

    const sortOrder = options.sortOrder || 'asc';
    
    // Check if the sort field is allowed
    const sortField = this.allowedSortFields.includes(options.sortBy) 
      ? options.sortBy 
      : 'createdAt';
    
    return { [sortField]: sortOrder } as unknown as OrderByInput;
  }

  /**
   * Finds all items with pagination and filters.
   * @param paginationOptions - Pagination options.
   * @param filterOptions - Filtering options.
   * @param select - Fields to select.
   * @returns Paginated result.
   */
  async findAll(
    paginationOptions?: Partial<PaginationOptions>,
    filterOptions?: FilterOptions,
    select?: any
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
        this.prismaModel.count({ where })
      ]);

      return {
        data: items,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      };
    } catch (error) {
      this.handlePrismaError(
        error, 
        `Failed to fetch ${this.modelName} items`, 
        Error,
        `Failed to fetch ${this.modelName} items`
      );
    }
  }

  /**
   * Finds an item by ID.
   * @param id - Item ID.
   * @param select - Fields to select.
   * @returns The found item or null.
   */
  async findById(id: string, select?: any): Promise<T | null> {
    try {
      return await this.prismaModel.findUnique({
        where: { id },
        select
      });
    } catch (error) {
      this.handlePrismaError(
        error, 
        `Failed to fetch ${this.modelName} by ID`, 
        Error,
        `Failed to fetch ${this.modelName} with ID ${id}`
      );
    }
  }

  /**
   * Creates a new item.
   * @param data - Data for the new item.
   * @returns The created item.
   */
  async create(data: CreateInput): Promise<T> {
    try {
      return await this.prismaModel.create({
        data: {
          ...data,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
    } catch (error) {
      this.handlePrismaError(
        error, 
        `Failed to create ${this.modelName}`, 
        Error,
        `Failed to create ${this.modelName}`
      );
    }
  }

  /**
   * Updates an item.
   * @param id - Item ID.
   * @param data - Data to update.
   * @returns The updated item.
   */
  async update(id: string, data: UpdateInput): Promise<T> {
    try {
      return await this.prismaModel.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date()
        }
      });
    } catch (error) {
      this.handlePrismaError(
        error, 
        `Failed to update ${this.modelName}`, 
        Error,
        `Failed to update ${this.modelName} with ID ${id}`
      );
    }
  }

  /**
   * Deletes an item.
   * @param id - Item ID.
   * @returns The deleted item.
   */
  async delete(id: string): Promise<T> {
    try {
      return await this.prismaModel.delete({
        where: { id }
      });
    } catch (error) {
      this.handlePrismaError(
        error, 
        `Failed to delete ${this.modelName}`, 
        Error,
        `Failed to delete ${this.modelName} with ID ${id}`
      );
    }
  }

  /**
   * Gets the total number of items.
   * @param where - Filters to apply.
   * @returns The total number of items.
   */
  async getCount(where?: WhereInput): Promise<number> {
    try {
      return await this.prismaModel.count({ where });
    } catch (error) {
      this.handlePrismaError(
        error, 
        `Failed to get ${this.modelName} count`, 
        Error,
        `Failed to count ${this.modelName} items`
      );
    }
  }
}