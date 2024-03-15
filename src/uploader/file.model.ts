import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { File } from 'src/shared/libs/types';

@Schema({
  collection: 'files',
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class FileModel extends Document implements File {
  public id?: string;

  @Prop({
    required: true,
  })
  public originalName: string;

  @Prop({
    required: true,
  })
  public subdirectory: string;

  @Prop({
    required: true,
  })
  public size: number;

  @Prop({
    required: true,
  })
  public mimetype: string;

  @Prop({
    required: true,
  })
  public hashName: string;

  @Prop({
    required: true,
  })
  public path: string;
}

export const FileSchema = SchemaFactory.createForClass(FileModel);

FileSchema.virtual('id').get(function () {
  return this._id.toString();
});
