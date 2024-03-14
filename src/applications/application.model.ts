import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Status, Application } from 'src/shared/libs/types';

@Schema({
  collection: 'applications',
  timestamps: true,
})
export class ApplicationModel extends Document implements Application {
  @Prop({
    required: true,
  })
  public authorId: string;

  @Prop({
    required: true,
  })
  public userId: string;

  @Prop({
    required: true,
  })
  public createdAt: string;

  @Prop({
    required: true,
  })
  public updatedAt: string;

  @Prop({
    required: true,
  })
  public status: Status;
}

export const ApplicationSchema = SchemaFactory.createForClass(ApplicationModel);
