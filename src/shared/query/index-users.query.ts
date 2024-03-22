import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsOptional,
  IsIn,
  IsEnum,
  Equals,
  IsArray,
  IsNumber,
  Max,
} from 'class-validator';
import { SortByOrder, Location, Level, TrainType } from 'src/shared/libs/types';
import { DEFAULT_SORT_BY_FIELD } from '../../users/users.constant';
import {
  DEFAULT_SORT_BY_ORDER,
  DEFAULT_PAGE_NUMBER,
  SORT_BY_ORDERS,
  DEFAULT_LIST_REQUEST_COUNT,
} from 'src/app.config';

export class IndexUsersQuery {
  @ApiProperty({
    description: 'User Location',
    example: 'Pionerskaya',
  })
  @IsOptional()
  @IsEnum(Location)
  public location?: Location;

  @ApiProperty({
    description: 'User Level',
    example: 'Newby',
  })
  @IsOptional()
  @IsEnum(Level)
  public level?: Level;

  @ApiProperty({
    description: 'User TrainType',
    example: 'Running',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(TrainType, { each: true })
  @Transform((params) => params.value.split(','))
  public trainType?: TrainType[];

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
