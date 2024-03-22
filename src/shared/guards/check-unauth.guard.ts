import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class CheckUnAuthGuard implements CanActivate {
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request.headers['authorization']) {
      throw new ForbiddenException(
        `Authorization token: ${request.headers['authorization']}`,
      );
    }
    return true;
  }
}
