import { TokenPayload, User } from 'src/shared/libs/types';

export function createJWTPayload(user: User): TokenPayload {
  return {
    sub: user.id,
    email: user.email,
    name: user.name,
  };
}
