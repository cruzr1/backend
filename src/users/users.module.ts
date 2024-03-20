import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { getJwtOptions } from 'src/shared/libs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, UserModel } from './user.model';
import { RefreshTokenModule } from 'src/refresh-token/refresh-token.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { HTTP_CLIENT_MAX_REDIRECTS, HTTP_CLIENT_TIMEOUT } from 'src/app.config';
import {
  JwtAccessStrategy,
  JwtRefreshStrategy,
  LocalStrategy,
} from 'src/shared/strategies';
import { UsersRepository } from './users.repository';
import { MailModule } from 'src/mail/mail.module';
import { NotificationsService } from 'src/notifications/notifications.service';

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
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
    RefreshTokenModule,
    MailModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    JwtAccessStrategy,
    LocalStrategy,
    JwtRefreshStrategy,
    UsersRepository,
    NotificationsService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
