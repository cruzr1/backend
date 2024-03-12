import { Account, TrainType } from 'src/shared/libs/types';

export class AccountEntity implements Account {
  id?: string;
  trainType: TrainType;
  trainingsCount: number;

  constructor(data: Account) {
    this.id = data.id;
    this.trainType = data.trainType;
    this.trainingsCount = data.trainingsCount;
  }

  public toPOJO(): Account {
    return {
      id: this.id,
      trainType: this.trainType,
      trainingsCount: this.trainingsCount,
    };
  }

  static fromObject(data: Account): AccountEntity {
    return new AccountEntity(data);
  }
}
