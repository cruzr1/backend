import { NotificationPayloadType } from './notification-payload.type';
import { NotifyStatus } from './notify-status.type';

export interface Notification {
  id?: string;
  notifyDate?: Date;
  userId: string;
  description: string;
  notifyStatus: NotifyStatus;
  payload: NotificationPayloadType;
}
