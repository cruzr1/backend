import { Process, Processor, OnQueueCompleted } from '@nestjs/bull';
import { Job } from 'bull';
import {
  JOB_PROGRESS_INITIAL_VALUE,
  JOB_PROGRESS_COMPLETE,
} from 'src/app.config';
import { JobEntityType, User, NotifyStatus } from 'src/shared/libs/types';
import { UsersService, UsersJobType } from 'src/users/users.service';
import { MailService } from 'src/mail/mail.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { ADD_FRIEND, REMOVE_FRIEND } from './users.constant';

@Processor('users')
export class UsersProcessor {
  constructor(
    private readonly mailService: MailService,
    private readonly usersService: UsersService,
    private readonly notificationsService: NotificationsService,
  ) {}
  @Process()
  async transcode(job: Job<JobEntityType<UsersJobType>>): Promise<void> {
    job.progress(JOB_PROGRESS_INITIAL_VALUE);
    const { userId, friendId, addFriend, userName } = job.data;
    const { name, email } = await this.usersService.getUserEntity(friendId);
    const description = addFriend ? ADD_FRIEND : REMOVE_FRIEND;
    await this.notificationsService.createNewNotification({
      userId,
      description,
    });
    if (addFriend) {
      await this.mailService.sendNotifyAddedToFriends(name, email, userName);
    }
    job.progress(JOB_PROGRESS_COMPLETE);
  }

  @OnQueueCompleted()
  async OnQueueCompleted({
    data: { notificationId },
  }: Job<JobEntityType<User>>) {
    await this.notificationsService.changeNotificationStatus(
      notificationId,
      NotifyStatus.Sent,
    );
  }
}
