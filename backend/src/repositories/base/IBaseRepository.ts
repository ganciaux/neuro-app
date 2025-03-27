import {
  PaginatedResult,
  PaginationOptions,
  QueryOptions,
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
  FilterOptions extends QueryOptions,
> {
  find(
    where?: WhereInput,
    pagination?: Partial<PaginationOptions>,
    select?: any,
    orderBy?: OrderByInput
  ): Promise<PaginatedResult<T> | T[]>
  findById(id: string, select?: any): Promise<T | null>;
  create(data: CreateInput): Promise<T>;
  update(id: string, data: UpdateInput): Promise<T>;
  delete(id: string): Promise<T>;
  count(where?: WhereInput): Promise<number>;
}
