import {
  Body,
  Controller,
  Post,
  UseGuards,
  HttpStatus,
  Get,
  Param,
  Patch,
  Req,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import {
  ApiTags,
  ApiResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { ApplicationRdo } from './rdo/application.rdo';
import { fillDTO } from 'src/shared/libs/utils/helpers';
import { CheckAuthGuard } from 'src/shared/guards/check-auth.guard';
import { RoleGuard } from 'src/shared/guards/check-role.guard';
import { UserRole, RequestWithTokenPayload } from 'src/shared/libs/types';
import { MongoIdValidationPipe } from 'src/shared/pipes/mongo-id-validation.pipe';
import { UpdateApplicationDto } from './dto/update-application.dto';

@ApiBearerAuth()
@ApiTags('Сервис заявок на персональные тренировки')
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @ApiOperation({
    description: 'Создание заявки на персональную/совместную тренировки',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The new application has been created.',
  })
  @ApiParam({
    name: 'userId',
    description: 'Id пользователя, с кем проводится тренировка',
  })
  @UseGuards(CheckAuthGuard)
  @UseGuards(RoleGuard(UserRole.User))
  @Post(':userId')
  public async create(
    @Param('userId', MongoIdValidationPipe) userId: string,
    @Req() { user: { sub: authorId } }: RequestWithTokenPayload,
    @Body('trainingId', MongoIdValidationPipe) trainingId: string,
  ): Promise<ApplicationRdo> {
    const newApplication = await this.applicationsService.createNewApplication({
      authorId: authorId!,
      userId,
      trainingId,
    });
    return fillDTO(ApplicationRdo, newApplication.toPOJO());
  }

  @ApiOperation({ description: 'Изменение статуса заявки' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The application has been updated.',
  })
  @ApiParam({
    name: 'applicationId',
    description: 'Id заявки',
  })
  @UseGuards(CheckAuthGuard)
  @Patch(':applicationId')
  public async updateApplication(
    @Param('applicationId', MongoIdValidationPipe) applicationId: string,
    @Body() dto: UpdateApplicationDto,
  ): Promise<ApplicationRdo> {
    const updatedApplication =
      await this.applicationsService.changeApplicationStatus(
        applicationId,
        dto,
      );
    return fillDTO(ApplicationRdo, updatedApplication?.toPOJO());
  }

  @ApiOperation({ description: 'Детальная информация о заявке' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The application details have been provided.',
  })
  @ApiParam({
    name: 'applicationId',
    description: 'Id заявки',
  })
  @UseGuards(CheckAuthGuard)
  @Get(':applicationId')
  public async show(
    @Param('applicationId', MongoIdValidationPipe) applicationId: string,
  ): Promise<ApplicationRdo> {
    const existApplication =
      await this.applicationsService.getApplicationEntity(applicationId);
    return fillDTO(ApplicationRdo, existApplication.toPOJO());
  }
}
