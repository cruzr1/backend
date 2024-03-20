import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  User,
  Gender,
  UserRole,
  Location,
  Level,
  TrainType,
  Duration,
} from 'src/shared/libs/types';

@Schema({
  collection: 'users',
  timestamps: true,
})
export class UserModel extends Document implements User {
  @Prop({
    required: true,
  })
  public email: string;

  @Prop({
    required: true,
  })
  public name: string;

  @Prop({
    required: true,
  })
  public passwordHash: string;

  @Prop({
    required: true,
  })
  public avatar: string;

  @Prop({
    required: true,
  })
  public gender: Gender;

  @Prop({
    required: false,
  })
  public birthDate?: Date;

  @Prop({
    required: true,
  })
  public role: UserRole;

  @Prop({
    required: true,
  })
  public description: string;

  @Prop({
    required: true,
  })
  public location: Location;

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
  public trainType: TrainType[];

  @Prop({
    required: true,
  })
  public isReadyTrain: boolean;

  @Prop({
    required: true,
  })
  public friends: string[];

  @Prop({
    required: false,
  })
  public duration: Duration;

  @Prop({
    required: false,
  })
  public subscribedFor: string[];

  @Prop({
    required: false,
  })
  public caloriesTarget: number;

  @Prop({
    required: false,
  })
  public caloriesDaily: number;

  @Prop({
    required: false,
  })
  public certificates: string;

  @Prop({
    required: false,
  })
  public achievements: string;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
