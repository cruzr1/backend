import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
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
} from 'class-validator';
import { UserValidationParams } from '../users.constant';
import {
  Gender,
  UserRole,
  Level,
  TrainType,
  Duration,
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
  @IsEmail()
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
  )
  public password: string;

  @ApiProperty({
    description: 'User gender',
    example: 'male',
  })
  @IsNotEmpty()
  @IsEnum(Gender)
  public gender: Gender;

  @ApiProperty({
    description: 'User birthday',
    example: '01.01.2001',
  })
  @IsOptional()
  @IsDate()
  public birthDate?: Date;

  @ApiProperty({
    description: 'User role',
    example: 'Trainer',
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
    example: 'newby',
  })
  @IsNotEmpty()
  @IsEnum(Level)
  public level: Level;

  @ApiProperty({
    description: 'User train type',
    example: 'running',
  })
  @IsNotEmpty()
  @IsEnum(TrainType)
  public trainType: TrainType;

  @ApiProperty({
    description: 'Desirable training duration',
    example: '10-30 мин',
  })
  @IsOptional()
  @ValidateIf((obj) => obj.role === UserRole.User)
  @IsEnum(Duration)
  public duration: Duration;

  @ApiProperty({
    description: 'User calories target',
    example: '3500',
  })
  @IsOptional()
  @ValidateIf((obj) => obj.role === UserRole.User)
  @IsNumber()
  @Min(UserValidationParams.Calories.Value.Minimal)
  @Max(UserValidationParams.Calories.Value.Maximal)
  public caloriesTarget: number;

  @ApiProperty({
    description: 'User calories daily target',
    example: '1500',
  })
  @IsOptional()
  @ValidateIf((obj) => obj.role === UserRole.User)
  @IsNumber()
  @Min(UserValidationParams.Calories.Value.Minimal)
  @Max(UserValidationParams.Calories.Value.Maximal)
  public caloriesDaily: number;

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
  @IsOptional()
  @ValidateIf((obj) => obj.role === UserRole.Trainer)
  @Matches(UserValidationParams.Certificates.Regex)
  public certificates: string;

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
  public achievements: string;
}
