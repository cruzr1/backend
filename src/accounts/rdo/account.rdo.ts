import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AccountRdo {
  @Expose()
  @ApiProperty({
    description: 'Account id',
    example: '1234-5678-1234',
  })
  public id?: string;

  @Expose()
  @ApiProperty({
    description: 'User id',
    example: '1234-5678-1234',
  })
  public userId: string;

  @Expose()
  @ApiProperty({
    description: 'Training id',
    example: '1234-5678-1234',
  })
  public trainingId: string;

  @Expose()
  @ApiProperty({
    description: 'Trainings active count',
    example: '1234-5678-1234',
  })
  public trainingsActive: number;

  @Expose()
  @ApiProperty({
    description: 'Trainings inactive count',
    example: '1234-5678-1234',
  })
  public trainingsInactive: number;
}
