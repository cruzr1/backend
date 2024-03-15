import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const UPLOAD_DIRECTORY_PATH_LOCAL = './uploads';

export interface UploadConfig {
  serveRoot?: string;
  uploadDirectory: string;
}

const validationSchema = Joi.object({
  serveRoot: Joi.string().required(),
  uploadDirectory: Joi.string().required(),
});

function validateConfig(config: UploadConfig): void {
  const { error } = validationSchema.validate(config, { abortEarly: true });
  if (error) {
    throw new Error(`[Upload Config Validation Error]: ${error.message}`);
  }
}

function getConfig(): UploadConfig {
  const config: UploadConfig = {
    serveRoot: process.env.SERVE_ROOT,
    uploadDirectory:
      process.env.UPLOAD_DIRECTORY_PATH ?? UPLOAD_DIRECTORY_PATH_LOCAL,
  };
  validateConfig(config);
  return config;
}

export default registerAs('upload', getConfig);
