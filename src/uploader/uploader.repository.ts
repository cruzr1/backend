import { MongoRepository, File } from 'src/shared/libs/types';
import { FileEntity } from './file.entity';
import { FileModel } from './file.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class UploaderRepository extends MongoRepository<FileEntity, File> {
  constructor(@InjectModel(FileModel.name) fileModel: Model<FileModel>) {
    super(fileModel, FileEntity.fromObject);
  }
}
