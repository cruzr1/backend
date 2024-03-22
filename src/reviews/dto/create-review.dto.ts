import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Length, Max, Min } from 'class-validator';
import { ReviewValidationParams } from '../reviews.constant';
import { Transform } from 'class-transformer';

export class CreateReviewDto {
  @ApiProperty({
    description: 'Review rating value',
    example: '3',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(ReviewValidationParams.Rating.Value.Minimum)
  @Max(ReviewValidationParams.Rating.Value.Maximum)
  @Transform(({ value }) => +value)
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
