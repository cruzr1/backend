import { Processor, Process, OnQueueCompleted } from '@nestjs/bull';
import { Job } from 'bull';
import { MailService } from 'src/mail/mail.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationEntity } from './notification.entity';
import { NotifyStatus } from 'src/shared/libs/types';
import { Injectable } from '@nestjs/common';

const JOB_PROGRESS_COMPLETE = 100;
const JOB_PROGRESS_INITIAL_VALUE = 0;

@Injectable()
@Processor('notifications')
export class NotificationsProcessor {
  constructor(
    private readonly mailService: MailService,
    private readonly notificaitonsService: NotificationsService,
  ) {}
  @Process()
  async transcode(job: Job<NotificationEntity>): Promise<void> {
    job.progress(JOB_PROGRESS_INITIAL_VALUE);
    const {
      data: { payload },
    } = job;
    await this.mailService.sendNotification(payload);
    job.progress(JOB_PROGRESS_COMPLETE);
  }

  @OnQueueCompleted()
  async OnQueueCompleted({ data: { id } }: Job<NotificationEntity>) {
    await this.notificaitonsService.changeNotificationStatus(
      id!,
      NotifyStatus.Sent,
    );
  }
}
