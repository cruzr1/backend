import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import {
  MongoRepository,
  Account,
  TrainingAggregated,
} from 'src/shared/libs/types';
import { AccountEntity } from './account.entity';
import { AccountModel } from './account.model';

@Injectable()
export class AccountsRepository extends MongoRepository<
  AccountEntity,
  Account
> {
  constructor(
    @InjectModel(AccountModel.name)
    accountModel: Model<AccountModel>,
  ) {
    super(accountModel, AccountEntity.fromObject);
  }

  public async findAccount(
    userId: string,
    trainingId: string,
  ): Promise<AccountEntity | null> {
    const existAccount = await this.model
      .findOne({ userId, trainingId })
      .exec();
    if (existAccount) {
      return this.createEntityFromDocument(existAccount);
    }
    return null;
  }

  public async findMany(trainingIds: string[]): Promise<TrainingAggregated[]> {
    const trainingsAggregated: TrainingAggregated[] = await this.model
      .aggregate([
        {
          $match: {
            trainingId: { $in: [...trainingIds] },
          },
        },
        {
          $project: {
            trainingId: 1,
            trainingsActive: 1,
          },
        },
        {
          $group: {
            _id: '$trainingId',
            trainingsActive: {
              $sum: '$trainingsActive',
            },
          },
        },
      ])
      .exec();
    return trainingsAggregated;
  }
}
