export interface Review {
  id: string;
  authorId: string;
  trainingId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}
