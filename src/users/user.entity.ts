import { BaseUserEntity } from './base-user.entity';
import { User, Duration } from 'src/shared/libs/types';

export class UserEntity extends BaseUserEntity implements User {
  duration: Duration;
  caloriesTarget: number;
  caloriesDaily: number;

  constructor(data: User) {
    super(data);
    this.duration = data.duration;
    this.caloriesTarget = data.caloriesTarget;
    this.caloriesDaily = data.caloriesDaily;
  }

  public toPOJO(): User {
    return {
      ...super.toPOJO(),
      duration: this.duration,
      caloriesTarget: this.caloriesTarget,
      caloriesDaily: this.caloriesDaily,
    };
  }

  static fromObject(data: User): UserEntity {
    return new UserEntity(data);
  }
}
