import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from '../users/users.service';
import { USERMAIL_FIELD } from '../users/users.constant';
import { User } from 'src/shared/libs/types';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UsersService) {
    super({ usernameField: USERMAIL_FIELD });
  }

  public async validate(email: string, password: string): Promise<User> {
    return (await this.userService.verifyUser({ email, password })).toPOJO();
  }
}
