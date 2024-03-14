import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { MongoRepository, Order } from 'src/shared/libs/types';
import { OrderEntity } from './order.entity';
import { OrderModel } from './order.model';

@Injectable()
export class ApplicationsRepository extends MongoRepository<
  OrderEntity,
  Order
> {
  constructor(@InjectModel(OrderModel.name) orderModel: Model<OrderModel>) {
    super(orderModel, OrderEntity.fromObject);
  }
}
