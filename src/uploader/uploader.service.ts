import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { UploadConfig } from 'src/shared/libs/config';
import { join } from 'path';
import 'multer';
import { writeFile } from 'node:fs/promises';
import { ensureDir } from 'fs-extra';
import * as dayjs from 'dayjs';
import { randomUUID } from 'node:crypto';
import { extension } from 'mime-types';
import { UploaderRepository } from './uploader.repository';
import { StoredFile } from 'src/shared/libs/types';
import { FileEntity } from './file.entity';
import { FILE_NOT_FOUND, CANT_SAVE_FILE } from './uploader.constant';

@Injectable()
export class UploaderService {
  private readonly logger = new Logger(UploaderService.name);
  private readonly DATE_FORMAT = 'YYYY MM';

  constructor(
    @Inject(UploadConfig.KEY)
    private readonly config: ConfigType<typeof UploadConfig>,
    private readonly uploaderRepository: UploaderRepository,
  ) {}

  private getUploadDirectoryPath(): string {
    return this.config.uploadDirectory;
  }

  private getDestinationFilePath(filename: string): string {
    return join(
      this.getUploadDirectoryPath(),
      this.getSubUploadDirectoryPath(),
      filename,
    );
  }

  private getSubUploadDirectoryPath(): string {
    const [year, month] = dayjs().format(this.DATE_FORMAT).split(' ');
    return join(year, month);
  }

  public async writeFile(file: Express.Multer.File): Promise<StoredFile> {
    try {
      const uploadDirectoryPath = this.getUploadDirectoryPath();
      const subDirectory = this.getSubUploadDirectoryPath();
      const fileExtension = extension(file.mimetype);
      const filename = `${randomUUID()}.${fileExtension}`;
      const path = this.getDestinationFilePath(filename);
      await ensureDir(join(uploadDirectoryPath, subDirectory));
      await writeFile(path, file.buffer);
      return {
        fileExtension: fileExtension || '',
        filename,
        path,
        subDirectory,
      };
    } catch (error) {
      this.logger.error(`Error while saving file: ${error.message}`);
      throw new Error(CANT_SAVE_FILE);
    }
  }

  public async saveFile(file: Express.Multer.File): Promise<FileEntity> {
    const storedFile = await this.writeFile(file);
    const fileEntity = FileEntity.fromObject({
      hashName: storedFile.filename,
      mimetype: file.mimetype,
      originalName: file.originalname,
      path: storedFile.path,
      size: file.size,
      subdirectory: storedFile.subDirectory,
    });
    return this.uploaderRepository.save(fileEntity);
  }

  public async getFile(fileId: string): Promise<FileEntity> {
    const existFile = await this.uploaderRepository.findById(fileId);
    if (!existFile) {
      throw new NotFoundException(FILE_NOT_FOUND);
    }
    return existFile;
  }
}
