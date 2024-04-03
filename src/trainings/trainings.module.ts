import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { getJwtOptions } from 'src/shared/libs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TrainingSchema, TrainingModel } from './training.model';
import { TrainingsController } from './trainings.controller';
import { TrainingsService } from './trainings.service';
import { HTTP_CLIENT_MAX_REDIRECTS, HTTP_CLIENT_TIMEOUT } from 'src/app.config';
import { JwtAccessStrategy } from 'src/shared/strategies';
import { TrainingsRepository } from './trainings.repository';
import { AccountsModule } from 'src/accounts/accounts.module';
import { UsersModule } from 'src/users/users.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { OrdersModule } from 'src/orders/orders.module';

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
      { name: TrainingModel.name, schema: TrainingSchema },
    ]),
    AccountsModule,
    UsersModule,
    NotificationsModule,
    OrdersModule,
  ],
  controllers: [TrainingsController],
  providers: [TrainingsService, JwtAccessStrategy, TrainingsRepository],
  exports: [TrainingsService],
})
export class TrainingsModule {}
