import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewEntity } from './review.entity';
import { ReviewsRepository } from './reviews.repository';
import { PaginationResult } from 'src/shared/libs/types';
import { IndexReviewsQuery } from 'src/shared/query/index-reviews.query';

export class ReviewsService {
  constructor(private readonly reviewsRepository: ReviewsRepository) {}

  public async createNewReview(dto: CreateReviewDto): Promise<ReviewEntity> {
    const newReview = new ReviewEntity(dto);
    return await this.reviewsRepository.save(newReview);
  }

  public async indexReviews(
    query?: IndexReviewsQuery,
  ): Promise<PaginationResult<ReviewEntity>> {
    return await this.reviewsRepository.findMany(query ?? {});
  }
}
