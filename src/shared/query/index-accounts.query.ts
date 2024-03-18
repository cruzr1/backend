import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsIn } from 'class-validator';
import { DEFAULT_SORT_BY_FIELD } from 'src/accounts/accounts.constant';

const ACCOUNTS_SORT_BY_ORDERS = [1, -1];
const ACCOUNTS_SORT_BY_FIELDS = [
  'trainingsOrderedCount',
  'trainingsOrderedSum',
];
const DEFAULT_SORT_BY_ORDER = 1;

export class IndexAccountsQuery {
  @ApiProperty({
    description: 'SortBy field',
    example: 'price',
  })
  @IsOptional()
  @IsIn(ACCOUNTS_SORT_BY_FIELDS)
  public sortByField?: typeof DEFAULT_SORT_BY_FIELD = DEFAULT_SORT_BY_FIELD;

  @ApiProperty({
    description: 'SortBy order',
    example: 'desc',
  })
  @IsOptional()
  @Type(() => Number)
  @IsIn(ACCOUNTS_SORT_BY_ORDERS)
  public sortByOrder?: number = DEFAULT_SORT_BY_ORDER;
}
