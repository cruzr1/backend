import { NotFoundException } from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ApplicationEntity } from './application.entity';
import { ApplicationsRepository } from './applications.repository';
import { Application, JobEntityType, Status } from 'src/shared/libs/types';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { APPLICATION_NOT_FOUND } from './applications.constant';
import { AccountsService } from 'src/accounts/accounts.service';

export class ApplicationsService {
  constructor(
    private readonly applicationsRepository: ApplicationsRepository,
    private readonly accountsService: AccountsService,
    @InjectQueue('applications')
    private applicationsQueue: Queue<JobEntityType<Application>>,
  ) {}

  public async createNewApplication(
    dto: CreateApplicationDto,
  ): Promise<ApplicationEntity> {
    const newApplication = new ApplicationEntity({
      ...dto,
      status: Status.Reviewing,
    });
    const newApplicationJob: JobEntityType<Application> = {
      ...newApplication.toPOJO(),
      notificationId: '',
    };
    await this.applicationsQueue.add(newApplicationJob, {
      removeOnComplete: true,
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
      return existApplication;
    }
    const updatedApplication = new ApplicationEntity({
      ...existApplication,
      ...dto,
    });
    if (dto.status === Status.Accepted) {
      this.accountsService.useActiveTrainings(existApplication.authorId, {
        trainingsCount: 1,
      });
      const newApplicationJob: JobEntityType<Application> = {
        ...updatedApplication.toPOJO(),
        notificationId: '',
      };
      await this.applicationsQueue.add(newApplicationJob, {
        removeOnComplete: true,
      });
    }
    return await this.applicationsRepository.update(
      applicationId,
      updatedApplication,
    );
  }
}
