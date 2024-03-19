import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Notification } from 'src/shared/libs/types';

@Schema({
  collection: 'notifications',
  timestamps: true,
})
export class NotificationModel extends Document implements Notification {
  @Prop({
    required: true,
  })
  public notifyDate: Date;

  @Prop({
    required: true,
  })
  public userId: string;

  @Prop({
    required: true,
  })
  public description: string;
}

export const NotificationSchema =
  SchemaFactory.createForClass(NotificationModel);
