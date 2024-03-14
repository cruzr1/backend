import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  Length,
  Matches,
  Min,
  Max,
  ValidateIf,
  IsArray,
  ArrayMaxSize,
} from 'class-validator';
import {
  UserValidationParams,
  MAX_TRAIN_TYPE_ARRAY_SIZE,
} from '../users.constant';
import {
  Gender,
  Level,
  TrainType,
  Duration,
  UserRole,
  Location,
} from 'src/shared/libs/types';

export class UpdateUserDto {
  @ApiProperty({
    description: 'User role',
    example: 'Trainer',
  })
  @IsOptional()
  @IsEnum(UserRole)
  public role: UserRole;

  @ApiProperty({
    description: 'User first name',
    example: 'Alex',
  })
  @IsOptional()
  @Length(
    UserValidationParams.Name.Length.Minimal,
    UserValidationParams.Name.Length.Maximal,
  )
  public name: string;

  @ApiProperty({
    description: 'User avatar',
    example: 'avatar.png',
  })
  @IsOptional()
  @Matches(UserValidationParams.Image.Regex)
  public avatar?: string;

  @ApiProperty({
    description: 'User gender',
    example: 'male',
  })
  @IsOptional()
  @IsEnum(Gender)
  public gender?: Gender;

  @ApiProperty({
    description: 'User birthday',
    example: '01.01.2001',
  })
  @IsOptional()
  @IsDate()
  public birthDate?: Date;

  @ApiProperty({
    description: 'User info',
    example: 'Lorem ipsum',
  })
  @IsOptional()
  @Length(
    UserValidationParams.Description.Length.Minimal,
    UserValidationParams.Description.Length.Maximal,
  )
  public description?: string;

  @ApiProperty({
    description: 'User location',
    example: 'Pionerskaya',
  })
  @IsOptional()
  @IsEnum(Location)
  public location?: Location;

  @ApiProperty({
    description: 'User background image',
    example: 'background.jpg',
  })
  @IsOptional()
  @Matches(UserValidationParams.Image.Regex)
  public backgroundImage?: string;

  @ApiProperty({
    description: 'User level',
    example: 'newby',
  })
  @IsOptional()
  @IsEnum(Level)
  public level?: Level;

  @ApiProperty({
    description: 'User train type',
    example: 'running',
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(MAX_TRAIN_TYPE_ARRAY_SIZE)
  @IsEnum(TrainType, { each: true })
  public trainType?: TrainType;

  @ApiProperty({
    description: 'Desirable training duration',
    example: '10-30 мин',
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
  @ValidateIf((obj) => obj.role === UserRole.User)
  @IsNumber()
  @Min(UserValidationParams.Calories.Value.Minimal)
  @Max(UserValidationParams.Calories.Value.Maximal)
  public caloriesTarget?: number;

  @ApiProperty({
    description: 'User calories daily target',
    example: '1500',
  })
  @IsOptional()
  @ValidateIf((obj) => obj.role === UserRole.User)
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
  @ValidateIf((obj) => obj.role === UserRole.Trainer)
  @Matches(UserValidationParams.Certificates.Regex)
  public certificates?: string;

  @ApiProperty({
    description: 'Trainer achievements',
    example: 'Lorem ipsum',
  })
  @IsOptional()
  @ValidateIf((obj) => obj.role === UserRole.Trainer)
  @Length(
    UserValidationParams.Description.Length.Minimal,
    UserValidationParams.Description.Length.Maximal,
  )
  public achievements?: string;
}
