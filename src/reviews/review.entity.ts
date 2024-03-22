import { Review } from 'src/shared/libs/types';

export class ReviewEntity implements Review {
  id?: string;
  authorId: string;
  trainingId: string;
  rating: number;
  comment: string;
  createdAt?: Date;

  constructor(data: Review) {
    this.id = data.id;
    this.authorId = data.authorId;
    this.trainingId = data.trainingId;
    this.rating = data.rating;
    this.comment = data.comment;
    this.createdAt = data.createdAt || new Date();
  }

  public toPOJO(): Review {
    return {
      id: this.id,
      authorId: this.authorId,
      trainingId: this.trainingId,
      rating: this.rating,
      comment: this.comment,
      createdAt: this.createdAt,
    };
  }

  static fromObject(data: Review): ReviewEntity {
    return new ReviewEntity(data);
  }
}
