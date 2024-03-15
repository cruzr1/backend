import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateApplicationDto {
  @ApiProperty({
    description: 'Application author id',
    example: '1234-5678-1234',
  })
  @IsNotEmpty()
  @IsMongoId()
  public authorId: string;

  @ApiProperty({
    description: 'Application user id',
    example: '1234-5678-1234',
  })
  @IsNotEmpty()
  @IsMongoId()
  public userId: string;
}
