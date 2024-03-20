import { Module } from '@nestjs/common';
import {
  ConfigBackendModule,
  getMongoOptions,
  getJwtOptions,
  getBullOptions,
} from './shared/libs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { TrainingsModule } from './trainings/trainings.module';
import { ReviewsModule } from './reviews/reviews.module';
import { AccountsModule } from './accounts/accounts.module';
import { UploaderModule } from './uploader/uploader.module';
import { ApplicationsModule } from './applications/applications.module';
import { OrdersModule } from './orders/orders.module';
import { MailModule } from './mail/mail.module';
import { NotificationsModule } from './notifications/notifications.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ConfigBackendModule,
    MongooseModule.forRootAsync(getMongoOptions()),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: getJwtOptions,
    }),
    UsersModule,
    TrainingsModule,
    ReviewsModule,
    AccountsModule,
    UploaderModule,
    ApplicationsModule,
    OrdersModule,
    MailModule,
    NotificationsModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getBullOptions,
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
