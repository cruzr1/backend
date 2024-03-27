import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { OrderType, Payment } from 'src/shared/libs/types';

export class OrderRdo {
  @Expose()
  @ApiProperty({
    description: 'Order id',
    example: '1234-5678-1234',
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'Order type',
    example: 'Subscription',
    enum: OrderType,
  })
  orderType: OrderType;

  @Expose()
  @ApiProperty({
    description: 'Order author id',
    example: '1234-5678-1234',
  })
  userId: string;

  @Expose()
  @ApiProperty({
    description: 'Training id',
    example: '1234-5678-1234',
  })
  trainingId: string;

  @Expose()
  @ApiProperty({
    description: 'Order quantity',
    example: '10',
  })
  trainingsCount: number;

  @Expose()
  @ApiProperty({
    description: 'Order trining price',
    example: '2500',
  })
  trainingPrice: number;

  @Expose()
  @ApiProperty({
    description: 'Order sum',
    example: '25000',
  })
  trainingSum: number;

  @Expose()
  @ApiProperty({
    description: 'Order payment type',
    example: 'Visa',
    enum: Payment,
  })
  payment: Payment;
}
