import { BaseUser } from './base-user.interface';

export interface Trainer extends BaseUser {
  certificates: string;
  achievements: string;
}
