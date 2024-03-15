export interface File {
  id?: string;
  originalName: string;
  subdirectory: string;
  size: number;
  mimetype: string;
  hashName: string;
  path: string;
  createdAt?: Date;
  updatedAt?: Date;
}
