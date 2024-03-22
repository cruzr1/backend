import mongoose, { Model, FilterQuery } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { MongoRepository, User, PaginationResult } from 'src/shared/libs/types';
import { UserModel } from './user.model';
import { IndexUsersQuery } from 'src/shared/query/index-users.query';
import {
  DEFAULT_LIST_REQUEST_COUNT,
  DEFAULT_PAGE_NUMBER,
  DEFAULT_SORT_BY_FIELD,
  DEFAULT_SORT_BY_ORDER,
} from './users.constant';

@Injectable()
export class UsersRepository extends MongoRepository<UserEntity, User> {
  constructor(@InjectModel(UserModel.name) userModel: Model<UserModel>) {
    super(userModel, UserEntity.fromObject);
  }

  public async findByEmail(email: string): Promise<UserEntity | null> {
    const document = await this.model.findOne({ email }).exec();
    if (document) {
      return this.createEntityFromDocument(document);
    }
    return null;
  }

  public async findMany({
    page = DEFAULT_PAGE_NUMBER,
    sortByField = DEFAULT_SORT_BY_FIELD,
    sortByOrder = DEFAULT_SORT_BY_ORDER,
    take = DEFAULT_LIST_REQUEST_COUNT,
    ...queryParams
  }: IndexUsersQuery): Promise<PaginationResult<UserEntity>> {
    const query: FilterQuery<IndexUsersQuery> = {};
    if (queryParams.location) {
      query.location = queryParams.location;
    }
    if (queryParams.level) {
      query.level = queryParams.level;
    }
    if (queryParams.trainType) {
      query.trainType = { $in: [...queryParams.trainType] };
    }
    const skip = (page - DEFAULT_PAGE_NUMBER) * take;
    const orderBy = { [sortByField]: sortByOrder };
    const [usersList, totalUsers] = await Promise.all([
      this.model.find(query).sort(orderBy).skip(skip).limit(take).exec(),
      this.model.countDocuments(query).exec(),
    ]);
    return {
      entities: usersList.map((user) => this.createEntityFromDocument(user)),
      currentPage: page,
      totalPages: Math.ceil(totalUsers / take),
      totalItems: totalUsers,
    };
  }

  public async indexFriends(friendsIds: string[]): Promise<UserEntity[]> {
    const friendsObjectIds = friendsIds.map(
      (friendId) => new mongoose.Types.ObjectId(friendId),
    );
    const userDocuments = await this.model
      .find({ _id: { $in: [...friendsObjectIds] } })
      .exec();
    return userDocuments.map((user) => this.createEntityFromDocument(user));
  }

  public async indexSubscribers(trainerId: string): Promise<UserEntity[]> {
    const userDocuments = await this.model
      .find({ subscribedFor: trainerId })
      .exec();
    return userDocuments.map((user) => this.createEntityFromDocument(user));
  }
}
