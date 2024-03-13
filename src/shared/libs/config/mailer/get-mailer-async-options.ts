import { MailerAsyncOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-async-options.interface';
import { ConfigService } from '@nestjs/config';
import * as path from 'node:path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

export function getMailerAsyncOptions(): MailerAsyncOptions {
  return {
    useFactory: async (configService: ConfigService) => {
      return {
        transport: {
          host: configService.get<string>('mailer.mailHost'),
          port: configService.get<number>('mailer.mailPort'),
          secure: false,
          auth: {
            user: configService.get<string>('mailer.mailUser'),
            pass: configService.get<string>('mailer.mailPassword'),
          },
        },
        defaults: {
          from: configService.get<string>('mailer.mailFrom'),
        },
        template: {
          dir: path.resolve(__dirname, 'assets'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      };
    },
    inject: [ConfigService],
  };
}
