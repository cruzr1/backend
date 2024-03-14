import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  Gender,
  UserRole,
  Level,
  TrainType,
  Duration,
  Location,
} from 'src/shared/libs/types';

export class LoggedUserRdo {
  @Expose()
  @ApiProperty({
    description: 'User id',
    example: '1234-5678-1234',
  })
  public id: string;

  @Expose()
  @ApiProperty({
    description: 'User first name',
    example: 'Alex',
  })
  public name: string;

  @Expose()
  @ApiProperty({
    description: 'User unique email address',
    example: 'user@user.com',
  })
  public email: string;

  @Expose()
  @ApiProperty({
    description: 'User avatar',
    example: 'avatar.png',
  })
  public avatar: string;

  @Expose()
  @ApiProperty({
    description: 'User gender',
    example: 'male',
  })
  public gender: Gender;

  @Expose()
  @ApiProperty({
    description: 'User birthday',
    example: '01.01.2001',
  })
  public birthDate: Date;

  @Expose()
  @ApiProperty({
    description: 'User role',
    example: 'Trainer',
  })
  public role: UserRole;

  @Expose()
  @ApiProperty({
    description: 'User info',
    example: 'Lorem ipsum',
  })
  public description: string;

  @Expose()
  @ApiProperty({
    description: 'User location',
    example: 'Pionerskaya',
  })
  public location: Location;

  @Expose()
  @ApiProperty({
    description: 'User background image',
    example: 'background.jpg',
  })
  public backgroundImage: string;

  @Expose()
  @ApiProperty({
    description: 'User level',
    example: 'newby',
  })
  public level: Level;

  @Expose()
  @ApiProperty({
    description: 'User train type',
    example: 'running',
  })
  public trainType: TrainType[];

  @ApiProperty({
    description: 'Desirable training duration',
    example: '10-30 мин',
  })
  public duration: Duration;

  @Expose()
  @ApiProperty({
    description: 'User calories target',
    example: '3500',
  })
  public caloriesTarget: number;

  @Expose()
  @ApiProperty({
    description: 'User calories daily target',
    example: '1500',
  })
  public caloriesDaily: number;

  @Expose()
  @ApiProperty({
    description: 'User ready/not ready to train',
    example: 'true',
  })
  public isReadyTrain: boolean;

  @Expose()
  @ApiProperty({
    description: 'Trainer certificates',
    example: 'certificate.pdf',
  })
  public certificates: string;

  @Expose()
  @ApiProperty({
    description: 'Trainer achievements',
    example: 'Lorem ipsum',
  })
  public achievements: boolean;

  @Expose()
  @ApiProperty({
    description: 'Access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  public accessToken: string;

  @Expose()
  @ApiProperty({
    description: 'Refresh token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  public refreshToken: string;
}
