import {
  Controller,
  Param,
  Post,
  Get,
  Body,
  HttpStatus,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { fillDTO } from 'src/shared/libs/utils/helpers';
import { UserRdo } from './rdo/user.rdo';
import { LoggedUserRdo } from './rdo/logged-user.rdo';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import {
  RequestWithUser,
  RequestWithTokenPayload,
  Token,
  TokenPayload,
} from 'src/shared/libs/types';
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';
import { MongoIdValidationPipe } from '../pipes/mongo-id-validation.pipe';
// import { MailService } from '../mail/mail.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    // private readonly mailService: MailService
  ) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The new user has been created.',
  })
  @Post('signin')
  public async create(@Body() dto: CreateUserDto): Promise<UserRdo> {
    const newUser = await this.userService.registerNewUser(dto);
    // await this.mailService.sendNotifyNewUser(dto);
    return fillDTO(UserRdo, newUser.toPOJO());
  }

  @ApiResponse({
    type: UserRdo,
    status: HttpStatus.OK,
    description: 'User has been successfully logged in.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Password of login is wrong.',
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  public async login(@Req() { user }: RequestWithUser): Promise<UserRdo> {
    const userToken = await this.userService.createUserToken(user);
    return fillDTO(LoggedUserRdo, { ...user, ...userToken });
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get a new pair of JWT Tokens',
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  public async refreshToken(@Req() { user }: RequestWithUser): Promise<Token> {
    return this.userService.createUserToken(user);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Checks if the token payload exists',
  })
  @UseGuards(JwtAuthGuard)
  @Post('check')
  public async checkToken(
    @Req() { user: payload }: RequestWithTokenPayload,
  ): Promise<TokenPayload> {
    return payload;
  }

  @ApiResponse({
    type: UserRdo,
    status: HttpStatus.OK,
    description: 'User found',
  })
  @Get(':id')
  public async showById(
    @Param('id', MongoIdValidationPipe) userId: string,
  ): Promise<UserRdo> {
    const existUser = await this.userService.getUserEntity(userId);
    return fillDTO(UserRdo, existUser.toPOJO());
  }
}
