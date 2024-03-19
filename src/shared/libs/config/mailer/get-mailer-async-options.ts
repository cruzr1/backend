import { MailerAsyncOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-async-options.interface';
import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

export function getMailerAsyncOptions(): MailerAsyncOptions {
  return {
    useFactory: async (configService: ConfigService) => {
      const config = {
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
          dir: 'src/mail/assets',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      };
      return config;
    },
    inject: [ConfigService],
  };
}
