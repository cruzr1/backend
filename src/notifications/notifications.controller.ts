import {
  Controller,
  UseGuards,
  HttpStatus,
  Get,
  Req,
  Delete,
  Param,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { NotificationRdo } from './rdo/notification.rdo';
import { fillDTO } from 'src/shared/libs/utils/helpers';
import { CheckAuthGuard } from 'src/shared/guards/check-auth.guard';
import { RequestWithTokenPayload } from 'src/shared/libs/types';
import { MongoIdValidationPipe } from 'src/shared/pipes/mongo-id-validation.pipe';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The notifications list provided below.',
  })
  @UseGuards(CheckAuthGuard)
  @Get('/')
  public async index(
    @Req() { user: { sub: userId } }: RequestWithTokenPayload,
  ): Promise<NotificationRdo> {
    const notificationsList =
      await this.notificationsService.indexNotificaitons(userId!);
    return fillDTO(
      NotificationRdo,
      notificationsList.map((notification) => notification.toPOJO()),
    );
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The notifications have been sent.',
  })
  @Get('send')
  public async sendNotifications(): Promise<void> {
    await this.notificationsService.sendNotifications();
  }

  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The notifications list provided below.',
  })
  @UseGuards(CheckAuthGuard)
  @Delete(':notificationId')
  public async delete(
    @Param('notificationId', MongoIdValidationPipe) notificationId: string,
    @Req() { user: { sub: userId } }: RequestWithTokenPayload,
  ): Promise<void> {
    await this.notificationsService.deleteNotification(notificationId, userId!);
  }
}
