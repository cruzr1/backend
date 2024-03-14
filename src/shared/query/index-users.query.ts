import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsIn, IsEnum, Equals } from 'class-validator';
import { SortByOrder, Location, Level, TrainType } from 'src/shared/libs/types';
import { DEFAULT_SORT_BY_FIELD } from '../../users/users.constant';

const USER_SORT_BY_ORDERS = ['asc', 'desc'];
const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_SORT_BY_ORDER = 'asc';

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
  @IsEnum(TrainType)
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
  @IsIn(USER_SORT_BY_ORDERS)
  public sortByOrder?: SortByOrder = DEFAULT_SORT_BY_ORDER;
}
