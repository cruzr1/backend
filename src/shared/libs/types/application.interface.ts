import { Status } from './status.enum';

export interface Application {
  id?: string;
  authorId: string;
  userId: string;
  trainingId?: string;
  status: Status;
  updatedAt?: Date;
}
