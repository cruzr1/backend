import { IsNotEmpty, IsMongoId, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderType, Payment } from 'src/shared/libs/types';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Order type',
    example: 'Subscription',
  })
  @IsNotEmpty()
  @IsEnum(OrderType)
  public orderType: OrderType;

  @ApiProperty({
    description: 'Order author id',
    example: '1234-5678-1234',
  })
  @IsNotEmpty()
  @IsMongoId()
  public userId: string;

  @ApiProperty({
    description: 'Training id',
    example: '1234-5678-1234',
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
  public trainingsCount: number;

  @ApiProperty({
    description: 'Order payment type',
    example: 'Visa',
  })
  @IsNotEmpty()
  @IsEnum(Payment)
  public payment: Payment;
}
