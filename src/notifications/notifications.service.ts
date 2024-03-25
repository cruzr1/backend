import {
  ForbiddenException,
  NotFoundException,
  Injectable,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { NotificationEntity } from './notification.entity';
import { NotificationsRepository } from './notifications.repository';
import { UsersService } from 'src/users/users.service';
import { CreateApplicationDto } from 'src/applications/dto/create-application.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import {
  NOTIFICATION_NOT_FOUND,
  USER_FORBIDDEN,
  NEW_TRAINING_SUBJECT,
  NEW_TRAINING_TEMPLATE_PATH,
  ADDED_TO_FRIENDS_SUBJECT,
  ADDED_TO_FRIENDS_TEMPLATE_PATH,
  APPLICATION_ACCEPTED_SUBJECT,
  APPLICATION_ACCEPTED_TEMPLATE_PATH,
  APPLICATION_CREATED_SUBJECT,
  APPLICATION_CREATED_TEMPLATE_PATH,
  NOTIFICATIONS_QUEUE,
} from './notifications.constant';
import {
  NotificationPayloadType,
  NotifyStatus,
  Training,
} from 'src/shared/libs/types';

@Injectable()
export class NotificationsService {
  [x: string]: any;
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @InjectQueue(NOTIFICATIONS_QUEUE)
    private readonly notificationsQueue: Queue<NotificationEntity>,
  ) {}

  public async createNewTrainingNotification(
    training: Training,
  ): Promise<void> {
    const {
      name: trainingName,
      level,
      trainType,
      duration,
      price,
      calories,
      description,
      gender,
      rating,
      trainerId,
      isSpecial,
      videoURL,
    } = training;
    const [{ name: trainerName }, subscribersList] = await Promise.all([
      this.usersService.getUserEntity(trainerId),
      this.usersService.indexSubscribers(training.trainerId),
    ]);
    subscribersList.forEach(async ({ name: userName, email }) => {
      const payload: NotificationPayloadType = {
        to: email,
        subject: NEW_TRAINING_SUBJECT,
        template: NEW_TRAINING_TEMPLATE_PATH,
        context: {
          name: `${trainingName}`,
          level: `${level}`,
          trainType: `${trainType}`,
          duration: `${duration}`,
          price: `${price}`,
          description: `${description}`,
          calories: `${calories}`,
          gender: `${gender}`,
          rating: `${rating}`,
          trainerName: `${trainerName}`,
          isSpecial: `${isSpecial}`,
          videoURL: `${videoURL}`,
          userName: `${userName}`,
        },
      };
      const newNotification = new NotificationEntity({
        userId: trainerId,
        description,
        notifyStatus: NotifyStatus.Created,
        payload,
      });
      await this.notificationsRepository.save(newNotification);
    });
  }

  public async createNewFriendNotification(
    friendId: string,
    userId: string,
    userName: string,
  ): Promise<void> {
    const { name: friendName, email } =
      await this.usersService.getUserEntity(friendId);
    const payload: NotificationPayloadType = {
      to: email,
      subject: ADDED_TO_FRIENDS_SUBJECT,
      template: ADDED_TO_FRIENDS_TEMPLATE_PATH,
      context: {
        name: `${friendName}`,
        userName: `${userName}`,
      },
    };
    const newNotification = new NotificationEntity({
      userId,
      description: ADDED_TO_FRIENDS_SUBJECT,
      notifyStatus: NotifyStatus.Created,
      payload,
    });
    await this.notificationsRepository.save(newNotification);
  }

  public async createNewApplicationNotification({
    userId,
    authorId,
  }: CreateApplicationDto): Promise<void> {
    const { name, email } = await this.usersService.getUserEntity(userId);
    const {
      name: authorName,
      description,
      level,
      trainType,
      duration,
      caloriesTarget,
      caloriesDaily,
    } = await this.usersService.getUserEntity(authorId);
    const payload: NotificationPayloadType = {
      to: email,
      subject: APPLICATION_CREATED_SUBJECT,
      template: APPLICATION_CREATED_TEMPLATE_PATH,
      context: {
        name: `${name}`,
        authorName: `${authorName}`,
        description: `${description}`,
        level: `${level}`,
        trainType: `${trainType}`,
        duration: `${duration}`,
        caloriesTarget: `${caloriesTarget}`,
        caloriesDaily: `${caloriesDaily}`,
      },
    };
    const newNotification = new NotificationEntity({
      userId: authorId,
      description: APPLICATION_CREATED_SUBJECT,
      notifyStatus: NotifyStatus.Created,
      payload,
    });
    await this.notificationsRepository.save(newNotification);
  }

  public async createNewApplicationAcceptedNotification(
    authorId: string,
  ): Promise<void> {
    const { name, email } = await this.usersService.getUserEntity(authorId);
    const payload: NotificationPayloadType = {
      to: email,
      subject: APPLICATION_ACCEPTED_SUBJECT,
      template: APPLICATION_ACCEPTED_TEMPLATE_PATH,
      context: {
        name: `${name}`,
      },
    };
    const newNotification = new NotificationEntity({
      userId: authorId,
      description: APPLICATION_ACCEPTED_SUBJECT,
      notifyStatus: NotifyStatus.Created,
      payload,
    });
    await this.notificationsRepository.save(newNotification);
  }

  public async getNotificationEntity(
    notificationId: string,
  ): Promise<NotificationEntity> {
    const existNotification =
      await this.notificationsRepository.findById(notificationId);
    if (!existNotification) {
      throw new NotFoundException(NOTIFICATION_NOT_FOUND);
    }
    return existNotification;
  }

  public async deleteNotification(
    notificationId: string,
    userId: string,
  ): Promise<void> {
    const existNotification = await this.getNotificationEntity(notificationId);
    if (existNotification.userId !== userId) {
      throw new ForbiddenException(USER_FORBIDDEN);
    }
    await this.notificationsRepository.deleteById(notificationId);
  }

  public async indexNotificaitons(
    userId: string,
  ): Promise<NotificationEntity[]> {
    return await this.notificationsRepository.findMany(userId);
  }

  public async changeNotificationStatus(
    notificationId: string,
    notifyStatus: NotifyStatus,
  ): Promise<NotificationEntity | null> {
    const existNotification = await this.getNotificationEntity(notificationId);
    const updatedNotificaiton = new NotificationEntity({
      ...existNotification,
      notifyStatus,
      notifyDate: new Date(),
    });
    return await this.notificationsRepository.update(
      notificationId,
      updatedNotificaiton,
    );
  }

  public async sendNotifications(): Promise<void> {
    const notifications =
      await this.notificationsRepository.findCreatedNotifications();
    notifications.forEach(async (notification) => {
      await this.notificationsQueue.add(notification, {
        removeOnComplete: true,
      });
    });
  }
}
