import { Document, SchemaTypes } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Notification, NotifyStatus } from 'src/shared/libs/types';

@Schema({
  collection: 'notifications',
  timestamps: true,
})
export class NotificationModel extends Document implements Notification {
  @Prop({
    required: false,
  })
  public notifyDate?: Date;

  @Prop({
    required: true,
  })
  public userId: string;

  @Prop({
    required: true,
  })
  public description: string;

  @Prop({
    required: true,
  })
  public notifyStatus: NotifyStatus;

  @Prop({
    required: true,
    type: SchemaTypes.Mixed,
  })
  public payload: {
    to: string;
    subject: string;
    template: string;
    context: {
      string: string;
    };
  };
}

export const NotificationSchema =
  SchemaFactory.createForClass(NotificationModel);
