import { Application, Status } from 'src/shared/libs/types';

export class ApplicationEntity implements Application {
  id?: string;
  authorId: string;
  userId: string;
  trainingId?: string;
  status: Status;
  updatedAt?: Date;

  constructor(data: Application) {
    this.id = data.id;
    this.authorId = data.authorId;
    this.userId = data.userId;
    this.trainingId = data.trainingId;
    this.status = data.status;
    this.updatedAt = data.updatedAt;
  }

  public toPOJO(): Application {
    return {
      id: this.id,
      authorId: this.authorId,
      userId: this.userId,
      status: this.status,
      updatedAt: this.updatedAt,
      trainingId: this.trainingId,
    };
  }

  static fromObject(data: Application): ApplicationEntity {
    return new ApplicationEntity(data);
  }
}
