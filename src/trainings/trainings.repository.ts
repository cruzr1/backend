import { Model, FilterQuery } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { TrainingEntity } from './training.entity';
import {
  MongoRepository,
  Training,
  PaginationResult,
} from 'src/shared/libs/types';
import { TrainingModel } from './training.model';
import { IndexTrainingsQuery } from 'src/query/index-trainings.query';
import {
  DEFAULT_LIST_REQUEST_COUNT,
  DEFAULT_PAGE_NUMBER,
  DEFAULT_SORT_BY_FIELD,
  DEFAULT_SORT_BY_ORDER,
} from './trainings.constant';

@Injectable()
export class TrainingsRepository extends MongoRepository<
  TrainingEntity,
  Training
> {
  constructor(
    @InjectModel(TrainingModel.name) TrainingModel: Model<TrainingModel>,
  ) {
    super(TrainingModel, TrainingEntity.fromObject);
  }

  public async findMany({
    page = DEFAULT_PAGE_NUMBER,
    sortByField = DEFAULT_SORT_BY_FIELD,
    sortByOrder = DEFAULT_SORT_BY_ORDER,
    ...queryParams
  }: IndexTrainingsQuery): Promise<PaginationResult<TrainingEntity>> {
    const query: FilterQuery<IndexTrainingsQuery> = {};
    if (queryParams.priceFilter) {
      query.price = {
        $and: [
          { $gte: Math.min(...queryParams.priceFilter) },
          { $lte: Math.max(...queryParams.priceFilter) },
        ],
      };
    }
    if (queryParams.caloriesFilter) {
      query.calories = {
        $and: [
          { $gte: Math.min(...queryParams.caloriesFilter) },
          { $lte: Math.max(...queryParams.caloriesFilter) },
        ],
      };
    }
    if (queryParams.ratingFilter) {
      query.rating = queryParams.ratingFilter;
    }
    if (queryParams.durationFilter) {
      query.duration = { $in: [...queryParams.durationFilter] };
    }
    if (queryParams.trainTypeFilter) {
      query.trainTypeFilter = queryParams.trainTypeFilter;
    }
    const skip = (page - DEFAULT_PAGE_NUMBER) * DEFAULT_LIST_REQUEST_COUNT;
    const orderBy = { [sortByField]: sortByOrder };
    const [trainingsList, totalTrainings] = await Promise.all([
      this.model
        .find(query)
        .sort(orderBy)
        .skip(skip)
        .limit(DEFAULT_LIST_REQUEST_COUNT)
        .exec(),
      this.model.countDocuments(query).exec(),
    ]);
    return {
      entities: trainingsList.map(
        (training) => this.createEntityFromDocument(training) as TrainingEntity,
      ),
      currentPage: page,
      totalPages: Math.ceil(totalTrainings / DEFAULT_LIST_REQUEST_COUNT),
    };
  }
}
