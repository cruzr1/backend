import { BaseUser } from './base-user.interface';
import { Duration } from './duration.enum';

export interface User extends BaseUser {
  duration: Duration;
  caloriesTarget: number;
  caloriesDaily: number;
}
