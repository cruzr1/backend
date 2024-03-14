import { Application, Status } from 'src/shared/libs/types';

export class ApplicationEntity implements Application {
  id?: string;
  authorId: string;
  userId: string;
  status: Status;

  constructor(data: Application) {
    this.id = data.id;
    this.authorId = data.authorId;
    this.userId = data.userId;
    this.status = data.status;
  }

  public toPOJO(): Application {
    return {
      id: this.id,
      authorId: this.authorId,
      userId: this.userId,
      status: this.status,
    };
  }

  static fromObject(data: Application): ApplicationEntity {
    return new ApplicationEntity(data);
  }
}
