import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class LoginUserPickDto extends PickType(CreateUserDto, [
  'email',
  'password',
]) {}
