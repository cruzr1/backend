import { TrainingsService } from 'src/trainings/trainings.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewEntity } from './review.entity';
import { ReviewsRepository } from './reviews.repository';
import { PaginationResult, UserRole } from 'src/shared/libs/types';
import { IndexReviewsQuery } from 'src/shared/query/index-reviews.query';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { generateReviewsEntities } from 'src/shared/libs/utils/database/generate-review';
import { REVIEW_ALREADY_EXISTS } from './reviews.constant';
import { UserEntity } from 'src/users/user.entity';
import { AuthorDataType } from 'src/shared/libs/types/author-data.type';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly reviewsRepository: ReviewsRepository,
    private readonly trainingService: TrainingsService,
    private readonly usersService: UsersService,
  ) {}

  public async getReviewByAuthorIdTrainingId(
    authorId: string,
    trainingId: string,
  ): Promise<ReviewEntity | null> {
    return await this.reviewsRepository.findByAuthorTraining(
      authorId,
      trainingId,
    );
  }

  public async createNewReview(
    authorId: string,
    trainingId: string,
    dto: CreateReviewDto,
  ): Promise<AuthorDataType> {
    const existReview = await this.getReviewByAuthorIdTrainingId(
      authorId,
      trainingId,
    );
    if (existReview) {
      throw new ForbiddenException(REVIEW_ALREADY_EXISTS);
    }
    const newReview = new ReviewEntity({ ...dto, authorId, trainingId });
    const savedReview = await this.reviewsRepository.save(newReview);
    const { trainerId } =
      await this.trainingService.getTrainingEntity(trainingId);
    const rating = await this.calculateAverageRating(trainingId);
    await this.trainingService.updateTraining(
      trainingId,
      {
        rating,
      },
      trainerId,
    );
    const { avatar, name } = await this.usersService.getUserEntity(authorId);

    return { ...savedReview, name, avatar };
  }

  public async indexReviews(
    trainingId: string,
    query?: IndexReviewsQuery,
  ): Promise<PaginationResult<AuthorDataType>> {
    const reviewsPaginated = await this.reviewsRepository.findMany(
      trainingId,
      query ?? {},
    );
    const authorIds = reviewsPaginated.entities.map(
      (review) => review.authorId,
    );
    const authors = await this.usersService.indexAuthors(authorIds);
    const createCompletedReview = (review: ReviewEntity) => {
      const { name, avatar } = authors.find(
        ({ id }) => id === review.authorId,
      ) as UserEntity;
      return {
        ...review.toPOJO(),
        name,
        avatar,
      };
    };
    const completedReviews: AuthorDataType[] = reviewsPaginated.entities.map(
      (review) => createCompletedReview(review),
    );
    return {
      ...reviewsPaginated,
      entities: completedReviews,
    };
  }

  public async calculateAverageRating(trainingId: string): Promise<number> {
    return await this.reviewsRepository.calculateAverage(trainingId);
  }

  public async seedReviewsDatabase(count: number): Promise<void> {
    const usersList = await this.usersService.getUsersList(UserRole.User);
    const trainingsList = await this.trainingService.getTrainingsList();
    const reviewsEntities = generateReviewsEntities(
      count,
      usersList,
      trainingsList,
    );
    await this.reviewsRepository.insertMany(reviewsEntities);
  }
}
