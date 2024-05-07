import { TrainingEntity } from 'src/trainings/training.entity';
import { getRandomItem, generateRandomValue } from './generators';
import { UserEntity } from 'src/users/user.entity';
import { MOCK_COMMENT } from './mocks/review.mocks';
import { ReviewValidationParams } from 'src/reviews/reviews.constant';
import { ReviewEntity } from 'src/reviews/review.entity';

const generateReview = (
  usersList: UserEntity[],
  trainingsList: TrainingEntity[],
): ReviewEntity =>
  new ReviewEntity({
    rating: generateRandomValue(
      ReviewValidationParams.Rating.Value.Minimum,
      ReviewValidationParams.Rating.Value.Maximum,
    ),
    comment: MOCK_COMMENT,
    authorId: getRandomItem<UserEntity>(usersList).id as string,
    trainingId: getRandomItem<TrainingEntity>(trainingsList).id as string,
  });

export function generateReviewsEntities(
  length: number,
  usersList: UserEntity[],
  trainingsList: TrainingEntity[],
): ReviewEntity[] {
  return Array.from({ length }, () => generateReview(usersList, trainingsList));
}
