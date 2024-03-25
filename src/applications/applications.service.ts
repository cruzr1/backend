import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ApplicationEntity } from './application.entity';
import { ApplicationsRepository } from './applications.repository';
import { Status } from 'src/shared/libs/types';
import { UpdateApplicationDto } from './dto/update-application.dto';
import {
  APPLICATION_NOT_FOUND,
  APPLICATION_ALREADY_ACCEPTED,
} from './applications.constant';
import { AccountsService } from 'src/accounts/accounts.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { CreateApplicationDto } from './dto/create-application.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly applicationsRepository: ApplicationsRepository,
    private readonly accountsService: AccountsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  public async createNewApplication({
    authorId,
    userId,
  }: CreateApplicationDto): Promise<ApplicationEntity> {
    const newApplication = new ApplicationEntity({
      userId,
      authorId,
      status: Status.Reviewing,
    });
    await this.notificationsService.createNewApplicationNotification({
      authorId,
      userId,
    });
    return await this.applicationsRepository.save(newApplication);
  }

  public async getApplicationEntity(
    applicationId: string,
  ): Promise<ApplicationEntity> {
    const existApplication =
      await this.applicationsRepository.findById(applicationId);
    if (!existApplication) {
      throw new NotFoundException(APPLICATION_NOT_FOUND);
    }
    return existApplication;
  }

  public async changeApplicationStatus(
    applicationId: string,
    dto: UpdateApplicationDto,
  ): Promise<ApplicationEntity | null> {
    const existApplication = await this.getApplicationEntity(applicationId);
    if (existApplication.status === dto.status) {
      throw new BadRequestException(APPLICATION_ALREADY_ACCEPTED);
    }
    const updatedApplication = new ApplicationEntity({
      ...existApplication,
      ...dto,
    });
    if (dto.status === Status.Accepted) {
      this.accountsService.useActiveTrainings(existApplication.authorId, {
        trainingsCount: 1,
      });
      await this.notificationsService.createNewApplicationAcceptedNotification(
        updatedApplication.authorId,
      );
      return await this.applicationsRepository.update(
        applicationId,
        updatedApplication,
      );
    }
    return existApplication;
  }
}
