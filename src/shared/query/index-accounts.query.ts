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
    description: 'Поле сортировки',
    example: 'price',
    type: DEFAULT_SORT_BY_FIELD,
    default: DEFAULT_SORT_BY_FIELD,
  })
  @IsOptional()
  @IsIn(ACCOUNTS_SORT_BY_FIELDS)
  public sortByField?: typeof DEFAULT_SORT_BY_FIELD = DEFAULT_SORT_BY_FIELD;

  @ApiProperty({
    description: 'Порядок сортировки',
    example: 'desc',
    default: DEFAULT_SORT_BY_ORDER,
  })
  @IsOptional()
  @Type(() => Number)
  @IsIn(ACCOUNTS_SORT_BY_ORDERS)
  public sortByOrder?: number = DEFAULT_SORT_BY_ORDER;

  @ApiProperty({
    description: 'Лимит Количества выдачи',
    example: '50',
  })
  @IsOptional()
  @Type(() => Number)
  public take?: number;

  @ApiProperty({
    description: 'Только активные тренировки',
    example: 'true',
  })
  @IsOptional()
  public isActiveTrainings?: boolean;
}
