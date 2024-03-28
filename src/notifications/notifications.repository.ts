import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import {
  MongoRepository,
  Notification,
  NotifyStatus,
} from 'src/shared/libs/types';
import { NotificationEntity } from './notification.entity';
import { NotificationModel } from './notification.model';

@Injectable()
export class NotificationsRepository extends MongoRepository<
  NotificationEntity,
  Notification
> {
  constructor(
    @InjectModel(NotificationModel.name)
    notificationModel: Model<NotificationModel>,
  ) {
    super(notificationModel, NotificationEntity.fromObject);
  }

  public async findMany(userId: string): Promise<NotificationEntity[]> {
    const notificationsList = await this.model.find({ userId }).exec();
    return notificationsList.map((notification) =>
      this.createEntityFromDocument(notification),
    );
  }

  public async findCreatedNotifications(): Promise<NotificationEntity[]> {
    const notificationsList = await this.model
      .find({ notifyStatus: NotifyStatus.Created })
      .exec();
    return notificationsList.map((notification) =>
      this.createEntityFromDocument(notification),
    );
  }
}
