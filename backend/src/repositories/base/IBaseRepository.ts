import {
  PaginatedResult,
  PaginationOptions,
  BaseFilterOptions,
} from '../../common/types';

/**BaseFilterOptions,
 * Interface générique pour un repository
 */
export interface IBaseRepository<
  T,
  CreateInput,
  UpdateInput,
  WhereInput,
  OrderByInput,
  FilterOptions extends BaseFilterOptions,
> {
  findAll(
    paginationOptions?: Partial<PaginationOptions>,
    filterOptions?: FilterOptions,
    select?: any,
  ): Promise<PaginatedResult<T>>;
  findById(id: string, select?: any): Promise<T | null>;
  findByEmail(id: string, select?: any): Promise<T | null>;
  create(data: CreateInput): Promise<T>;
  update(id: string, data: UpdateInput): Promise<T>;
  delete(id: string): Promise<T>;
  count(where?: WhereInput): Promise<number>;
}
