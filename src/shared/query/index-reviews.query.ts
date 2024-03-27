import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsOptional, IsNumber, Max, IsIn } from 'class-validator';
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_LIST_REQUEST_COUNT,
  DEFAULT_SORT_BY_FIELD,
  DEFAULT_SORT_BY_ORDER,
  SORT_BY_ORDERS,
} from 'src/app.config';
import { SortByOrder } from '../libs/types';

const REVIEWS_SORT_BY_FIELDS = [DEFAULT_SORT_BY_FIELD];

export class IndexReviewsQuery {
  @ApiProperty({
    description: 'Номер страницы',
    example: '2',
    default: DEFAULT_PAGE_NUMBER,
  })
  @IsOptional()
  @Transform(({ value }) => +value || DEFAULT_PAGE_NUMBER)
  public page?: number = DEFAULT_PAGE_NUMBER;
  @ApiProperty({
    description: 'Поле сортировки',
    example: 'createdAt',
    default: DEFAULT_SORT_BY_FIELD,
  })
  @IsOptional()
  @IsIn(REVIEWS_SORT_BY_FIELDS)
  public sortByField?: typeof DEFAULT_SORT_BY_FIELD;

  @ApiProperty({
    description: 'Порядок сортировки',
    example: 'desc',
    default: DEFAULT_SORT_BY_ORDER,
  })
  @IsOptional()
  @IsIn(SORT_BY_ORDERS)
  public sortByOrder?: SortByOrder = DEFAULT_SORT_BY_ORDER;

  @ApiProperty({
    description: 'Лимит количества выдачи',
    example: '50',
    default: DEFAULT_LIST_REQUEST_COUNT,
  })
  @IsOptional()
  @IsNumber()
  @Max(DEFAULT_LIST_REQUEST_COUNT)
  @Type(() => Number)
  public take?: number = DEFAULT_LIST_REQUEST_COUNT;
}
