import { Application, Status } from 'src/shared/libs/types';

export class ApplicationEntity implements Application {
  id?: string;
  authorId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  status: Status;

  constructor(data: Application) {
    this.id = data.id;
    this.authorId = data.authorId;
    this.userId = data.userId;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.status = data.status;
  }

  public toPOJO(): Application {
    return {
      id: this.id,
      authorId: this.authorId,
      userId: this.userId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      status: this.status,
    };
  }

  static fromObject(data: Application): ApplicationEntity {
    return new ApplicationEntity(data);
  }
}
