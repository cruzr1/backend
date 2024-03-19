import { MailerModule } from '@nestjs-modules/mailer';
import { getMailerAsyncOptions } from 'src/shared/libs/config';
import { MailService } from './mail.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [MailerModule.forRootAsync(getMailerAsyncOptions())],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
