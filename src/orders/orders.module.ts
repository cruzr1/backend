import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { getJwtOptions } from 'src/shared/libs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderModel, OrderSchema } from './order.model';
import { HTTP_CLIENT_MAX_REDIRECTS, HTTP_CLIENT_TIMEOUT } from 'src/app.config';
import { JwtAccessStrategy } from 'src/shared/strategies';
import { OrdersRepository } from './orders.repository';
import { OrdersService } from './orders.service';
import { AccountsModule } from 'src/accounts/accounts.module';
import { OrdersController } from './orders.controller';
import { TrainingsModule } from 'src/trainings/trainings.module';

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
    MongooseModule.forFeature([{ name: OrderModel.name, schema: OrderSchema }]),
    AccountsModule,
    forwardRef(() => TrainingsModule),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, JwtAccessStrategy, OrdersRepository],
  exports: [OrdersRepository],
})
export class OrdersModule {}
