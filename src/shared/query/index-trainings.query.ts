import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsOptional, IsIn, IsEnum, IsNumber } from 'class-validator';
import { Duration, Level, SortByOrder, TrainType } from 'src/shared/libs/types';
import {
  SORT_BY_ORDERS,
  DEFAULT_PAGE_NUMBER,
  DEFAULT_SORT_BY_ORDER,
  DEFAULT_LIST_REQUEST_COUNT,
  DEFAULT_SORT_BY_FIELD,
} from 'src/app.config';

const TRAININGS_SORT_BY_FIELDS = [
  DEFAULT_SORT_BY_FIELD,
  'price',
  'rating',
] as const;

export class IndexTrainingsQuery {
  @ApiProperty({
    description: 'Фильтр по цене тренировки',
    example: '[1000, 3000]',
    isArray: true,
  })
  @IsOptional()
  public priceFilter?: number[];

  @ApiProperty({
    description: 'Фильтр по затрачиваемым калориям',
    example: '[1000, 3000]',
    isArray: true,
  })
  @IsOptional()
  public caloriesFilter?: number[];

  @ApiProperty({
    description: 'Фильтр по рейтингу тренировки',
    example: '[3, 5]',
  })
  @IsOptional()
  public ratingFilter?: number[];

  @ApiProperty({
    description: 'Фильтр по продолжительности тренировки',
    example: '["10-30min", "50-80min"]',
    isArray: true,
    enum: Duration,
  })
  @IsOptional()
  public durationFilter?: Duration[];

  @ApiProperty({
    description: 'Фильтр по типу тренировки',
    example: 'Yoga',
    enum: TrainType,
  })
  @IsOptional()
  public trainTypeFilter?: TrainType[];

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
    example: 'price',
    default: DEFAULT_SORT_BY_FIELD,
  })
  @IsOptional()
  @IsIn(TRAININGS_SORT_BY_FIELDS)
  public sortByField?: (typeof TRAININGS_SORT_BY_FIELDS)[number] =
    DEFAULT_SORT_BY_FIELD;

  @ApiProperty({
    description: 'Порядок сортировки',
    example: 'desc',
    default: DEFAULT_SORT_BY_ORDER,
  })
  @IsOptional()
  @IsIn(SORT_BY_ORDERS)
  public sortByOrder?: SortByOrder = DEFAULT_SORT_BY_ORDER;

  @ApiProperty({
    description: 'Лимит Количества выдачи',
    example: '50',
    default: DEFAULT_LIST_REQUEST_COUNT,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  public take?: number = DEFAULT_LIST_REQUEST_COUNT;

  @ApiProperty({
    description: 'признак наличия спецпредложения',
    example: 'true',
  })
  @IsOptional()
  public isSpecial?: boolean;

  @ApiProperty({
    description: 'признак наличия спецпредложения',
    example: 'true',
  })
  @IsOptional()
  @IsEnum(Level)
  public level?: Level;
}
