import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { MongoRepository, User } from 'src/shared/libs/types';
import { UserModel } from './user.model';

@Injectable()
export class UserRepository extends MongoRepository<UserEntity, User> {
  constructor(@InjectModel(UserModel.name) UserModel: Model<UserModel>) {
    super(UserModel, UserEntity.fromObject);
  }

  public async findByEmail(email: string): Promise<UserEntity | null> {
    const document = await this.model.findOne({ email }).exec();
    if (document) {
      return this.createEntityFromDocument(document);
    }
    return null;
  }
}
