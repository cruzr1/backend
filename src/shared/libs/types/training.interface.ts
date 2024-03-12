import { Duration } from './duration.enum';
import { Gender } from './gender.enum';
import { Level } from './level.enum';
import { TrainType } from './train-type.enum';

export interface Training {
  id: string;
  name: string;
  backgroundImage: string;
  level: Level;
  trainType: TrainType;
  duration: Duration;
  price: number;
  calories: number;
  description: string;
  gender: Gender;
  videoURL: string;
  rating: number;
  trainerId: string;
  isSpecial: boolean;
}
