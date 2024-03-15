import { Module } from '@nestjs/common';
import { UploaderService } from './uploader.service';
import { UploadController } from './uploader.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { FileModel, FileSchema } from './file.model';
import { UploaderRepository } from './uploader.repository';

@Module({
  imports: [
    ServeStaticModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const rootPath = configService.get<string>('upload.uploadDirectory');
        const serveRoot = configService.get<string>('upload.serveRoot');
        return [
          {
            rootPath,
            serveRoot,
            serveStaticOptions: {
              fallthrough: true,
              etag: true,
            },
          },
        ];
      },
    }),
    MongooseModule.forFeature([{ name: FileModel.name, schema: FileSchema }]),
  ],
  providers: [UploaderService, UploaderRepository],
  controllers: [UploadController],
})
export class UploaderModule {}
