import { Account } from 'src/shared/libs/types';

export class AccountEntity implements Account {
  id?: string;
  userId: string;
  trainingId: string;
  trainingsActive: number;
  trainingsInactive: number;

  constructor(data: Account) {
    this.id = data.id;
    this.userId = data.userId;
    this.trainingId = data.trainingId;
    this.trainingsActive = data.trainingsActive;
    this.trainingsInactive = data.trainingsInactive;
  }

  public toPOJO(): Account {
    return {
      id: this.id,
      userId: this.userId,
      trainingId: this.trainingId,
      trainingsActive: this.trainingsActive,
      trainingsInactive: this.trainingsInactive,
    };
  }

  static fromObject(data: Account): AccountEntity {
    return new AccountEntity(data);
  }
}
