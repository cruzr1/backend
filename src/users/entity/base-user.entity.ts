import { genSalt, compare, hash } from 'bcrypt';
import { SALT_ROUNDS } from '../user.constant';
import {
  BaseUser,
  UserRole,
  Location,
  Level,
  TrainType,
  Gender,
} from 'src/shared/libs/types';

export class BaseUserEntity implements BaseUser {
  id?: string;
  name: string;
  email: string;
  avatar: string;
  passwordHash: string;
  gender: Gender;
  birthDate?: Date;
  role: UserRole;
  description: string;
  location: Location;
  backgroundImage: string;
  createdAt: Date;
  level: Level;
  trainType: TrainType;
  isReadyTrain: boolean;
  friends: string[];

  constructor(data: BaseUser) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.avatar = data.avatar;
    this.passwordHash = data.passwordHash;
    this.gender = data.gender;
    this.birthDate = data.birthDate;
    this.role = data.role;
    this.description = data.description;
    this.location = data.location;
    this.backgroundImage = data.backgroundImage;
    this.createdAt = data.createdAt;
    this.level = data.level;
    this.trainType = data.trainType;
    this.isReadyTrain = data.isReadyTrain;
    this.friends = [];
  }

  public toPOJO(): BaseUser {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      avatar: this.avatar,
      passwordHash: this.passwordHash,
      gender: this.gender,
      birthDate: this.birthDate,
      role: this.role,
      description: this.description,
      location: this.location,
      backgroundImage: this.backgroundImage,
      createdAt: this.createdAt,
      level: this.level,
      trainType: this.trainType,
      isReadyTrain: this.isReadyTrain,
    };
  }

  public async setPassword(password: string): Promise<BaseUserEntity> {
    const salt = await genSalt(SALT_ROUNDS);
    this.passwordHash = await hash(password, salt);
    return this;
  }

  public async comparePassword(password: string): Promise<boolean> {
    return compare(password, this.passwordHash);
  }

  static fromObject(data: BaseUser): BaseUserEntity {
    return new BaseUserEntity(data);
  }
}
