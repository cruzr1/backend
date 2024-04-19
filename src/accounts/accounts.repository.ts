import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import {
  MongoRepository,
  Account,
  TrainingAggregated,
} from 'src/shared/libs/types';
import { AccountEntity } from './account.entity';
import { AccountModel } from './account.model';

type QueryAccountsType = {
  userId: string;
  trainingsActive: number;
};

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

  public async findManyByUserId(
    userId: string,
    isActiveTrainings?: boolean,
  ): Promise<AccountEntity[]> {
    const query: FilterQuery<QueryAccountsType> = { userId };
    if (isActiveTrainings && isActiveTrainings === true) {
      query.trainingsActive = { $gt: 0 };
    }
    const accountDocuments = await this.model.find(query).exec();
    return accountDocuments.map((account) =>
      this.createEntityFromDocument(account),
    );
  }
}
