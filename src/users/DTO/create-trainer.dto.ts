import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { UserValidationParams } from '../user.constant';
import { Gender, UserRole, Level, TrainType } from 'src/shared/libs/types';

export class CreateTrainerDto {
  @ApiProperty({
    description: 'Trainer first name',
    example: 'Alex',
  })
  @IsNotEmpty()
  @IsString()
  @Length(
    UserValidationParams.Name.Length.Minimal,
    UserValidationParams.Name.Length.Maximal,
  )
  public name: string;

  @ApiProperty({
    description: 'Trainer unique email address',
    example: 'user@user.com',
  })
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @ApiProperty({
    description: 'Trainer avatar',
    example: 'avatar.png',
  })
  @IsNotEmpty()
  @Matches(UserValidationParams.Image.Regex)
  public avatar: string;

  @ApiProperty({
    description: 'Trainer password',
    example: '123456',
  })
  @IsNotEmpty()
  @Length(
    UserValidationParams.Password.Length.Minimal,
    UserValidationParams.Password.Length.Maximal,
  )
  @IsString()
  public password: string;

  @ApiProperty({
    description: 'Trainer gender',
    example: 'male',
  })
  @IsNotEmpty()
  @IsEnum(Gender)
  public gender: Gender;

  @ApiProperty({
    description: 'Trainer birthday',
    example: '01.01.2001',
  })
  @IsOptional()
  @IsDate()
  public birthDate?: Date;

  @ApiProperty({
    description: 'Trainer role',
    example: 'Trainer',
  })
  @IsNotEmpty()
  @IsEnum(UserRole)
  public role: UserRole;

  @ApiProperty({
    description: 'Trainer info',
    example: 'Lorem ipsum',
  })
  @IsNotEmpty()
  @Length(
    UserValidationParams.Description.Length.Minimal,
    UserValidationParams.Description.Length.Maximal,
  )
  public description: string;

  @ApiProperty({
    description: 'Trainer location',
    example: 'Pionerskaya',
  })
  @IsNotEmpty()
  @IsEnum(Location)
  public location: Location;

  @ApiProperty({
    description: 'Trainer background image',
    example: 'background.jpg',
  })
  @IsNotEmpty()
  @Matches(UserValidationParams.Image.Regex)
  public backgroundImage: string;

  @ApiProperty({
    description: 'Trainer level',
    example: 'newby',
  })
  @IsNotEmpty()
  @IsEnum(Level)
  public level: Level;

  @ApiProperty({
    description: 'Trainer train type',
    example: 'running',
  })
  @IsNotEmpty()
  @IsEnum(TrainType)
  public trainType: TrainType;

  @ApiProperty({
    description: 'Trainer certificates',
    example: 'certificate.pdf',
  })
  @IsNotEmpty()
  @Matches(UserValidationParams.Certificates.Regex)
  public certificates: string;

  @ApiProperty({
    description: 'Trainer achievements',
    example: 'Lorem ipsum',
  })
  @IsNotEmpty()
  @Length(
    UserValidationParams.Description.Length.Minimal,
    UserValidationParams.Description.Length.Maximal,
  )
  public achievements: string;

  @ApiProperty({
    description: 'Trainer ready/not ready to train',
    example: 'true',
  })
  @IsNotEmpty()
  @IsBoolean()
  public isReadyTrain: boolean;
}
