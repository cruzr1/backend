import {
  BadRequestException,
  PipeTransform,
  ArgumentMetadata,
} from '@nestjs/common';
import { Types } from 'mongoose';

const BAD_MONGO_ID_ERROR = 'Incorrect format of Mongo ID;';

export class MongoIdValidationPipe implements PipeTransform {
  public transform(value: string, { type }: ArgumentMetadata) {
    if (type !== 'param') {
      throw new Error('This pipe must used only with params!');
    }
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(BAD_MONGO_ID_ERROR);
    }
    return value;
  }
}
