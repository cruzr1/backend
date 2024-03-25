import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsObject, Length } from 'class-validator';
import { NotificationValidationParams } from '../notifications.constant';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'Notified User Id',
    example: '1234-5678-1234',
  })
  @IsNotEmpty()
  @IsMongoId()
  public userId: string;

  @ApiProperty({
    description: 'Notification text',
    example: 'Lorem ipsum',
  })
  @IsNotEmpty()
  @Length(
    NotificationValidationParams.Description.Length.Minimum,
    NotificationValidationParams.Description.Length.Maximum,
  )
  public description: string;

  @ApiProperty({
    description: 'Notification text',
    example: 'Lorem ipsum',
  })
  @IsNotEmpty()
  @IsObject()
  public payload: string;
}
