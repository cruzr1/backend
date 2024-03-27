import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAccountDto {
  @ApiProperty({
    description: 'Account owner Id',
    example: '65f198e9a2d67afd0e6db7bd',
  })
  @IsNotEmpty()
  @IsMongoId()
  public userId: string;

  @ApiProperty({
    description: 'Account training Id',
    example: '65f7ffb015ef515772b1365f',
  })
  @IsNotEmpty()
  @IsMongoId()
  public trainingId: string;

  @ApiProperty({
    description: 'Account training count',
    example: '4',
  })
  @IsNotEmpty()
  @IsNumber()
  public trainingsActive: number;
}
