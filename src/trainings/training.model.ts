import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  Training,
  Gender,
  Level,
  TrainType,
  Duration,
} from 'src/shared/libs/types';

@Schema({
  collection: 'users',
  timestamps: true,
})
export class TrainingModel extends Document implements Training {
  @Prop({
    required: true,
  })
  public name: string;
  @Prop({
    required: true,
  })
  public backgroundImage: string;
  @Prop({
    required: true,
  })
  public level: Level;
  @Prop({
    required: true,
  })
  public trainType: TrainType;
  @Prop({
    required: true,
  })
  public duration: Duration;
  @Prop({
    required: true,
  })
  public price: number;
  @Prop({
    required: true,
  })
  public calories: number;
  @Prop({
    required: true,
  })
  public description: string;
  @Prop({
    required: true,
  })
  public gender: Gender;
  @Prop({
    required: true,
  })
  public videoURL: string;
  @Prop({
    required: true,
  })
  public rating: number;
  @Prop({
    required: true,
  })
  public trainerId: string;
  @Prop({
    required: true,
  })
  public isSpecial: boolean;
}

export const TrainingSchema = SchemaFactory.createForClass(TrainingModel);
