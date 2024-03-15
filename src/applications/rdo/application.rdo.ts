import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Status } from 'src/shared/libs/types';

export class ApplicationRdo {
  @Expose()
  @ApiProperty({
    description: 'Application id',
    example: '1234-5678-1234',
  })
  public id: string;

  @Expose()
  @ApiProperty({
    description: 'Application author id',
    example: '1234-5678-1234',
  })
  public authorId: string;

  @Expose()
  @ApiProperty({
    description: 'Application  user id',
    example: '1234-5678-1234',
  })
  public userId: string;

  @Expose()
  @ApiProperty({
    description: 'Application status',
    example: 'Accepted',
  })
  public status: Status;
}
