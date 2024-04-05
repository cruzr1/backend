import { OmitType, PartialType, ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  ValidateIf,
  IsArray,
  IsMongoId,
  IsEnum,
  ArrayMaxSize,
  IsBoolean,
  IsNumber,
  Min,
  Max,
  Length,
  Matches,
} from 'class-validator';
import {
  UserValidationParams,
  MAX_TRAIN_TYPE_ARRAY_SIZE,
} from '../users.constant';
import { UserRole, Level, TrainType, Duration } from 'src/shared/libs/types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserPartialDto extends PartialType(
  OmitType(CreateUserDto, ['email', 'password', 'role'] as const),
) {
  @ApiProperty({
    description: 'User friends',
    example: ['1234-5678-1234', '1234-5678-2345'],
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  public friends?: string[];

  @ApiProperty({
    description: 'User subscribed for trainer',
    example: '1234-5678-1234',
  })
  @IsOptional()
  @ValidateIf((obj) => obj.isCoach === false)
  @IsArray()
  @IsMongoId({ each: true })
  public subscribedFor?: string[];

  @ApiProperty({
    description: 'User level',
    example: 'Newby',
    enum: Level,
  })
  @IsOptional()
  @IsEnum(Level)
  public level?: Level;

  @ApiProperty({
    description: 'User train type',
    example: ['Running', 'Yoga', 'Boxing'],
    enum: TrainType,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(MAX_TRAIN_TYPE_ARRAY_SIZE)
  @IsEnum(TrainType, { each: true })
  public trainType?: TrainType[];

  @ApiProperty({
    description: 'Desirable training duration',
    example: '10-30min',
    isArray: true,
    enum: Duration,
  })
  @IsOptional()
  @ValidateIf((obj) => obj.role === UserRole.User)
  @IsEnum(Duration)
  public duration?: Duration;

  @ApiProperty({
    description: 'User calories target',
    example: '3500',
  })
  @IsOptional()
  @ValidateIf((obj) => obj.isCoach === false)
  @IsNumber()
  @Min(UserValidationParams.Calories.Value.Minimal)
  @Max(UserValidationParams.Calories.Value.Maximal)
  public caloriesTarget?: number;

  @ApiProperty({
    description: 'User calories daily target',
    example: '1500',
  })
  @IsOptional()
  @ValidateIf((obj) => obj.isCoach === false)
  @IsNumber()
  @Min(UserValidationParams.Calories.Value.Minimal)
  @Max(UserValidationParams.Calories.Value.Maximal)
  public caloriesDaily?: number;

  @ApiProperty({
    description: 'User ready/not ready to train',
    example: 'true',
  })
  @IsOptional()
  @IsBoolean()
  public isReadyTrain?: boolean;

  @ApiProperty({
    description: 'Trainer certificates',
    example: 'certificate.pdf',
  })
  @IsOptional()
  @ValidateIf((obj) => obj.isCoach === true)
  @Matches(UserValidationParams.Certificates.Regex)
  public certificates?: string;

  @ApiProperty({
    description: 'Trainer achievements',
    example: 'Lorem ipsum dolor sit',
  })
  @IsOptional()
  @ValidateIf((obj) => obj.isCoach === true)
  @Length(
    UserValidationParams.Description.Length.Minimal,
    UserValidationParams.Description.Length.Maximal,
  )
  public achievements?: string;

  @ApiProperty({
    description: 'Flag if user is trainer',
    example: 'true',
  })
  @IsOptional()
  public isCoach?: boolean;
}
