import { UserRole } from './user-role.enum';
import { Location } from './location.enum';
import { Level } from './level.enum';
import { TrainType } from './train-type.enum';
import { Gender } from './gender.enum';
import { Duration } from './duration.enum';

export interface User {
  id?: string;
  name: string;
  email: string;
  avatar: string;
  passwordHash?: string;
  gender: Gender;
  birthDate?: Date;
  role: UserRole;
  description: string;
  location: Location;
  backgroundImage: string;
  level?: Level;
  friends?: string[];
  trainType?: TrainType[];
  isReadyTrain?: boolean;
  subscribedFor?: string[];
  duration?: Duration;
  caloriesTarget?: number;
  caloriesDaily?: number;
  certificates?: string;
  achievements?: string;
}
