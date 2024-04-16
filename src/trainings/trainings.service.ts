import {
  NotFoundException,
  UnauthorizedException,
  Injectable,
} from '@nestjs/common';
import { CreateTrainingDto } from './dto/create-training.dto';
import { TrainingEntity } from './training.entity';
import { TrainingsRepository } from './trainings.repository';
import {
  TRAINER_NOT_AUTHORIZED,
  TRAINING_NOT_FOUND,
} from './trainings.constant';
import {
  PaginationResult,
  TrainingOrdered,
  TrainingOrderedAggregated,
  UserRole,
} from 'src/shared/libs/types';
import { IndexTrainingsQuery } from 'src/shared/query/index-trainings.query';
import { IndexAccountsQuery } from 'src/shared/query';
import { NotificationsService } from 'src/notifications/notifications.service';
import { UsersService } from 'src/users/users.service';
import { INITIAL_RATING } from './trainings.constant';
import { generateTrainingEntities } from 'src/shared/libs/utils/database/generate-training';
import { UpdatePartialTrainingDto } from './dto/update-partial-training.dto';
import { OrdersRepository } from 'src/orders/orders.repository';

@Injectable()
export class TrainingsService {
  constructor(
    private readonly trainingsRepository: TrainingsRepository,
    private readonly ordersRepository: OrdersRepository,
    private readonly notificationsService: NotificationsService,
    private readonly usersService: UsersService,
  ) {}

  public async createNewTraining(
    dto: CreateTrainingDto,
    trainerId: string,
  ): Promise<TrainingEntity> {
    const newTraining = new TrainingEntity({
      ...dto,
      trainerId,
      rating: INITIAL_RATING,
    });
    await this.notificationsService.createNewTrainingNotification(
      newTraining.toPOJO(),
    );
    return await this.trainingsRepository.save(newTraining);
  }

  public async seedTrainingsDatabase(count: number): Promise<void> {
    const trainersList = await this.usersService.getUsersList(UserRole.Trainer);
    const trainingsEntities = generateTrainingEntities(count, trainersList);
    await this.trainingsRepository.insertManyTrainings(trainingsEntities);
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
    dto: UpdatePartialTrainingDto,
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
    userId?: string,
    query?: IndexTrainingsQuery | undefined,
  ): Promise<PaginationResult<TrainingEntity>> {
    const { role } = await this.usersService.getUserEntity(userId!);
    const trainerId = role === UserRole.Trainer ? userId : undefined;
    return await this.trainingsRepository.findMany(query ?? {}, trainerId);
  }

  public async indexTrainerTrainings(
    trainerId: string,
    query?: IndexTrainingsQuery | undefined,
  ): Promise<PaginationResult<TrainingEntity>> {
    return await this.trainingsRepository.findMany(query ?? {}, trainerId);
  }

  public async indexOrderedTrainings(
    trainerId: string,
    query: IndexAccountsQuery,
  ): Promise<TrainingOrdered[]> {
    const { entities: trainings } = await this.trainingsRepository.findMany(
      {},
      trainerId,
    );
    const trainingIds = trainings.map<string>(
      (training) => training.id as string,
    );
    const trainingsOrderedAggregated: TrainingOrderedAggregated[] =
      await this.ordersRepository.findMany(trainingIds);
    const findTrainingById = (
      id: string,
      trainings: TrainingEntity[],
    ): TrainingEntity =>
      trainings.find((training) => training.id! === id) as TrainingEntity;
    const { sortByField, sortByOrder } = query;
    const trainingsOrdered: TrainingOrdered[] = trainingsOrderedAggregated.map(
      ({ _id, trainingsCount, trainingSum }) => {
        const training: TrainingEntity = findTrainingById(_id, trainings);
        return {
          training,
          trainingsOrderedCount: trainingsCount,
          trainingsOrderedSum: trainingSum,
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

  public async getTrainingsList(): Promise<TrainingEntity[]> {
    return await this.trainingsRepository.find();
  }
}
