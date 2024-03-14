import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { getJwtOptions } from 'src/shared/libs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewModel, ReviewSchema } from './review.model';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { HTTP_CLIENT_MAX_REDIRECTS, HTTP_CLIENT_TIMEOUT } from 'src/app.config';
import { JwtAccessStrategy } from 'src/shared/strategies';
import { ReviewsRepository } from './reviews.repository';

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
      { name: ReviewModel.name, schema: ReviewSchema },
    ]),
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService, JwtAccessStrategy, ReviewsRepository],
})
export class ReviewsModule {}
