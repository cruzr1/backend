import { Account } from 'src/shared/libs/types';

export class AccountEntity implements Account {
  id?: string;
  trainingId: string;
  trainingsCount: number;

  constructor(data: Account) {
    this.id = data.id;
    this.trainingId = data.trainingId;
    this.trainingsCount = data.trainingsCount;
  }

  public toPOJO(): Account {
    return {
      id: this.id,
      trainingId: this.trainingId,
      trainingsCount: this.trainingsCount,
    };
  }

  static fromObject(data: Account): AccountEntity {
    return new AccountEntity(data);
  }
}
