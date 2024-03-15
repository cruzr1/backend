import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { OrderType, Payment, Order } from 'src/shared/libs/types';

@Schema({
  collection: 'orders',
  timestamps: true,
})
export class OrderModel extends Document implements Order {
  @Prop({
    required: true,
  })
  public orderType: OrderType;

  @Prop({
    required: true,
  })
  public userId: string;

  @Prop({
    required: true,
  })
  public trainingId: string;

  @Prop({
    required: true,
  })
  public price: number;

  @Prop({
    required: true,
  })
  public trainingsCount: number;

  @Prop({
    required: true,
  })
  public sum: number;

  @Prop({
    required: true,
  })
  public payment: Payment;
}

export const OrderSchema = SchemaFactory.createForClass(OrderModel);
