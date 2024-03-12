import { Notification } from 'src/shared/libs/types';

export class NotificationEntity implements Notification {
  id?: string;
  notifyDate: Date;
  userId: string;
  description: string;

  constructor(data: Notification) {
    this.id = data.id;
    this.notifyDate = data.notifyDate;
    this.userId = data.userId;
    this.description = data.description;
  }

  public toPOJO(): Notification {
    return {
      id: this.id,
      notifyDate: this.notifyDate,
      userId: this.userId,
      description: this.description,
    };
  }

  static fromObject(data: Notification): NotificationEntity {
    return new NotificationEntity(data);
  }
}
