import {
  NotFoundException,
  UnauthorizedException,
  Injectable,
} from '@nestjs/common';
import { CreateTrainingDto } from './dto/create-training.dto';
import { UpdateTrainingDto } from './dto/update-training.dto';
import { TrainingEntity } from './training.entity';
import { TrainingsRepository } from './trainings.repository';
import {
  TRAINER_NOT_AUTHORIZED,
  TRAINING_NOT_FOUND,
} from './trainings.constant';
import {
  PaginationResult,
  TrainingAggregated,
  TrainingOrdered,
} from 'src/shared/libs/types';
import { IndexTrainingsQuery } from 'src/shared/query/index-trainings.query';
import { AccountsRepository } from 'src/accounts/accounts.repository';
import { IndexAccountsQuery } from 'src/shared/query';

@Injectable()
export class TrainingsService {
  constructor(
    private readonly trainingsRepository: TrainingsRepository,
    private readonly accountsRepository: AccountsRepository,
  ) {}

  public async createNewTraining(
    dto: CreateTrainingDto,
    trainerId?: string,
  ): Promise<TrainingEntity> {
    const newTraining = new TrainingEntity({
      ...dto,
      trainerId: trainerId ?? '',
      rating: 0,
    });
    return await this.trainingsRepository.save(newTraining);
  }

  public async getTrainingEntity(trainingId: string): Promise<TrainingEntity> {
    const existTraining = await this.trainingsRepository.findById(trainingId);
    if (!existTraining) {
      throw new NotFoundException(TRAINING_NOT_FOUND);
    }
    return existTraining;
  }

  public async updateTraining(
    trainingId: string,
    dto: UpdateTrainingDto,
    trainerId: string,
  ): Promise<TrainingEntity | null> {
    const existTraining = await this.getTrainingEntity(trainingId);
    if (existTraining.trainerId !== trainerId) {
      throw new UnauthorizedException(TRAINER_NOT_AUTHORIZED);
    }
    const updatedTraining = new TrainingEntity({ ...existTraining, ...dto });
    return await this.trainingsRepository.update(trainingId, updatedTraining);
  }

  public async indexTrainings(
    trainerId: string,
    query?: IndexTrainingsQuery | undefined,
  ): Promise<PaginationResult<TrainingEntity>> {
    return await this.trainingsRepository.findMany(query ?? {}, trainerId);
  }

  public async indexOrderedTrainings(
    trainerId: string,
    query: IndexAccountsQuery,
  ): Promise<TrainingOrdered[]> {
    const { entities: trainings } = await this.indexTrainings(trainerId);
    const trainingIds = trainings.map<string>(
      (training) => training.id as string,
    );
    const trainingsAggregated: TrainingAggregated[] =
      await this.accountsRepository.findMany(trainingIds);
    const findTrainingById = (
      id: string,
      trainings: TrainingEntity[],
    ): TrainingEntity =>
      trainings.find((training) => training.id! === id) as TrainingEntity;
    const { sortByField, sortByOrder } = query;
    const trainingsOrdered: TrainingOrdered[] = trainingsAggregated.map(
      ({ _id, trainingsActive }) => {
        const training: TrainingEntity = findTrainingById(_id, trainings);
        return {
          training,
          trainingsOrderedCount: trainingsActive,
          trainingsOrderedSum: trainingsActive * training!.price,
        };
      },
    );
    if (sortByField && sortByOrder) {
      trainingsOrdered.sort(
        (firstTraining, secondTraining) =>
          (firstTraining[sortByField] - secondTraining[sortByField]) *
          sortByOrder,
      );
    }
    return trainingsOrdered;
  }
}
