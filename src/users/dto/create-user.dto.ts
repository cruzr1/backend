import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  Length,
  Matches,
  IsISO8601,
} from 'class-validator';
import { UserValidationParams, UserValidationMessage } from '../users.constant';
import { Gender, UserRole, Location } from 'src/shared/libs/types';

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
}
