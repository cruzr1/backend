import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { getJwtOptions } from 'src/shared/libs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationModel, NotificationSchema } from './notification.model';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { HTTP_CLIENT_MAX_REDIRECTS, HTTP_CLIENT_TIMEOUT } from 'src/app.config';
import { JwtAccessStrategy } from 'src/shared/strategies';
import { NotificationsRepository } from './notifications.repository';

@Module({
  imports: [
    HttpModule.register({
      timeout: HTTP_CLIENT_TIMEOUT,
      maxRedirects: HTTP_CLIENT_MAX_REDIRECTS,
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: getJwtOptions,
    }),
    MongooseModule.forFeature([
      { name: NotificationModel.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, JwtAccessStrategy, NotificationsRepository],
  exports: [NotificationsService],
})
export class NotificationsModule {}
