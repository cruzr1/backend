import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  mixin,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { UserRole } from 'src/shared/libs/types';
import { UserEntity } from 'src/users/user.entity';

const AUTHORIZATION_URL = 'http://localhost:3000/api/users';

export const RoleGuard = (userRole: UserRole) => {
  class RoleGuardMixin implements CanActivate {
    public readonly httpService: HttpService;
    constructor() {
      this.httpService = new HttpService();
    }

    public async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      try {
        const { data: user } = await this.httpService.axiosRef.post(
          `${AUTHORIZATION_URL}/check`,
          {},
          {
            headers: {
              Authorization: request.headers['authorization'],
            },
          },
        );
        const {
          data: { role },
        } = await this.httpService.axiosRef.get<UserEntity>(
          `${AUTHORIZATION_URL}/${user.sub}`,
          {
            headers: {
              Authorization: request.headers['authorization'],
            },
          },
        );
        return role === userRole;
      } catch (err) {
        throw new UnauthorizedException(err.message);
      }
    }
  }

  return mixin(RoleGuardMixin);
};
