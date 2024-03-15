import { Module } from '@nestjs/common';
import {
  ConfigBackendModule,
  getMongoOptions,
  getJwtOptions,
} from './shared/libs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { TrainingsModule } from './trainings/trainings.module';
import { ReviewsModule } from './reviews/reviews.module';
import { AccountsModule } from './accounts/accounts.module';
import { UploaderModule } from './uploader/uploader.module';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
