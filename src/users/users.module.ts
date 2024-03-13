import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getJwtOptions } from 'src/shared/libs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, UserModel } from './user.model';
import { RefreshTokenModule } from 'src/refresh-token/refresh-token.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {
  JwtAccessStrategy,
  JwtRefreshStrategy,
  LocalStrategy,
} from 'src/strategies';
import { UsersRepository } from './users.repository';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: getJwtOptions,
    }),
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
    RefreshTokenModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    JwtAccessStrategy,
    LocalStrategy,
    JwtRefreshStrategy,
    UsersRepository,
  ],
})
export class UsersModule {}
