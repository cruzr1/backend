import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { UserEntity } from 'src/users/user.entity';

const BASE_URL = 'http://localhost:3000/api/users';

@Injectable()
export class AddUserInterceptor implements NestInterceptor {
  constructor(private readonly httpService: HttpService) {}

  public async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const request = context.switchToHttp().getRequest();
    const { data } = await this.httpService.axiosRef.get<UserEntity>(
      `${BASE_URL}/${request['user'].sub}`,
      {
        headers: {
          Authorization: request.headers['authorization'],
        },
      },
    );
    request['user'] = data;
    return next.handle();
  }
}
