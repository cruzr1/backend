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
  Patch,
  Query,
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
  EntitiesWithPaginationRdo,
} from 'src/shared/libs/types';
import { IndexUsersQuery } from 'src/query/index-users.query';
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';
import { MongoIdValidationPipe } from '../pipes/mongo-id-validation.pipe';
import { CheckUnAuthGuard } from 'src/guards/check-unauth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
// import { MailService } from '../mail/mail.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    // private readonly mailService: MailService
  ) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The following Users have been found.',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/')
  public async index(
    @Query() query?: IndexUsersQuery,
  ): Promise<EntitiesWithPaginationRdo<UserRdo>> {
    const UsersWithPagination = await this.usersService.indexUsers(query);
    return {
      ...UsersWithPagination,
      entities: UsersWithPagination.entities.map((user) =>
        fillDTO(UserRdo, user.toPOJO()),
      ),
    };
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The new user has been created.',
  })
  @UseGuards(CheckUnAuthGuard)
  @Post('signin')
  public async create(@Body() dto: CreateUserDto): Promise<UserRdo> {
    const newUser = await this.usersService.registerNewUser(dto);
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
  @UseGuards(CheckUnAuthGuard)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  public async login(@Req() { user }: RequestWithUser): Promise<UserRdo> {
    const userToken = await this.usersService.createUserToken(user);
    return fillDTO(LoggedUserRdo, { ...user, ...userToken });
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User has been successfully updated',
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Patch('update')
  public async update(
    @Req() { user }: RequestWithTokenPayload,
    @Body() dto: UpdateUserDto,
  ): Promise<UserRdo> {
    const updatedUser = await this.usersService.updateUser(
      user.sub as string,
      dto,
    );
    return fillDTO(UserRdo, updatedUser?.toPOJO());
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get a new pair of JWT Tokens',
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  public async refreshToken(@Req() { user }: RequestWithUser): Promise<Token> {
    return this.usersService.createUserToken(user);
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
    const existUser = await this.usersService.getUserEntity(userId);
    return fillDTO(UserRdo, existUser.toPOJO());
  }
}
