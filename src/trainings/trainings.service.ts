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
import { MailService } from 'src/mail/mail.service';
import { UsersService } from 'src/users/users.service';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class TrainingsService {
  constructor(
    private readonly trainingsRepository: TrainingsRepository,
    private readonly accountsRepository: AccountsRepository,
    private readonly mailService: MailService,
    private readonly usersService: UsersService,
    private readonly notificationService: NotificationsService,
  ) {}

  public async createNewTraining(
    dto: CreateTrainingDto,
    trainerId: string,
  ): Promise<TrainingEntity> {
    const newTraining = new TrainingEntity({
      ...dto,
      trainerId,
      rating: 0,
    });
    const subscribersList = await this.usersService.indexSubscribers(trainerId);
    subscribersList.forEach(async ({ id, name, email }) => {
      await this.notificationService.createNewNotification({
        userId: id!,
        description: newTraining.description,
      });
      await this.mailService.sendNotifyNewTraining(
        newTraining.toPOJO(),
        name,
        email,
      );
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
