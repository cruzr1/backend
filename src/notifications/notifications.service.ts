import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationEntity } from './notification.entity';
import { NotificationsRepository } from './notifications.repository';
import {
  NOTIFICATION_NOT_FOUND,
  USER_FORBIDDEN,
} from './notifications.constant';
import { NotifyStatus } from 'src/shared/libs/types';

export class NotificationsService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  public async createNewNotification(
    dto: CreateNotificationDto,
  ): Promise<NotificationEntity> {
    const newNotification = new NotificationEntity({
      ...dto,
      notifyDate: new Date(),
      notifyStatus: NotifyStatus.Created,
    });
    return await this.notificationsRepository.save(newNotification);
  }

  public async getNotificationEntity(
    notificationId: string,
  ): Promise<NotificationEntity> {
    const existNotification =
      await this.notificationsRepository.findById(notificationId);
    if (!existNotification) {
      throw new NotFoundException(NOTIFICATION_NOT_FOUND);
    }
    return existNotification;
  }

  public async deleteNotification(
    notificationId: string,
    userId: string,
  ): Promise<void> {
    const existNotification = await this.getNotificationEntity(notificationId);
    if (existNotification.userId !== userId) {
      throw new ForbiddenException(USER_FORBIDDEN);
    }
    await this.notificationsRepository.deleteById(notificationId);
  }

  public async indexNotificaitons(
    userId: string,
  ): Promise<NotificationEntity[]> {
    return await this.notificationsRepository.findMany(userId);
  }
}
