import { Model, FilterQuery } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { TrainingEntity } from './training.entity';
import {
  MongoRepository,
  Training,
  PaginationResult,
  Duration,
  TrainType,
} from 'src/shared/libs/types';
import { TrainingModel } from './training.model';
import { IndexTrainingsQuery } from 'src/shared/query/index-trainings.query';
import {
  DEFAULT_LIST_REQUEST_COUNT,
  DEFAULT_PAGE_NUMBER,
  DEFAULT_SORT_BY_FIELD,
  DEFAULT_SORT_BY_ORDER,
} from 'src/app.config';

type QueryTrainingsType = {
  rating: number;
  duration: Duration;
  trainType: TrainType;
  trainerId: string;
};

@Injectable()
export class TrainingsRepository extends MongoRepository<
  TrainingEntity,
  Training
> {
  constructor(
    @InjectModel(TrainingModel.name) trainingModel: Model<TrainingModel>,
  ) {
    super(trainingModel, TrainingEntity.fromObject);
  }

  public async findMany(
    {
      page = DEFAULT_PAGE_NUMBER,
      sortByField = DEFAULT_SORT_BY_FIELD,
      sortByOrder = DEFAULT_SORT_BY_ORDER,
      take = DEFAULT_LIST_REQUEST_COUNT,
      ...queryParams
    }: IndexTrainingsQuery,
    trainerId: string,
  ): Promise<PaginationResult<TrainingEntity>> {
    const query: FilterQuery<QueryTrainingsType> = { trainerId };
    if (queryParams.priceFilter) {
      const { priceFilter } = queryParams;
      query.$and = [
        { price: { $gte: Math.min(...priceFilter) } },
        { price: { $lte: Math.max(...priceFilter) } },
      ];
    }
    if (queryParams.caloriesFilter) {
      const { caloriesFilter } = queryParams;
      if (!query.$and) {
        query.$and = [];
      }
      query.$and.push(
        { calories: { $gte: Math.min(...caloriesFilter) } },
        { calories: { $lte: Math.max(...caloriesFilter) } },
      );
    }
    if (queryParams.ratingFilter) {
      query.rating = queryParams.ratingFilter;
    }
    if (queryParams.durationFilter) {
      query.duration = { $in: [...queryParams.durationFilter] };
    }
    if (queryParams.trainTypeFilter) {
      query.trainType = queryParams.trainTypeFilter;
    }
    const skip = (page - DEFAULT_PAGE_NUMBER) * take;
    const orderBy = { [sortByField]: sortByOrder };
    const [trainingsList, totalTrainings] = await Promise.all([
      this.model.find(query).sort(orderBy).skip(skip).limit(take).exec(),
      this.model.countDocuments(query).exec(),
    ]);
    return {
      entities: trainingsList.map((training) =>
        this.createEntityFromDocument(training),
      ),
      currentPage: page,
      totalPages: Math.ceil(totalTrainings / take),
      totalItems: totalTrainings,
    };
  }
}
