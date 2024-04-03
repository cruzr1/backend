import { Expose } from 'class-transformer';
import { TrainingRdo } from './training.rdo';
import { ApiProperty } from '@nestjs/swagger';

export class TrainingsOrderedRdo {
  @Expose()
  @ApiProperty({
    description: 'List of training objects',
    type: TrainingRdo,
  })
  public training: TrainingRdo;

  @Expose()
  @ApiProperty({
    description: 'Trainings count',
    example: '4',
  })
  public trainingsCount: number;

  @Expose()
  @ApiProperty({
    description: 'Training sum',
    example: '14000',
  })
  public trainingsSum: number;
}
