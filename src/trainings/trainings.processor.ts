import { Processor, Process, OnQueueCompleted } from '@nestjs/bull';
import { Job } from 'bull';
import { MailService } from 'src/mail/mail.service';
import { UsersService } from 'src/users/users.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotifyStatus, JobEntityType, Training } from 'src/shared/libs/types';

const JOB_PROGRESS_COMPLETE = 100;
const JOB_PROGRESS_INITIAL_VALUE = 0;

@Processor('trainings')
export class TrainingsProcessor {
  constructor(
    private readonly mailService: MailService,
    private readonly usersService: UsersService,
    private readonly notificaitonsService: NotificationsService,
  ) {}
  @Process()
  async transcode(job: Job<JobEntityType<Training>>): Promise<void> {
    job.progress(JOB_PROGRESS_INITIAL_VALUE);
    const subscribersList = await this.usersService.indexSubscribers(
      job.data.trainerId,
    );
    subscribersList.forEach(async ({ id, name: userName, email }) => {
      const { id: notificationId } =
        await this.notificaitonsService.createNewNotification({
          userId: id!,
          description: job.data.description,
        });
      job.data.notificationId = notificationId!;
      await this.mailService.sendNotifyNewTraining(job.data, userName, email);
      job.progress(JOB_PROGRESS_COMPLETE);
    });
  }

  @OnQueueCompleted()
  async OnQueueCompleted({
    data: { notificationId },
  }: Job<JobEntityType<Training>>) {
    await this.notificaitonsService.changeNotificationStatus(
      notificationId,
      NotifyStatus.Sent,
    );
  }
}
