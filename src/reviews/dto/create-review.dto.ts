import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  Length,
  Max,
  Min,
} from 'class-validator';
import { ReviewValidationParams } from '../review.constant';

export class CreateReviewDto {
  @ApiProperty({
    description: 'Review author id',
    example: '1234-5678-1234',
  })
  @IsNotEmpty()
  @IsMongoId()
  public authorId: string;

  @ApiProperty({
    description: 'Review training id',
    example: '1234-5678-1234',
  })
  @IsNotEmpty()
  @IsMongoId()
  public trainingId: string;

  @ApiProperty({
    description: 'Review rating value',
    example: '3',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(ReviewValidationParams.Rating.Value.Minimum)
  @Max(ReviewValidationParams.Rating.Value.Maximum)
  public rating: number;

  @ApiProperty({
    description: 'Review comment',
    example: 'Lorem ipsum',
  })
  @IsNotEmpty()
  @Length(
    ReviewValidationParams.Comment.Length.Minimum,
    ReviewValidationParams.Comment.Length.Maximum,
  )
  public comment: string;
}
