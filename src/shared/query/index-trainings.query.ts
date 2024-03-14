import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
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

const TRAININGS_SORT_BY_ORDERS = ['asc', 'desc'];
const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_SORT_BY_ORDER = 'asc';

export class IndexTrainingsQuery {
  @ApiProperty({
    description: 'Training price filter',
    example: '[1000, 3000]',
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Min(TrainingValidationParams.Price.Value.Minimum, { each: true })
  public priceFilter?: number[];

  @ApiProperty({
    description: 'Training calories filter',
    example: '[1000, 3000]',
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Min(TrainingValidationParams.Calories.Value.Minimum, { each: true })
  @Max(TrainingValidationParams.Calories.Value.Maximum, { each: true })
  public caloriesFilter?: number[];

  @ApiProperty({
    description: 'Training rating filter',
    example: '3',
  })
  @IsOptional()
  @IsNumber()
  @Min(TrainingValidationParams.Rating.Value.Minimum)
  @Max(TrainingValidationParams.Rating.Value.Maximum)
  public ratingFilter?: number;

  @ApiProperty({
    description: 'Training duration filter',
    example: '["10-30 мин", "50-80 мин"]',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(Duration, { each: true })
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
  @IsIn(TRAININGS_SORT_BY_ORDERS)
  public sortByOrder?: SortByOrder = DEFAULT_SORT_BY_ORDER;
}
