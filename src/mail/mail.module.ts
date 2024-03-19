import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'node:path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    MailerModule.forRootAsync({
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
            dir: path.resolve(__dirname, 'assets'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
        return config;
      },
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
