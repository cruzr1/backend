import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Status } from 'src/shared/libs/types';

export class UpdateApplication {
  @ApiProperty({
    description: 'Application status',
    example: 'Accepted',
  })
  @IsNotEmpty()
  @IsEnum(Status)
  public status: Status;
}
