import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import {
  MongoRepository,
  Review,
  PaginationResult,
} from 'src/shared/libs/types';
import { ReviewEntity } from './review.entity';
import { ReviewModel } from './review.model';
import { IndexReviewsQuery } from 'src/shared/query/index-reviews.query';
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_LIST_REQUEST_COUNT,
} from './reviews.constant';

@Injectable()
export class ReviewsRepository extends MongoRepository<ReviewEntity, Review> {
  constructor(@InjectModel(ReviewModel.name) reviewModel: Model<ReviewModel>) {
    super(reviewModel, ReviewEntity.fromObject);
  }

  public async findMany({
    page = DEFAULT_PAGE_NUMBER,
  }: IndexReviewsQuery): Promise<PaginationResult<ReviewEntity>> {
    const skip = (page - DEFAULT_PAGE_NUMBER) * DEFAULT_LIST_REQUEST_COUNT;
    const [reviewsList, totalReviews] = await Promise.all([
      this.model.find().skip(skip).limit(DEFAULT_LIST_REQUEST_COUNT).exec(),
      this.model.countDocuments().exec(),
    ]);
    return {
      entities: reviewsList.map(
        (review) => this.createEntityFromDocument(review) as ReviewEntity,
      ),
      currentPage: page,
      totalPages: Math.ceil(totalReviews / DEFAULT_LIST_REQUEST_COUNT),
    };
  }
}
