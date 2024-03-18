import { TrainingEntity } from 'src/trainings/training.entity';

export type TrainingOrdered = {
  training: TrainingEntity;
  trainingsOrderedCount: number;
  trainingsOrderedSum: number;
};
