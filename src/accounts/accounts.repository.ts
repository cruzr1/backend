import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { MongoRepository, Account } from 'src/shared/libs/types';
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
}
