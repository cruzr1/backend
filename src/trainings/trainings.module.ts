import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { getJwtOptions } from 'src/shared/libs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TrainingSchema, TrainingModel } from './training.model';
import { RefreshTokenModule } from 'src/refresh-token/refresh-token.module';
import { TrainingsController } from './trainings.controller';
import { TrainingsService } from './trainings.service';
import { HTTP_CLIENT_MAX_REDIRECTS, HTTP_CLIENT_TIMEOUT } from 'src/app.config';
import { JwtAccessStrategy } from 'src/strategies';
import { TrainingsRepository } from './trainings.repository';

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
    RefreshTokenModule,
  ],
  controllers: [TrainingsController],
  providers: [TrainingsService, JwtAccessStrategy, TrainingsRepository],
})
export class TrainingsModule {}
