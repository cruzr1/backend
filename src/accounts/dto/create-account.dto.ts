import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAccountDto {
  @ApiProperty({
    description: 'Account owner Id',
    example: '1234-5678-1234',
  })
  @IsNotEmpty()
  @IsMongoId()
  public userId: string;

  @ApiProperty({
    description: 'Account training Id',
    example: '1234-5678-1234',
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
  public trainingsCount: number;
}
