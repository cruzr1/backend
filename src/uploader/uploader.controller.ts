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
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiConsumes,
  ApiParam,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploaderService } from './uploader.service';
import { fillDTO } from 'src/shared/libs/utils/helpers';
import { UploadedFileRdo } from './rdo/uploaded-file.rdo';
import { MongoIdValidationPipe } from 'src/shared/pipes/mongo-id-validation.pipe';
import { FileValidationParams } from './uploader.constant';

@ApiTags('Сервис загрузки файлов')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploaderService: UploaderService) {}

  @ApiOperation({ description: 'Загрузить изображение' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The image file has been uploaded.',
  })
  @ApiConsumes('multipart/form-data')
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

  @ApiOperation({ description: 'Загрузить файл видео или pdf' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The file has been uploaded.',
  })
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

  @ApiOperation({ description: 'Получить данные о файле' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The file information has been provided.',
  })
  @ApiParam({ name: 'fileId', description: 'Id файла' })
  @Get('/:fileId')
  public async show(
    @Param('fileId', MongoIdValidationPipe) fileId: string,
  ): Promise<UploadedFileRdo> {
    const existFile = await this.uploaderService.getFile(fileId);
    return fillDTO(UploadedFileRdo, existFile);
  }
}
