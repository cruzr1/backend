import { BaseUserEntity } from 'src/users/base-user.entity';
import { Trainer } from 'src/shared/libs/types';

export class TrainerEntity extends BaseUserEntity implements Trainer {
  certificates: string;
  achievements: string;

  constructor(data: Trainer) {
    super(data);
    this.certificates = data.certificates;
    this.achievements = data.achievements;
  }

  public toPOJO(): Trainer {
    return {
      ...super.toPOJO(),
      certificates: this.certificates,
      achievements: this.achievements,
    };
  }

  static fromObject(data: Trainer): TrainerEntity {
    return new TrainerEntity(data);
  }
}
