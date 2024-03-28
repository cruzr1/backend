import { Processor, Process, OnQueueCompleted } from '@nestjs/bull';
import { Job } from 'bull';
import { MailService } from 'src/mail/mail.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationEntity } from './notification.entity';
import { NotifyStatus } from 'src/shared/libs/types';
import { Injectable, Logger } from '@nestjs/common';
import { NOTIFICATIONS_QUEUE } from './notifications.constant';

const JOB_PROGRESS_COMPLETE = 100;
const JOB_PROGRESS_INITIAL_VALUE = 0;

@Injectable()
@Processor(NOTIFICATIONS_QUEUE)
export class NotificationsProcessor {
  private readonly logger = new Logger(NotificationsProcessor.name);

  constructor(
    private readonly mailService: MailService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Process()
  async transcode(job: Job<NotificationEntity>): Promise<void> {
    await job.progress(JOB_PROGRESS_INITIAL_VALUE);
    this.logger.log(`Processing job : ${job.id}`);
    const {
      data: { payload },
    } = job;
    await this.mailService.sendNotification(payload);
    await job.progress(JOB_PROGRESS_COMPLETE);
    this.logger.log(`Processing completed for job : ${job.id}`);
  }

  @OnQueueCompleted()
  async OnQueueCompleted({ data: { id } }: Job<NotificationEntity>) {
    await this.notificationsService.changeNotificationStatus(
      id!,
      NotifyStatus.Sent,
    );
  }
}
