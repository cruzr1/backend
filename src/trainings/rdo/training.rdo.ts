import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Level, TrainType, Duration, Gender } from 'src/shared/libs/types';

export class TrainingRdo {
  @Expose()
  @ApiProperty({
    description: 'Training id',
    example: '1234-5678-1234',
  })
  public id: string;

  @Expose()
  @ApiProperty({
    description: 'Training name',
    example: 'Lorem ipsum',
  })
  public name: string;

  @Expose()
  @ApiProperty({
    description: 'Training background image',
    example: 'background.jpg',
  })
  public backgroundImage: string;

  @Expose()
  @ApiProperty({
    description: 'Training level',
    example: 'Newby',
    enum: Level,
  })
  public level: Level;

  @Expose()
  @ApiProperty({
    description: 'Training type',
    example: 'Yoga',
    enum: TrainType,
  })
  public trainType: TrainType;

  @Expose()
  @ApiProperty({
    description: 'Training duration',
    example: '10-30min',
    enum: Duration,
  })
  public duration: Duration;

  @Expose()
  @ApiProperty({
    description: 'Training price',
    example: '3000',
  })
  public price: number;

  @Expose()
  @ApiProperty({
    description: 'Training calories',
    example: '2000',
  })
  public calories: number;

  @Expose()
  @ApiProperty({
    description: 'Training description',
    example: 'Lorem ipsum',
  })
  public description: string;

  @Expose()
  @ApiProperty({
    description: 'Training gender',
    example: 'male',
    enum: Gender,
  })
  public gender: Gender;

  @Expose()
  @ApiProperty({
    description: 'Training video URL',
    example: 'video.avi',
  })
  public videoURL: string;

  @Expose()
  @ApiProperty({
    description: 'Trainer Id',
    example: '1234-5678-1234',
  })
  public trainerId: string;

  @Expose()
  @ApiProperty({
    description: 'Training is special offer',
    example: 'true',
  })
  public isSpecial: boolean;

  @Expose()
  @ApiProperty({
    description: 'Training rating',
    example: '3',
  })
  public rating: number;
}
