import { Training } from './training.interface';

export interface TrainingJob extends Training {
  notificationId: string;
}
