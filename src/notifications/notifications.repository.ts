import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { MongoRepository, Notification } from 'src/shared/libs/types';
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
    const notificaitonsList = await this.model.find({ userId }).exec();
    return notificaitonsList.map((notificaiton) =>
      this.createEntityFromDocument(notificaiton),
    );
  }
}
