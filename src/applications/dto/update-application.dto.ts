import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Status } from 'src/shared/libs/types';

export class UpdateApplicationDto {
  @ApiProperty({
    description: 'Application status',
    example: 'Accepted',
    enum: Status,
  })
  @IsNotEmpty()
  @IsEnum(Status)
  public status: Status;
}
