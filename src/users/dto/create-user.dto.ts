import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Length,
  Matches,
  Min,
  Max,
  ValidateIf,
  IsArray,
  ArrayMaxSize,
  IsISO8601,
} from 'class-validator';
import {
  UserValidationParams,
  UserValidationMessage,
  MAX_TRAIN_TYPE_ARRAY_SIZE,
} from '../users.constant';
import {
  Gender,
  UserRole,
  Level,
  TrainType,
  Duration,
  Location,
} from 'src/shared/libs/types';

export class CreateUserDto {
  @ApiProperty({
    description: 'User first name',
    example: 'Alex',
  })
  @IsNotEmpty()
  @Length(
    UserValidationParams.Name.Length.Minimal,
    UserValidationParams.Name.Length.Maximal,
  )
  public name: string;

  @ApiProperty({
    description: 'User unique email address',
    example: 'user@user.com',
  })
  @IsNotEmpty()
  @IsEmail({}, { message: UserValidationMessage.Email.InvalidFormat })
  public email: string;

  @ApiProperty({
    description: 'User avatar',
    example: 'avatar.png',
  })
  @IsNotEmpty()
  @Matches(UserValidationParams.Image.Regex)
  public avatar: string;

  @ApiProperty({
    description: 'User password',
    example: '123456',
  })
  @IsNotEmpty()
  @Length(
    UserValidationParams.Password.Length.Minimal,
    UserValidationParams.Password.Length.Maximal,
    { message: UserValidationMessage.Password.InvalidLength },
  )
  public password: string;

  @ApiProperty({
    description: 'User gender',
    example: 'Male',
    enum: Gender,
  })
  @IsNotEmpty()
  @IsEnum(Gender)
  public gender: Gender;

  @ApiProperty({
    description: 'User birthday',
    example: '1995-04-23T18:25:43.511Z',
  })
  @IsOptional()
  @IsISO8601()
  public birthDate?: Date;

  @ApiProperty({
    description: 'User role',
    example: 'Trainer',
    enum: UserRole,
  })
  @IsNotEmpty()
  @IsEnum(UserRole)
  public role: UserRole;

  @ApiProperty({
    description: 'User info',
    example: 'Lorem ipsum',
  })
  @IsNotEmpty()
  @Length(
    UserValidationParams.Description.Length.Minimal,
    UserValidationParams.Description.Length.Maximal,
  )
  public description: string;

  @ApiProperty({
    description: 'User location',
    example: 'Pionerskaya',
    enum: Location,
  })
  @IsNotEmpty()
  @IsEnum(Location)
  public location: Location;

  @ApiProperty({
    description: 'User background image',
    example: 'background.jpg',
  })
  @IsNotEmpty()
  @Matches(UserValidationParams.Image.Regex)
  public backgroundImage: string;

  @ApiProperty({
    description: 'User level',
    example: 'Newby',
    enum: Level,
  })
  @IsNotEmpty()
  @IsEnum(Level)
  public level: Level;

  @ApiProperty({
    description: 'User train type',
    example: ['Running', 'Yoga', 'Boxing'],
    enum: TrainType,
    isArray: true,
  })
  @IsNotEmpty()
  @IsArray()
  @ArrayMaxSize(MAX_TRAIN_TYPE_ARRAY_SIZE)
  @IsEnum(TrainType, { each: true })
  public trainType: TrainType[];

  @ApiProperty({
    description: 'Desirable training duration',
    example: '10-30min',
    isArray: true,
    enum: Duration,
  })
  @ValidateIf((obj) => obj.role === UserRole.User)
  @IsNotEmpty()
  @IsEnum(Duration)
  public duration?: Duration;

  @ApiProperty({
    description: 'User calories target',
    example: '3500',
  })
  @ValidateIf((obj) => obj.role === UserRole.User)
  @IsNotEmpty()
  @IsNumber()
  @Min(UserValidationParams.Calories.Value.Minimal)
  @Max(UserValidationParams.Calories.Value.Maximal)
  public caloriesTarget?: number;

  @ApiProperty({
    description: 'User calories daily target',
    example: '1500',
  })
  @ValidateIf((obj) => obj.role === UserRole.User)
  @IsNotEmpty()
  @IsNumber()
  @Min(UserValidationParams.Calories.Value.Minimal)
  @Max(UserValidationParams.Calories.Value.Maximal)
  public caloriesDaily?: number;

  @ApiProperty({
    description: 'User ready/not ready to train',
    example: 'true',
  })
  @IsNotEmpty()
  @IsBoolean()
  public isReadyTrain: boolean;

  @ApiProperty({
    description: 'Trainer certificates',
    example: 'certificate.pdf',
  })
  @ValidateIf((obj) => obj.role === UserRole.Trainer)
  @IsNotEmpty()
  @Matches(UserValidationParams.Certificates.Regex)
  public certificates?: string;

  @ApiProperty({
    description: 'Trainer achievements',
    example: 'Lorem ipsum dolor sit',
  })
  @ValidateIf((obj) => obj.role === UserRole.Trainer)
  @IsNotEmpty()
  @Length(
    UserValidationParams.Description.Length.Minimal,
    UserValidationParams.Description.Length.Maximal,
  )
  public achievements?: string;
}
