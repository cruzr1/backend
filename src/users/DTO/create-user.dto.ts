import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { UserValidationMessage, UserValidationParams } from '../user.constant';

export class CreateUserDto {
  @ApiProperty({
    description: 'User unique email address',
    example: 'user@user.com'
  })
  @IsEmail({},{message: UserValidationMessage.Email.InvalidFormat})
  public email: string;

  @ApiProperty({
    description: 'User first name',
    example: 'Alex'
  })
  @IsString({message: UserValidationMessage.Name.InvalidFormat})
  @Length(
    UserValidationParams.Name.Length.Minimal,
    UserValidationParams.Name.Length.Maximal,
    {message: UserValidationMessage.Name.InvalidLength}
  )
  public name: string;

  @ApiProperty({
    description: 'User password',
    example: '123456'
  })
  @IsNotEmpty()
  @Length(
    UserValidationParams.Password.Length.Minimal,
    UserValidationParams.Password.Length.Maximal,
    {message: UserValidationMessage.Password.InvalidLength}
  )
  @IsString({message: UserValidationMessage.Password.InvalidPassword})
  public password: string;
}

