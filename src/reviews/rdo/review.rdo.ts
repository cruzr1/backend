import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ReviewRdo {
  @Expose()
  @ApiProperty({
    description: 'Review id',
    example: '1234-5678-1234',
  })
  public id: string;

  @Expose()
  @ApiProperty({
    description: 'Review author id',
    example: '1234-5678-1234',
  })
  public authorId: string;

  @Expose()
  @ApiProperty({
    description: 'Review training id',
    example: '1234-5678-1234',
  })
  public trainingId: string;

  @Expose()
  @ApiProperty({
    description: 'Review rating value',
    example: '3',
  })
  public rating: number;

  @Expose()
  @ApiProperty({
    description: 'Review comment',
    example: 'Lorem ipsum',
  })
  public comment: string;
}
