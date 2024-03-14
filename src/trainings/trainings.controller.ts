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
} from '@nestjs/common';
import { TrainingsService } from './trainings.service';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
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
import { UpdateTrainingDto } from './dto/update-training.dto';
import { IndexTrainingsQuery } from 'src/shared/query/index-trainings.query';

@ApiTags('controllers')
@Controller('trainings')
export class TrainingsController {
  constructor(private readonly trainingsService: TrainingsService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The following trainings have been found.',
  })
  @UseGuards(CheckAuthGuard)
  @UseGuards(RoleGuard(UserRole.Trainer))
  @Get('/')
  public async index(
    @Req() { user: { sub } }: RequestWithTokenPayload,
    @Query() query?: IndexTrainingsQuery,
  ): Promise<EntitiesWithPaginationRdo<TrainingRdo>> {
    const trainingsWithPagination = await this.trainingsService.indexTrainings(
      sub!,
      query,
    );
    return {
      ...trainingsWithPagination,
      entities: trainingsWithPagination.entities.map((training) =>
        fillDTO(TrainingRdo, training.toPOJO()),
      ),
    };
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The new training has been created.',
  })
  @UseGuards(CheckAuthGuard)
  @UseGuards(RoleGuard(UserRole.Trainer))
  @Post('/')
  public async create(@Body() dto: CreateTrainingDto): Promise<TrainingRdo> {
    const newTraining = await this.trainingsService.createNewTraining(dto);
    return fillDTO(TrainingRdo, newTraining.toPOJO());
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The training has been updated.',
  })
  @UseGuards(CheckAuthGuard)
  @UseGuards(RoleGuard(UserRole.Trainer))
  @Patch(':trainingId')
  public async updateTraining(
    @Param('trainingId', MongoIdValidationPipe) trainingId: string,
    @Req() { user: { sub } }: RequestWithTokenPayload,
    @Body() dto: UpdateTrainingDto,
  ): Promise<TrainingRdo> {
    const updatedTraining = await this.trainingsService.updateTraining(
      trainingId,
      dto,
      sub!,
    );
    return fillDTO(TrainingRdo, updatedTraining?.toPOJO());
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The training details have been provided.',
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
