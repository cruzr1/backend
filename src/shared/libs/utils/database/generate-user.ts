import { UserEntity } from 'src/users/user.entity';
import {
  MOCK_ACHIEVEMENT,
  MOCK_DESCRIPTION,
  mockAvatars,
  mockCertificates,
  mockNames,
  mockNicks,
  mockPhoto,
} from './mocks/users.mocks';
import {
  getRandomDate,
  getRandomItem,
  getRandomItems,
  getRandomBoolean,
  generateRandomValue,
} from './generators';
import {
  Gender,
  UserRole,
  Level,
  Location,
  TrainType,
  Duration,
} from '../../types';
import { UserValidationParams } from 'src/users/users.constant';

const START_DATE = 'January 1, 1971 01:01:01';
const END_DATE = 'December 31, 2007 01:01:01';
const DIVIDER = 100;

const generateUser = (): UserEntity => {
  const baseUserDraft = {
    name: getRandomItem<string>(mockNames),
    email: `${getRandomItem<string>(mockNicks)}@${getRandomItem<string>(mockNicks)}.com`,
    avatar: getRandomItem<string>(mockAvatars),
    passwordHash: '123456',
    gender: getRandomItem<Gender>(Object.values(Gender)),
    birthDate: getRandomDate(new Date(START_DATE), new Date(END_DATE)),
    role: getRandomBoolean() ? UserRole.User : UserRole.Trainer,
    description: MOCK_DESCRIPTION,
    location: getRandomItem<Location>(Object.values(Location)),
    backgroundImage: getRandomItem<string>(mockPhoto),
    level: getRandomItem<Level>(Object.values(Level)),
    trainType: getRandomItems<TrainType>(Object.values(TrainType), 3),
    isReadyTrain: getRandomBoolean(),
  };
  const optionalUserData =
    baseUserDraft.role === UserRole.Trainer
      ? {
          certificates: getRandomItem<string>(mockCertificates),
          achievements: MOCK_ACHIEVEMENT,
        }
      : {
          duration: getRandomItem<Duration>(Object.values(Duration)),
          caloriesTarget:
            generateRandomValue(
              UserValidationParams.Calories.Value.Minimal / DIVIDER,
              UserValidationParams.Calories.Value.Maximal / DIVIDER,
            ) * DIVIDER,
          caloriesDaily:
            generateRandomValue(
              UserValidationParams.Calories.Value.Minimal / DIVIDER,
              UserValidationParams.Calories.Value.Maximal / DIVIDER,
            ) * DIVIDER,
        };
  return new UserEntity({
    ...baseUserDraft,
    ...optionalUserData,
  });
};

export function generateUserEntities(length: number): UserEntity[] {
  return Array.from({ length }, generateUser);
}
