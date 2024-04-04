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
    description: '2024-03-22T08:28:11.013Z',
    example: '1234-5678-1234',
  })
  public createdAt: Date;

  @Expose()
  @ApiProperty({
    description: 'Review author id',
    example: '1234-5678-1234',
  })
  public authorId: string;

  @Expose()
  @ApiProperty({
    description: 'Review author name',
    example: 'Alex',
  })
  public name: string;

  @Expose()
  @ApiProperty({
    description: 'Review author avatar',
    example: 'avatar.jpg',
  })
  public avatar: string;

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
