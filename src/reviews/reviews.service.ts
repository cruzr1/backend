import { TrainingsService } from 'src/trainings/trainings.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewEntity } from './review.entity';
import { ReviewsRepository } from './reviews.repository';
import { PaginationResult, UserRole } from 'src/shared/libs/types';
import { IndexReviewsQuery } from 'src/shared/query/index-reviews.query';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { generateReviewsEntities } from 'src/shared/libs/utils/database/generate-review';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly reviewsRepository: ReviewsRepository,
    private readonly trainingService: TrainingsService,
    private readonly usersService: UsersService,
  ) {}

  public async createNewReview(
    authorId: string,
    trainingId: string,
    dto: CreateReviewDto,
  ): Promise<ReviewEntity> {
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
    return savedReview;
  }

  public async indexReviews(
    query?: IndexReviewsQuery,
  ): Promise<PaginationResult<ReviewEntity>> {
    return await this.reviewsRepository.findMany(query ?? {});
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
