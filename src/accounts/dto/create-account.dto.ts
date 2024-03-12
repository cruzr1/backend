import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { TrainType } from 'src/shared/libs/types';

export class CreateAccountDto {
  @ApiProperty({
    description: 'Account training type',
    example: 'boxing',
  })
  @IsNotEmpty()
  @IsEnum(TrainType)
  public trainType: TrainType;

  @ApiProperty({
    description: 'Account training count',
    example: '4',
  })
  @IsNotEmpty()
  @IsNumber()
  public trainingsCount: number;
}
