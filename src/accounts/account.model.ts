import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Account } from 'src/shared/libs/types';

@Schema({
  collection: 'accounts',
  timestamps: true,
})
export class AccountModel extends Document implements Account {
  @Prop({
    required: true,
  })
  public userId: string;

  @Prop({
    required: true,
  })
  public trainingId: string;

  @Prop({
    required: true,
  })
  public trainingsCount: number;
}

export const AccountSchema = SchemaFactory.createForClass(AccountModel);
