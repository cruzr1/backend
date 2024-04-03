import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import {
  MongoRepository,
  Order,
  TrainingOrderedAggregated,
} from 'src/shared/libs/types';
import { OrderEntity } from './order.entity';
import { OrderModel } from './order.model';

@Injectable()
export class OrdersRepository extends MongoRepository<OrderEntity, Order> {
  constructor(@InjectModel(OrderModel.name) orderModel: Model<OrderModel>) {
    super(orderModel, OrderEntity.fromObject);
  }

  public async findMany(
    trainingIds: string[],
  ): Promise<TrainingOrderedAggregated[]> {
    const trainingsOrderedAggregated: TrainingOrderedAggregated[] =
      await this.model
        .aggregate([
          {
            $match: {
              trainingId: { $in: [...trainingIds] },
            },
          },
          {
            $project: {
              trainingId: 1,
              trainingsCount: 1,
              trainingSum: 1,
            },
          },
          {
            $group: {
              _id: '$trainingId',
              trainingsCount: {
                $sum: '$trainingsCount',
              },
              trainingSum: {
                $sum: '$trainingSum',
              },
            },
          },
        ])
        .exec();
    return trainingsOrderedAggregated;
  }
}
