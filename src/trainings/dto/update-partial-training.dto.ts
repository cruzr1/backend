import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, Min, Max, IsMongoId, IsOptional } from 'class-validator';
import { TrainingValidationParams } from '../trainings.constant';
import { CreateTrainingDto } from './create-training.dto';

export class UpdatePartialTrainingDto extends PartialType(CreateTrainingDto) {
  @ApiProperty({
    description: 'Trainer Id',
    example: '1234-5678-1234',
  })
  @IsOptional()
  @IsMongoId()
  public trainerId?: string;

  @ApiProperty({
    description: 'Training rating',
    example: '4',
  })
  @IsOptional()
  @IsNumber()
  @Min(TrainingValidationParams.Rating.Value.Minimum)
  @Max(TrainingValidationParams.Rating.Value.Maximum)
  public rating?: number;
}
