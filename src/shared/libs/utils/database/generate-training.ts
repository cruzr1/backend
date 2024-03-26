import { TrainingEntity } from 'src/trainings/training.entity';
import {
  getRandomItem,
  getRandomBoolean,
  generateRandomValue,
} from './generators';
import {
  mockTrainingNames,
  mockTrainingPhoto,
  mockVideo,
  MOCK_DESCRIPTION,
} from './mocks/trainings.mocks';
import {
  TrainingValidationParams,
  INITIAL_RATING,
} from 'src/trainings/trainings.constant';
import { Gender, Level, TrainType, Duration } from '../../types';
import { UserEntity } from 'src/users/user.entity';

const DIVIDER = 100;
const TRAINING_MAXIMUM_PRICE = 20000;

const generateTraining = (trainersList: UserEntity[]): TrainingEntity =>
  new TrainingEntity({
    name: getRandomItem<string>(mockTrainingNames),
    backgroundImage: getRandomItem<string>(mockTrainingPhoto),
    level: getRandomItem<Level>(Object.values(Level)),
    trainType: getRandomItem<TrainType>(Object.values(TrainType)),
    duration: getRandomItem<Duration>(Object.values(Duration)),
    price:
      generateRandomValue(
        TrainingValidationParams.Price.Value.Minimum / DIVIDER,
        TRAINING_MAXIMUM_PRICE / DIVIDER,
      ) * DIVIDER,
    calories:
      generateRandomValue(
        TrainingValidationParams.Calories.Value.Minimum / DIVIDER,
        TrainingValidationParams.Calories.Value.Maximum / DIVIDER,
      ) * DIVIDER,
    description: MOCK_DESCRIPTION,
    gender: getRandomItem<Gender>(Object.values(Gender)),
    videoURL: getRandomItem<string>(mockVideo),
    rating: INITIAL_RATING,
    trainerId: getRandomItem<UserEntity>(trainersList).id as string,
    isSpecial: getRandomBoolean(),
  });

export function generateTrainingEntities(
  length: number,
  trainersList: UserEntity[],
): TrainingEntity[] {
  return Array.from({ length }, () => generateTraining(trainersList));
}
