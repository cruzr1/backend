import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateTrainingDto } from './dto/create-training.dto';
import { UpdateTrainingDto } from './dto/update-training.dto';
import { TrainingEntity } from './training.entity';
import { TrainingsRepository } from './trainings.repository';
import {
  TRAINER_NOT_AUTHORIZED,
  TRAINING_NOT_FOUND,
} from './trainings.constant';
import { PaginationResult } from 'src/shared/libs/types';
import { IndexTrainingsQuery } from 'src/shared/query/index-trainings.query';

export class TrainingsService {
  constructor(private readonly trainingsRepository: TrainingsRepository) {}

  public async createNewTraining(
    dto: CreateTrainingDto,
  ): Promise<TrainingEntity> {
    const newTraining = new TrainingEntity({ ...dto, rating: 0 });
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
    query: IndexTrainingsQuery | undefined,
  ): Promise<PaginationResult<TrainingEntity>> {
    return await this.trainingsRepository.findMany(query ?? {}, trainerId);
  }
}
