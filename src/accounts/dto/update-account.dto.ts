import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateAccountDto {
  @ApiProperty({
    description: 'Account training count',
    example: '4',
  })
  @IsNotEmpty()
  @IsNumber()
  public trainingsCount: number;
}
