import { genSalt, compare, hash } from 'bcrypt';
import { SALT_ROUNDS } from './users.constant';
import {
  User,
  UserRole,
  Location,
  Level,
  TrainType,
  Gender,
  Duration,
} from 'src/shared/libs/types';

export class UserEntity implements User {
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
  trainType: TrainType[];
  isReadyTrain: boolean;
  friends: string[];
  certificates: string;
  achievements: string;
  duration: Duration;
  caloriesTarget: number;
  caloriesDaily: number;

  constructor(data: User) {
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
    this.createdAt = data.createdAt || new Date();
    this.level = data.level;
    this.trainType = data.trainType;
    this.isReadyTrain = data.isReadyTrain;
    this.friends = [];
    this.certificates = data.certificates || '';
    this.achievements = data.achievements || '';
    this.duration = data.duration || Duration.From10to30min;
    this.caloriesTarget = data.caloriesTarget || 0;
    this.caloriesDaily = data.caloriesDaily || 0;
  }

  public toPOJO(): User {
    if (this.role === UserRole.User) {
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
        duration: this.duration,
        caloriesTarget: this.caloriesTarget,
        caloriesDaily: this.caloriesDaily,
      };
    }
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
      certificates: this.certificates,
      achievements: this.achievements,
    };
  }

  public async setPassword(password: string): Promise<UserEntity> {
    const salt = await genSalt(SALT_ROUNDS);
    this.passwordHash = await hash(password, salt);
    return this;
  }

  public async comparePassword(password: string): Promise<boolean> {
    return compare(password, this.passwordHash);
  }

  static fromObject(data: User): UserEntity {
    return new UserEntity(data);
  }
}
