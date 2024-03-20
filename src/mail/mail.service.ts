import { Injectable, Inject } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import {
  EMAIL_ADD_USER_SUBJECT,
  USER_TEMPLATE_PATH,
  NEW_TRAINING_SUBJECT,
  NEW_TRAINING_TEMPLATE_PATH,
} from './mail.constant';
import { ConfigType } from '@nestjs/config';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { MailerConfig } from 'src/shared/libs/config';
import { Training } from 'src/shared/libs/types';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    @Inject(MailerConfig.KEY)
    private readonly mailerConfig: ConfigType<typeof MailerConfig>,
  ) {}

  public async sendNotifyNewUser({ name, email, password }: CreateUserDto) {
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

  public async sendNotifyNewTraining(
    {
      name,
      level,
      trainType,
      duration,
      price,
      calories,
      description,
      gender,
      rating,
      trainerId,
      isSpecial,
      videoURL,
    }: Training,
    userName: string,
    email: string,
  ) {
    await this.mailerService.sendMail({
      from: this.mailerConfig.mailFrom,
      to: email,
      subject: NEW_TRAINING_SUBJECT,
      template: NEW_TRAINING_TEMPLATE_PATH,
      context: {
        name: `${name}`,
        level: `${level}`,
        trainType: `${trainType}`,
        duration: `${duration}`,
        price: `${price}`,
        description: `${description}`,
        calories: `${calories}`,
        gender: `${gender}`,
        rating: `${rating}`,
        trainerId: `${trainerId}`,
        isSpecial: `${isSpecial}`,
        videoURL: `${videoURL}`,
        userName: `${userName}`,
      },
    });
  }
}
