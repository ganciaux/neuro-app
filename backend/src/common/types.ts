// src/common/types.ts

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