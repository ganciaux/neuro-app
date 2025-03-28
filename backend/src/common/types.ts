// src/common/types.ts

export type StringFields<T> = {
    [K in keyof T]: T[K] extends string ? K : never;
  }[keyof T];
  
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
export interface SortingOptions {
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface SearchOptions {
    searchTerm?: string;
}

export type QueryOptions = SortingOptions & SearchOptions;  
