import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  Length,
  Matches,
  Min,
  Max,
  IsMongoId,
  IsBoolean,
} from 'class-validator';
import { Level, TrainType, Duration, Gender } from 'src/shared/libs/types';
import { TrainingValidationParams } from '../trainings.constant';

export class CreateTrainingDto {
  @ApiProperty({
    description: 'Training name',
    example: 'Lorem ipsum',
  })
  @IsNotEmpty()
  @Length(
    TrainingValidationParams.Name.Length.Minimum,
    TrainingValidationParams.Name.Length.Maximum,
  )
  public name: string;

  @ApiProperty({
    description: 'Training background image',
    example: 'background.jpg',
  })
  @IsNotEmpty()
  @Matches(TrainingValidationParams.Image.Regex)
  public backgroundImage: string;

  @ApiProperty({
    description: 'Training level',
    example: 'Newby',
  })
  @IsNotEmpty()
  @IsEnum(Level)
  public level: Level;

  @ApiProperty({
    description: 'Training type',
    example: 'Yoga',
  })
  @IsNotEmpty()
  @IsEnum(TrainType)
  public trainType: TrainType;

  @ApiProperty({
    description: 'Training duration',
    example: '10-30 мин',
  })
  @IsNotEmpty()
  @IsEnum(Duration)
  public duration: Duration;

  @ApiProperty({
    description: 'Training price',
    example: '3000',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(TrainingValidationParams.Price.Value.Minimum)
  public price: number;

  @ApiProperty({
    description: 'Training calories',
    example: '2000',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(TrainingValidationParams.Calories.Value.Minimum)
  @Max(TrainingValidationParams.Calories.Value.Maximum)
  public calories: number;

  @ApiProperty({
    description: 'Training description',
    example: 'Lorem ipsum',
  })
  @IsNotEmpty()
  @Length(
    TrainingValidationParams.Description.Length.Minimum,
    TrainingValidationParams.Description.Length.Maximum,
  )
  public description: string;

  @ApiProperty({
    description: 'Training gender',
    example: 'male',
  })
  @IsNotEmpty()
  @IsEnum(Gender)
  public gender: Gender;

  @ApiProperty({
    description: 'Training video URL',
    example: 'video.avi',
  })
  @IsNotEmpty()
  @Matches(TrainingValidationParams.Video.Regex)
  public videoURL: string;

  @ApiProperty({
    description: 'Trainer Id',
    example: '1234-5678-1234',
  })
  @IsNotEmpty()
  @IsMongoId()
  public trainerId: string;

  @ApiProperty({
    description: 'Training is special offer',
    example: 'true',
  })
  @IsNotEmpty()
  @IsBoolean()
  public isSpecial: boolean;
}
