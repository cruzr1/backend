import { TrainType } from './train-type.enum';

export interface Account {
  id?: string;
  trainType: TrainType;
  trainingsCount: number;
}
