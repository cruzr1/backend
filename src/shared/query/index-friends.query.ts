import { PickType } from '@nestjs/swagger';
import { IndexUsersQuery } from './index-users.query';

export class IndexFriendsQuery extends PickType(IndexUsersQuery, [
  'take',
] as const) {}
