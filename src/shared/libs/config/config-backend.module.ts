import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import applicationConfig from './application/application.config';
import mongoConfig from './mongodb/mongodb.config';
import jwtConfig from './jwt/jwt.config';
import uploadConfig from './upload/upload.config';

const ENV_BACKEND_FILE_PATH = '.backend.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [applicationConfig, mongoConfig, jwtConfig, uploadConfig],
      envFilePath: ENV_BACKEND_FILE_PATH,
    }),
  ],
})
export class ConfigBackendModule {}
