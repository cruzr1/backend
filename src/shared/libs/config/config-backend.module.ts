import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import applicationConfig from './application/application.config';
import mongoConfig from './mongodb/mongodb.config';
import jwtConfig from './jwt/jwt.config';

const ENV_BACKEND_FILE_PATH = './.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [applicationConfig, mongoConfig, jwtConfig],
      envFilePath: ENV_BACKEND_FILE_PATH,
    }),
  ],
})
export class ConfigBackendModule {}
