import {
  Body,
  Controller,
  Post,
  UseGuards,
  HttpStatus,
  Patch,
  Param,
  Req,
  Get,
  Query,
  ParseBoolPipe,
} from '@nestjs/common';
import { TrainingsService } from './trainings.service';
import {
  ApiTags,
  ApiResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { CreateTrainingDto } from './dto/create-training.dto';
import { TrainingRdo } from './rdo/training.rdo';
import { fillDTO } from 'src/shared/libs/utils/helpers';
import { CheckAuthGuard } from 'src/shared/guards/check-auth.guard';
import { RoleGuard } from 'src/shared/guards/check-role.guard';
import {
  UserRole,
  EntitiesWithPaginationRdo,
  RequestWithUser,
} from 'src/shared/libs/types';
import { MongoIdValidationPipe } from 'src/shared/pipes/mongo-id-validation.pipe';
import { TrainingsOrderedRdo } from './rdo/trainings-ordered.rdo';
import { IndexAccountsQuery, IndexTrainingsQuery } from 'src/shared/query';
import { UpdatePartialTrainingDto } from './dto/update-partial-training.dto';

@ApiBearerAuth()
@ApiTags('Сервис тренировок')
@Controller('trainings')
export class TrainingsController {
  constructor(private readonly trainingsService: TrainingsService) {}

  @ApiOperation({ description: 'Список тренировок' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The following trainings have been found.',
  })
  @UseGuards(CheckAuthGuard)
  @Get('/')
  public async index(
    @Req() { user: { id } }: RequestWithUser,
    @Query() query?: IndexTrainingsQuery,
  ): Promise<EntitiesWithPaginationRdo<TrainingRdo>> {
    const trainingsWithPagination = await this.trainingsService.indexTrainings(
      id!,
      { ...query },
    );
    return {
      ...trainingsWithPagination,
      entities: trainingsWithPagination.entities.map((training) =>
        fillDTO(TrainingRdo, training.toPOJO()),
      ),
    };
  }

  @ApiOperation({ description: 'Список тренировок определенного тренера' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The following trainings have been found.',
  })
  @UseGuards(CheckAuthGuard)
  @Get('trainer/:trainerId')
  public async indexTrainings(
    @Param('trainerId', MongoIdValidationPipe) trainerId: string,
    @Query() query?: IndexTrainingsQuery,
  ): Promise<EntitiesWithPaginationRdo<TrainingRdo>> {
    const trainingsWithPagination =
      await this.trainingsService.indexTrainerTrainings(trainerId!, {
        ...query,
      });
    return {
      ...trainingsWithPagination,
      entities: trainingsWithPagination.entities.map((training) =>
        fillDTO(TrainingRdo, training.toPOJO()),
      ),
    };
  }

  @ApiOperation({ description: 'Мои заказы' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The following ordered trainings have been found.',
  })
  @UseGuards(RoleGuard(UserRole.Trainer))
  @UseGuards(CheckAuthGuard)
  @Get('myOrders')
  public async indexOrders(
    @Req() { user: { id } }: RequestWithUser,
    @Query() query?: IndexAccountsQuery,
  ): Promise<EntitiesWithPaginationRdo<TrainingsOrderedRdo>> {
    const trainingsWithPagination =
      await this.trainingsService.indexOrderedTrainings(id!, query ?? {});
    return {
      ...trainingsWithPagination,
      entities: trainingsWithPagination.entities.map<TrainingsOrderedRdo>(
        ({ training, trainingsOrderedCount, trainingsOrderedSum }) =>
          fillDTO(TrainingsOrderedRdo, {
            training: fillDTO(TrainingRdo, training.toPOJO()),
            trainingsCount: trainingsOrderedCount,
            trainingsSum: trainingsOrderedSum,
          }),
      ),
    };
  }

  @ApiOperation({ description: 'Мои покупки' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The following purchase trainings have been found.',
  })
  @UseGuards(RoleGuard(UserRole.User))
  @UseGuards(CheckAuthGuard)
  @Get('myPurchsases')
  public async indexPurchases(
    @Req() { user: { id } }: RequestWithUser,
    @Query() query?: IndexAccountsQuery,
    @Query('isActiveTrainings', new ParseBoolPipe())
    isActiveTrainings?: boolean,
  ): Promise<EntitiesWithPaginationRdo<TrainingRdo>> {
    const trainingsWithPagination =
      await this.trainingsService.indexPurchasedTrainings(
        id!,
        { ...query, isActiveTrainings } ?? {},
      );
    return {
      ...trainingsWithPagination,
      entities: trainingsWithPagination.entities.map<TrainingRdo>((training) =>
        fillDTO(TrainingRdo, training.toPOJO()),
      ),
    };
  }

  @ApiOperation({ description: 'Заполнить базу данных начальными значениями' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The training data have been seeded.',
  })
  @ApiParam({
    name: 'count',
    description: 'Количество записей',
  })
  @Get('seed/:count')
  public async seedDatabase(@Param('count') count: number): Promise<void> {
    await this.trainingsService.seedTrainingsDatabase(count);
  }

  @ApiOperation({ description: 'Создание тренировки' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The new training has been created.',
  })
  @UseGuards(CheckAuthGuard)
  @UseGuards(RoleGuard(UserRole.Trainer))
  @Post('/')
  public async create(
    @Body() dto: CreateTrainingDto,
    @Req() { user: { id } }: RequestWithUser,
  ): Promise<TrainingRdo> {
    const newTraining = await this.trainingsService.createNewTraining(dto, id!);
    return fillDTO(TrainingRdo, newTraining.toPOJO());
  }

  @ApiOperation({ description: 'Редактирование тренировки' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The training has been updated.',
  })
  @ApiParam({
    name: 'trainingId',
    description: 'Id тренировки',
  })
  @UseGuards(CheckAuthGuard)
  @UseGuards(RoleGuard(UserRole.Trainer))
  @Patch(':trainingId')
  public async UpdateTrainingDto(
    @Param('trainingId', MongoIdValidationPipe) trainingId: string,
    @Req() { user: { id } }: RequestWithUser,
    @Body() dto: UpdatePartialTrainingDto,
  ): Promise<TrainingRdo> {
    const updatedTraining = await this.trainingsService.updateTraining(
      trainingId,
      dto,
      id!,
    );
    return fillDTO(TrainingRdo, updatedTraining?.toPOJO());
  }

  @ApiOperation({ description: 'Детальная информация о тренировке' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The training details have been provided.',
  })
  @ApiParam({
    name: 'trainingId',
    description: 'Id тренировки',
  })
  @UseGuards(CheckAuthGuard)
  @Get(':trainingId')
  public async show(
    @Param('trainingId', MongoIdValidationPipe) trainingId: string,
  ): Promise<TrainingRdo> {
    const existTraining =
      await this.trainingsService.getTrainingEntity(trainingId);
    return fillDTO(TrainingRdo, existTraining.toPOJO());
  }
}
