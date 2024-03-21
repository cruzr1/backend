import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { getJwtOptions } from 'src/shared/libs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ApplicationModel, ApplicationSchema } from './application.model';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { HTTP_CLIENT_MAX_REDIRECTS, HTTP_CLIENT_TIMEOUT } from 'src/app.config';
import { JwtAccessStrategy } from 'src/shared/strategies';
import { ApplicationsRepository } from './applications.repository';
import { AccountsModule } from 'src/accounts/accounts.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { BullModule } from '@nestjs/bull';

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
      { name: ApplicationModel.name, schema: ApplicationSchema },
    ]),
    AccountsModule,
    NotificationsModule,
    BullModule.registerQueue({
      name: 'applications',
    }),
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService, JwtAccessStrategy, ApplicationsRepository],
})
export class ApplicationsModule {}
