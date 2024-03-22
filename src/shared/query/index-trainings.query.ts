import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsOptional,
  IsIn,
  IsEnum,
  Equals,
  IsNumber,
  Min,
  Max,
  IsArray,
} from 'class-validator';
import { Duration, SortByOrder, TrainType } from 'src/shared/libs/types';
import {
  DEFAULT_SORT_BY_FIELD,
  TrainingValidationParams,
} from '../../trainings/trainings.constant';
import {
  SORT_BY_ORDERS,
  DEFAULT_PAGE_NUMBER,
  DEFAULT_SORT_BY_ORDER,
  DEFAULT_LIST_REQUEST_COUNT,
} from 'src/app.config';

export class IndexTrainingsQuery {
  @ApiProperty({
    description: 'Training price filter',
    example: '[1000, 3000]',
  })
  @IsOptional()
  @Transform((params) => params.value.split(','))
  public priceFilter?: number[];

  @ApiProperty({
    description: 'Training calories filter',
    example: '[1000, 3000]',
  })
  @IsOptional()
  @Transform((params) => params.value.split(','))
  public caloriesFilter?: number[];

  @ApiProperty({
    description: 'Training rating filter',
    example: '3',
  })
  @IsOptional()
  @IsNumber()
  @Min(TrainingValidationParams.Rating.Value.Minimum)
  @Max(TrainingValidationParams.Rating.Value.Maximum)
  @Type(() => Number)
  public ratingFilter?: number;

  @ApiProperty({
    description: 'Training duration filter',
    example: '["10-30 мин", "50-80 мин"]',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(Duration, { each: true })
  @Transform((params) => params.value.split(','))
  public durationFilter?: Duration[];

  @ApiProperty({
    description: 'Training trainType filter',
    example: 'Yoga',
  })
  @IsOptional()
  @IsEnum(TrainType)
  public trainTypeFilter?: TrainType;

  @ApiProperty({
    description: 'Page number',
    example: '2',
  })
  @IsOptional()
  @Transform(({ value }) => +value || DEFAULT_PAGE_NUMBER)
  public page?: number = DEFAULT_PAGE_NUMBER;

  @ApiProperty({
    description: 'SortBy field',
    example: 'price',
  })
  @IsOptional()
  @Equals(DEFAULT_SORT_BY_FIELD)
  public sortByField?: typeof DEFAULT_SORT_BY_FIELD;

  @ApiProperty({
    description: 'SortBy order',
    example: 'desc',
  })
  @IsOptional()
  @IsIn(SORT_BY_ORDERS)
  public sortByOrder?: SortByOrder = DEFAULT_SORT_BY_ORDER;

  @ApiProperty({
    description: 'List request count',
    example: '50',
  })
  @IsOptional()
  @IsNumber()
  @Max(DEFAULT_LIST_REQUEST_COUNT)
  @Type(() => Number)
  public take?: number = DEFAULT_LIST_REQUEST_COUNT;
}
