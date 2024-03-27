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
  ParseArrayPipe,
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
  RequestWithTokenPayload,
  EntitiesWithPaginationRdo,
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
    @Req() { user: { sub } }: RequestWithTokenPayload,
    @Query('priceFilter', new ParseArrayPipe({ items: Number }))
    priceFilter: number[],
    @Query() query?: IndexTrainingsQuery,
  ): Promise<EntitiesWithPaginationRdo<TrainingRdo>> {
    const trainingsWithPagination = await this.trainingsService.indexTrainings(
      sub!,
      { ...query, priceFilter },
    );
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
  @UseGuards(CheckAuthGuard)
  @UseGuards(RoleGuard(UserRole.Trainer))
  @Get('myOrders')
  public async indexOrders(
    @Req() { user: { sub } }: RequestWithTokenPayload,
    @Query() query?: IndexAccountsQuery,
  ): Promise<TrainingsOrderedRdo[]> {
    const trainingsOrdered = await this.trainingsService.indexOrderedTrainings(
      sub!,
      query ?? {},
    );
    return trainingsOrdered.map<TrainingsOrderedRdo>(
      ({ training, trainingsOrderedCount, trainingsOrderedSum }) =>
        fillDTO(TrainingsOrderedRdo, {
          trainings: fillDTO(TrainingRdo, training.toPOJO()),
          trainingsCount: trainingsOrderedCount,
          trainingsSum: trainingsOrderedSum,
        }),
    );
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
    @Req() { user: { sub } }: RequestWithTokenPayload,
  ): Promise<TrainingRdo> {
    const newTraining = await this.trainingsService.createNewTraining(
      dto,
      sub!,
    );
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
    @Req() { user: { sub } }: RequestWithTokenPayload,
    @Body() dto: UpdatePartialTrainingDto,
  ): Promise<TrainingRdo> {
    const updatedTraining = await this.trainingsService.updateTraining(
      trainingId,
      dto,
      sub!,
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
