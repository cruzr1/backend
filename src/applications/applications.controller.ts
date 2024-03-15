import {
  Body,
  Controller,
  Post,
  UseGuards,
  HttpStatus,
  Get,
  Param,
  Patch,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ApplicationRdo } from './rdo/application.rdo';
import { fillDTO } from 'src/shared/libs/utils/helpers';
import { CheckAuthGuard } from 'src/shared/guards/check-auth.guard';
import { RoleGuard } from 'src/shared/guards/check-role.guard';
import { UserRole } from 'src/shared/libs/types';
import { MongoIdValidationPipe } from 'src/shared/pipes/mongo-id-validation.pipe';
import { UpdateApplicationDto } from './dto/update-application.dto';

@ApiTags('applications')
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The new application has been created.',
  })
  @UseGuards(CheckAuthGuard)
  @UseGuards(RoleGuard(UserRole.User))
  @Post('/')
  public async create(
    @Body() dto: CreateApplicationDto,
  ): Promise<ApplicationRdo> {
    const newApplication =
      await this.applicationsService.createNewApplication(dto);
    return fillDTO(ApplicationRdo, newApplication.toPOJO());
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The application has been updated.',
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

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The application details have been provided.',
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
