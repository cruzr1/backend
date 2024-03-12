import { Status } from './status.enum';

export interface Application {
  id?: string;
  authorId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  status: Status;
}
