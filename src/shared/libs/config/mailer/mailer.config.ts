import * as Joi from 'joi'
import { registerAs } from '@nestjs/config';

export const DEFAULT_SMTP_PORT = 25;

export interface MailerConfig {
  mailHost: string;
  mailPort: number;
  mailUser: string;
  mailPassword: string;
  mailFrom: string;
}

const validationSchema = Joi.object({
  mailHost: Joi.string().valid().hostname().required(),
  mailPassword: Joi.string().required(),
  mailPort: Joi.number().port().default(DEFAULT_SMTP_PORT),
  mailUser: Joi.string().required(),
  mailFrom: Joi.string().required(),
});


function validateConfig(config: MailerConfig): void {
  const { error } = validationSchema.validate(config, { abortEarly: true });
  if (error) {
    throw new Error(`[Mailer Config Validation Error]: ${error.message}`);
  }
}

function getConfig(): MailerConfig {
  const config: MailerConfig = {
    mailHost: process.env.MAIL_SMTP_HOST,
    mailPassword: process.env.MAIL_USER_PASSWORD,
    mailPort: parseInt(process.env.MAIL_SMTP_PORT ?? DEFAULT_SMTP_PORT.toString(), 10),
    mailUser: process.env.MAIL_USER_NAME,
    mailFrom: process.env.MAIL_FROM,
  };
  validateConfig(config);
  return config;
}

export default registerAs('mailer', getConfig);
