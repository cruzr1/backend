import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsMongoId, IsNotEmpty, Length } from 'class-validator';
import { NotificationValidationParams } from '../notification.constant';

export class CreateNotificaiton {
  @ApiProperty({
    description: 'Notification date',
    example: '01.01.2024',
  })
  @IsNotEmpty()
  @IsDate()
  public notifyDate: Date;

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
}
