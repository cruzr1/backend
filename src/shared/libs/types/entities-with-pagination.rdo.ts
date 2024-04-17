import { Expose } from 'class-transformer';

export class EntitiesWithPaginationRdo<T> {
  @Expose()
  public entities: T[];

  @Expose()
  public totalPages?: number;

  @Expose()
  public currentPage?: number;

  @Expose()
  public totalItems: number;
}
