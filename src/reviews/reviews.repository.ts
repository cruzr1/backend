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
  DEFAULT_SORT_BY_FIELD,
  DEFAULT_SORT_BY_ORDER,
} from 'src/app.config';

@Injectable()
export class ReviewsRepository extends MongoRepository<ReviewEntity, Review> {
  constructor(@InjectModel(ReviewModel.name) reviewModel: Model<ReviewModel>) {
    super(reviewModel, ReviewEntity.fromObject);
  }

  public async findMany({
    page = DEFAULT_PAGE_NUMBER,
    sortByField = DEFAULT_SORT_BY_FIELD,
    sortByOrder = DEFAULT_SORT_BY_ORDER,
    take = DEFAULT_LIST_REQUEST_COUNT,
  }: IndexReviewsQuery): Promise<PaginationResult<ReviewEntity>> {
    const skip = (page - DEFAULT_PAGE_NUMBER) * take;
    const orderBy = { [sortByField]: sortByOrder };
    const [reviewsList, totalReviews] = await Promise.all([
      this.model.find().sort(orderBy).skip(skip).limit(take).exec(),
      this.model.countDocuments().exec(),
    ]);
    return {
      entities: reviewsList.map((review) =>
        this.createEntityFromDocument(review),
      ),
      currentPage: page,
      totalPages: Math.ceil(totalReviews / take),
      totalItems: totalReviews,
    };
  }

  public async calculateAverage(trainingId: string): Promise<number> {
    const averageRating = await this.model
      .aggregate<Record<'averageRating', number>>([
        {
          $match: {
            trainingId,
          },
        },
        {
          $group: {
            _id: null,
            averageRating: {
              $avg: '$rating',
            },
          },
        },
        {
          $project: {
            averageRating: { $round: ['$averageRating', 1] },
          },
        },
        {
          $unset: ['_id'],
        },
      ])
      .exec();
    return averageRating[0].averageRating;
  }
}
