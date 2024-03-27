import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsOptional,
  IsIn,
  IsEnum,
  IsArray,
  IsNumber,
  Max,
} from 'class-validator';
import { SortByOrder, Location, Level, TrainType } from 'src/shared/libs/types';
import {
  DEFAULT_SORT_BY_ORDER,
  DEFAULT_PAGE_NUMBER,
  SORT_BY_ORDERS,
  DEFAULT_LIST_REQUEST_COUNT,
  DEFAULT_SORT_BY_FIELD,
} from 'src/app.config';

const USERS_SORT_BY_FIELDS = [DEFAULT_SORT_BY_FIELD, 'role'];

export class IndexUsersQuery {
  @ApiProperty({
    description: 'Локация пользователя',
    example: 'Pionerskaya',
    enum: Location,
  })
  @IsOptional()
  @IsEnum(Location)
  public location?: Location;

  @ApiProperty({
    description: 'Уровень пользователя',
    example: 'Newby',
    enum: Level,
  })
  @IsOptional()
  @IsEnum(Level)
  public level?: Level;

  @ApiProperty({
    description: 'Типы тренировки пользователя',
    example: 'Running',
    isArray: true,
    enum: TrainType,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(TrainType, { each: true })
  @Transform(({ value }) => {
    if (value.includes(',')) {
      return value.split(',');
    }
  })
  public trainType?: TrainType[];

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
  @IsIn(USERS_SORT_BY_FIELDS)
  public sortByField?: typeof DEFAULT_SORT_BY_FIELD = DEFAULT_SORT_BY_FIELD;

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
