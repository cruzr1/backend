import {
  Training,
  Level,
  TrainType,
  Duration,
  Gender,
} from 'src/shared/libs/types';

export class TrainingEntity implements Training {
  id?: string;
  name: string;
  backgroundImage: string;
  level: Level;
  trainType: TrainType;
  duration: Duration;
  price: number;
  calories: number;
  description: string;
  gender: Gender;
  videoURL: string;
  rating: number;
  trainerId: string;
  isSpecial: boolean;

  constructor(data: Training) {
    this.id = data.id;
    this.name = data.name;
    this.backgroundImage = data.backgroundImage;
    this.level = data.level;
    this.trainType = data.trainType;
    this.duration = data.duration;
    this.price = data.price;
    this.calories = data.calories;
    this.description = data.description;
    this.gender = data.gender;
    this.videoURL = data.videoURL;
    this.rating = data.rating;
    this.trainerId = data.trainerId;
    this.isSpecial = data.isSpecial;
  }

  public toPOJO(): Training {
    return {
      id: this.id,
      name: this.name,
      backgroundImage: this.backgroundImage,
      level: this.level,
      trainType: this.trainType,
      duration: this.duration,
      price: this.price,
      calories: this.calories,
      description: this.description,
      gender: this.gender,
      videoURL: this.videoURL,
      rating: this.rating,
      trainerId: this.trainerId,
      isSpecial: this.isSpecial,
    };
  }

  static fromObject(data: Training): TrainingEntity {
    return new TrainingEntity(data);
  }
}
