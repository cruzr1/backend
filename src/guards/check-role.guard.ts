import { CanActivate, ExecutionContext, mixin } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { UserRole } from 'src/shared/libs/types';

const AUTHORIZATION_URL = 'http://localhost:3000/api/users';

export const RoleGuard = (userRole: UserRole) => {
  class RoleGuardMixin implements CanActivate {
    public readonly httpService: HttpService;
    constructor() {
      this.httpService = new HttpService();
    }

    public async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
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
      } = await this.httpService.axiosRef.get(
        `${AUTHORIZATION_URL}/${user.sub}`,
        {
          headers: {
            Authorization: request.headers['authorization'],
          },
        },
      );
      if (role !== userRole) {
        return false;
      }
      return true;
    }
  }

  const guard = mixin(RoleGuardMixin);
  return guard;
};
