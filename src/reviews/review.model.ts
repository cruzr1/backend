import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Review } from 'src/shared/libs/types';

@Schema({
  collection: 'reviews',
  timestamps: true,
})
export class ReviewModel extends Document implements Review {
  @Prop({
    required: true,
  })
  public authorId: string;

  @Prop({
    required: true,
  })
  public trainingId: string;

  @Prop({
    required: true,
  })
  public rating: number;

  @Prop({
    required: true,
  })
  public comment: string;
}

export const ApplicationSchema = SchemaFactory.createForClass(ReviewModel);
