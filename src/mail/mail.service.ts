import { Injectable, Inject } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { EMAIL_ADD_USER_SUBJECT, USER_TEMPLATE_PATH } from './mail.constant';
import { ConfigType } from '@nestjs/config';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { MailerConfig } from 'src/shared/libs/config';
import { NotificationPayloadType } from 'src/shared/libs/types';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    @Inject(MailerConfig.KEY)
    private readonly mailerConfig: ConfigType<typeof MailerConfig>,
  ) {}

  public async sendCommonMail(
    mailData: Record<string, unknown>,
  ): Promise<void> {
    await this.mailerService.sendMail({
      from: this.mailerConfig.mailFrom,
      ...mailData,
    });
  }

  public async sendNotification(
    payload: NotificationPayloadType,
  ): Promise<void> {
    await this.mailerService.sendMail({
      from: this.mailerConfig.mailFrom,
      ...payload,
    });
  }

  public async sendNotifyNewUser({
    name,
    email,
    password,
  }: CreateUserDto): Promise<void> {
    await this.mailerService.sendMail({
      from: this.mailerConfig.mailFrom,
      to: email,

      subject: EMAIL_ADD_USER_SUBJECT,
      template: USER_TEMPLATE_PATH,
      context: {
        email: `${email}`,
        name: `${name}`,
        password: `${password}`,
      },
    });
  }
}
