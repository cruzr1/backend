import { IsNotEmpty, IsMongoId, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderType, Payment } from 'src/shared/libs/types';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Order type',
    example: 'Subscription',
    enum: OrderType,
  })
  @IsNotEmpty()
  @IsEnum(OrderType)
  public orderType: OrderType;

  @ApiProperty({
    description: 'Training id',
    example: '65f800bfabf2d4bb55beb36b',
  })
  @IsNotEmpty()
  @IsMongoId()
  public trainingId: string;

  @ApiProperty({
    description: 'Order quantity',
    example: '10',
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  public trainingsCount: number;

  @ApiProperty({
    description: 'Order payment type',
    example: 'Visa',
    enum: Payment,
  })
  @IsNotEmpty()
  @IsEnum(Payment)
  public payment: Payment;
}
