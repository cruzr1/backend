import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
  Param,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploaderService } from './uploader.service';
import { fillDTO } from 'src/shared/libs/utils/helpers';
import { UploadedFileRdo } from './rdo/uploaded-file.rdo';
import { MongoIdValidationPipe } from 'src/shared/pipes/mongo-id-validation.pipe';
import { FileValidationParams } from './uploader.constant';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploaderService: UploaderService) {}

  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: FileValidationParams.ImageSize },
    }),
  )
  public async uploadImageFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: FileValidationParams.ImageSize,
          }),
          new FileTypeValidator({
            fileType: FileValidationParams.MimeTypeRegex,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<UploadedFileRdo> {
    const fileEntity = await this.uploaderService.saveFile(file);
    return fillDTO(UploadedFileRdo, fileEntity.toPOJO());
  }

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  public async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: FileValidationParams.MimeTypeRegex,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<UploadedFileRdo> {
    const fileEntity = await this.uploaderService.saveFile(file);
    return fillDTO(UploadedFileRdo, fileEntity.toPOJO());
  }

  @Get('/:fileId')
  public async show(
    @Param('fileId', MongoIdValidationPipe) fileId: string,
  ): Promise<UploadedFileRdo> {
    const existFile = await this.uploaderService.getFile(fileId);
    return fillDTO(UploadedFileRdo, existFile);
  }
}
