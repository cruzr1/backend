import { Processor, Process, OnQueueCompleted } from '@nestjs/bull';
import { Job } from 'bull';
import { UsersService } from 'src/users/users.service';
import { MailService } from 'src/mail/mail.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import {
  NotifyStatus,
  JobEntityType,
  Application,
  Status,
} from 'src/shared/libs/types';
import {
  JOB_PROGRESS_COMPLETE,
  JOB_PROGRESS_INITIAL_VALUE,
} from 'src/app.config';
import {
  APPLICATION_ACCEPTED,
  APPLICATION_CREATED,
} from './applications.constant';

@Processor('applications')
export class ApplicationsProcessor {
  constructor(
    private readonly mailService: MailService,
    private readonly usersService: UsersService,
    private readonly notificationsService: NotificationsService,
  ) {}
  @Process()
  async transcode(job: Job<JobEntityType<Application>>): Promise<void> {
    job.progress(JOB_PROGRESS_INITIAL_VALUE);
    const { userId, authorId, status } = job.data;
    const description =
      status === Status.Reviewing
        ? await this.processApplicationCreated(userId, authorId)
        : await this.processApplicationAccepted(authorId);
    const { id: notificationId } =
      await this.notificationsService.createNewNotification({
        userId,
        description,
      });
    job.data.notificationId = notificationId!;
    job.progress(JOB_PROGRESS_COMPLETE);
  }

  private async processApplicationCreated(userId: string, authorId: string) {
    const { name, email } = await this.usersService.getUserEntity(userId);
    const payload = (await this.usersService.getUserEntity(authorId)).toPOJO();
    await this.mailService.sendNotifyApplicationCreated(payload, name, email);
    return APPLICATION_CREATED;
  }

  private async processApplicationAccepted(authorId: string) {
    const { name, email } = await this.usersService.getUserEntity(authorId);
    await this.mailService.sendNotifyApplicationAccepted(name, email);
    return APPLICATION_ACCEPTED;
  }

  @OnQueueCompleted()
  async OnQueueCompleted({
    data: { notificationId },
  }: Job<JobEntityType<JobEntityType<Application>>>) {
    await this.notificationsService.changeNotificationStatus(
      notificationId,
      NotifyStatus.Sent,
    );
  }
}
