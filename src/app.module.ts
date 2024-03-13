import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  ConfigBackendModule,
  getMongoOptions,
  getJwtOptions,
} from './shared/libs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigBackendModule,
    MongooseModule.forRootAsync(getMongoOptions()),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: getJwtOptions,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
