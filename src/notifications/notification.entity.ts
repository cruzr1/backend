import {
  Notification,
  NotificationPayloadType,
  NotifyStatus,
} from 'src/shared/libs/types';

export class NotificationEntity implements Notification {
  id?: string;
  notifyDate?: Date;
  userId: string;
  description: string;
  notifyStatus: NotifyStatus;
  payload: NotificationPayloadType;
  createdAt?: Date;

  constructor(data: Notification) {
    this.id = data.id;
    this.userId = data.userId;
    this.description = data.description;
    this.notifyStatus = data.notifyStatus;
    this.payload = data.payload;
    this.createdAt = data.createdAt;
  }

  public toPOJO(): Notification {
    return {
      id: this.id,
      notifyDate: this.notifyDate,
      userId: this.userId,
      description: this.description,
      notifyStatus: this.notifyStatus,
      payload: this.payload,
      createdAt: this.createdAt,
    };
  }

  static fromObject(data: Notification): NotificationEntity {
    return new NotificationEntity(data);
  }
}
