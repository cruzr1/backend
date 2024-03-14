import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  Length,
  Matches,
  Min,
  Max,
  IsMongoId,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { Level, TrainType, Duration, Gender } from 'src/shared/libs/types';
import { TrainingValidationParams } from '../trainings.constant';

export class UpdateTrainingDto {
  @ApiProperty({
    description: 'Training name',
    example: 'Lorem ipsum',
  })
  @IsOptional()
  @Length(
    TrainingValidationParams.Name.Length.Minimum,
    TrainingValidationParams.Name.Length.Maximum,
  )
  public name?: string;

  @ApiProperty({
    description: 'Training background image',
    example: 'background.jpg',
  })
  @IsOptional()
  @Matches(TrainingValidationParams.Image.Regex)
  public backgroundImage?: string;

  @ApiProperty({
    description: 'Training level',
    example: 'Newby',
  })
  @IsOptional()
  @IsEnum(Level)
  public level?: Level;

  @ApiProperty({
    description: 'Training type',
    example: 'Yoga',
  })
  @IsOptional()
  @IsEnum(TrainType)
  public trainType?: TrainType;

  @ApiProperty({
    description: 'Training duration',
    example: '10-30 мин',
  })
  @IsOptional()
  @IsEnum(Duration)
  public duration?: Duration;

  @ApiProperty({
    description: 'Training price',
    example: '3000',
  })
  @IsOptional()
  @IsNumber()
  @Min(TrainingValidationParams.Price.Value.Minimum)
  public price?: number;

  @ApiProperty({
    description: 'Training calories',
    example: '2000',
  })
  @IsOptional()
  @IsNumber()
  @Min(TrainingValidationParams.Calories.Value.Minimum)
  @Max(TrainingValidationParams.Calories.Value.Maximum)
  public calories?: number;

  @ApiProperty({
    description: 'Training description',
    example: 'Lorem ipsum',
  })
  @IsOptional()
  @Length(
    TrainingValidationParams.Description.Length.Minimum,
    TrainingValidationParams.Description.Length.Maximum,
  )
  public description?: string;

  @ApiProperty({
    description: 'Training gender',
    example: 'male',
  })
  @IsOptional()
  @IsEnum(Gender)
  public gender?: Gender;

  @ApiProperty({
    description: 'Training video URL',
    example: 'video.avi',
  })
  @IsOptional()
  @Matches(TrainingValidationParams.Video.Regex)
  public videoURL?: string;

  @ApiProperty({
    description: 'Trainer Id',
    example: '1234-5678-1234',
  })
  @IsOptional()
  @IsMongoId()
  public trainerId?: string;

  @ApiProperty({
    description: 'Training is special offer',
    example: 'true',
  })
  @IsOptional()
  @IsBoolean()
  public isSpecial?: boolean;
}
