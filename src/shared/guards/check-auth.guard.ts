import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

const AUTHORIZATION_URL = 'http://localhost:3000/api/users';

@Injectable()
export class CheckAuthGuard implements CanActivate {
  constructor(private readonly httpService: HttpService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      const { data } = await this.httpService.axiosRef.post(
        `${AUTHORIZATION_URL}/check`,
        {},
        {
          headers: {
            Authorization: request.headers['authorization'],
          },
        },
      );
      request['user'] = data;
      return true;
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }
}
