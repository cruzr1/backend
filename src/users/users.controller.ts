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
import {
  ApiTags,
  ApiResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { fillDTO } from 'src/shared/libs/utils/helpers';
import { UserRdo } from './rdo/user.rdo';
import { LoggedUserRdo } from './rdo/logged-user.rdo';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import {
  RequestWithUser,
  RequestWithTokenPayload,
  Token,
  TokenPayload,
  EntitiesWithPaginationRdo,
  UserRole,
  User,
} from 'src/shared/libs/types';
import { IndexUsersQuery } from 'src/shared/query/index-users.query';
import { JwtRefreshGuard } from '../shared/guards/jwt-refresh.guard';
import { MongoIdValidationPipe } from '../shared/pipes/mongo-id-validation.pipe';
import { CheckUnAuthGuard } from 'src/shared/guards/check-unauth.guard';
import { RoleGuard } from 'src/shared/guards/check-role.guard';
import { MailService } from '../mail/mail.service';
import { LoginUserPickDto } from './dto/login-user-pick.dto';
import { UpdateUserPartialDto } from './dto/update-user-partial.dto';

@ApiBearerAuth()
@ApiTags('Сервис пользователей')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  @ApiOperation({ description: 'Список (каталог) пользователей' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The following users have been found.',
  })
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(UserRole.User))
  @Get('/')
  public async index(
    @Query()
    query?: IndexUsersQuery,
  ): Promise<EntitiesWithPaginationRdo<UserRdo>> {
    const UsersWithPagination = await this.usersService.indexUsers(query);
    return {
      ...UsersWithPagination,
      entities: UsersWithPagination.entities.map((user) =>
        fillDTO(UserRdo, user.toPOJO()),
      ),
    };
  }

  @ApiOperation({ description: 'Список друзей' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The following friends have been found.',
  })
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(UserRole.User))
  @Get('friends')
  public async indexFriends(
    @Req() { user: { sub } }: RequestWithTokenPayload,
  ): Promise<UserRdo[]> {
    const friendsList = await this.usersService.indexUserFriends(sub!);
    return fillDTO<UserRdo, User>(
      UserRdo,
      friendsList.map((friend) => friend.toPOJO()),
    );
  }

  @ApiOperation({ description: 'Добавить в друзья, удалить из списка друзей' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The friend has been added.',
  })
  @ApiParam({
    description: 'Id пользователя-друга',
    name: 'friendId',
  })
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(UserRole.User))
  @Get('friends/:friendId')
  public async addRemoveFriends(
    @Param('friendId', MongoIdValidationPipe) friendId: string,
    @Req() { user: { sub } }: RequestWithTokenPayload,
  ): Promise<UserRdo> {
    const updatedUser = await this.usersService.changeFriendsList(
      sub!,
      friendId,
    );
    return fillDTO(UserRdo, updatedUser?.toPOJO());
  }

  @ApiOperation({
    description: 'Подписаться/отписаться от уведомлений о новых тренировках',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user has been subscribed/unsubscribed.',
  })
  @ApiParam({
    description: 'Id тренера, на чьи тренировки хочет подписаться пользователь',
    name: 'trainerId',
  })
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(UserRole.User))
  @Get('subscribe/:trainerId')
  public async addRemoveSubscription(
    @Param('trainerId', MongoIdValidationPipe) trainerId: string,
    @Req() { user: { sub } }: RequestWithTokenPayload,
  ): Promise<UserRdo> {
    const updatedUser = await this.usersService.changeUserSubscription(
      sub!,
      trainerId,
    );
    return fillDTO(UserRdo, updatedUser?.toPOJO());
  }

  @ApiOperation({
    description: 'Заполнить базу данных начальными значениями',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user data have been seeded.',
  })
  @ApiParam({
    description: 'Количество записей',
    name: 'count',
  })
  @Get('seed/:count')
  public async seedDatabase(@Param('count') count: number): Promise<void> {
    await this.usersService.seedDatabase(count);
  }

  @ApiOperation({ description: 'Регистрация нового пользователя' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The new user has been created.',
  })
  @UseGuards(CheckUnAuthGuard)
  @Post('signin')
  public async create(@Body() dto: CreateUserDto): Promise<UserRdo> {
    const newUser = (await this.usersService.registerNewUser(dto)).toPOJO();
    await this.mailService.sendNotifyNewUser(dto);
    const userToken = await this.usersService.createUserToken(newUser);
    return fillDTO(LoggedUserRdo, { ...newUser, ...userToken });
  }

  @ApiOperation({ description: 'Вход в систему' })
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
  @Post('login')
  public async login(@Body() dto: LoginUserPickDto): Promise<UserRdo> {
    const user = (await this.usersService.verifyUser(dto)).toPOJO();
    const userToken = await this.usersService.createUserToken(user);
    return fillDTO(LoggedUserRdo, { ...user, ...userToken });
  }

  @ApiOperation({ description: 'Редактирование информации о пользователе' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User has been successfully updated',
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Patch('update')
  public async update(
    @Req() { user }: RequestWithTokenPayload,
    @Body() dto: UpdateUserPartialDto,
  ): Promise<UserRdo> {
    const updatedUser = await this.usersService.updateUser(
      user.sub as string,
      dto,
    );
    return fillDTO(UserRdo, updatedUser?.toPOJO());
  }

  @ApiOperation({ description: 'Cценарий отзыва Refresh Token' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The new pair of JWT Tokens provided',
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  public async refreshToken(@Req() { user }: RequestWithUser): Promise<Token> {
    return this.usersService.createUserToken(user);
  }

  @ApiOperation({ description: 'Проверить авторизацию пользователя' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The token payload exists',
  })
  @UseGuards(JwtAuthGuard)
  @Post('check')
  public async checkToken(
    @Req() { user: { sub } }: RequestWithTokenPayload,
  ): Promise<TokenPayload> {
    return await this.usersService.getUserEntity(sub!);
  }

  @ApiOperation({ description: 'Детальная информация о пользователе' })
  @ApiResponse({
    type: UserRdo,
    status: HttpStatus.OK,
    description: 'User found',
  })
  @ApiParam({
    description: 'Id пользователя',
    name: 'id',
  })
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(UserRole.User))
  @Get('user/:id')
  public async showById(
    @Param('id', MongoIdValidationPipe) userId: string,
  ): Promise<UserRdo> {
    const existUser = await this.usersService.getUserEntity(userId);
    return fillDTO(UserRdo, existUser.toPOJO());
  }

  @ApiOperation({
    description: 'Детальная информация о пользователе для тренера',
  })
  @ApiResponse({
    type: UserRdo,
    status: HttpStatus.OK,
    description: 'User found',
  })
  @ApiParam({
    description: 'Id пользователя',
    name: 'id',
  })
  @UseGuards(RoleGuard(UserRole.Trainer))
  @UseGuards(JwtAuthGuard)
  @Get('trainer/:id')
  public async showFriend(
    @Param('id', MongoIdValidationPipe) userId: string,
    @Req() { user: { sub: trainerId } }: RequestWithTokenPayload,
  ): Promise<UserRdo> {
    const existUser = await this.usersService.getUserDetails(
      trainerId!,
      userId,
    );
    return fillDTO(UserRdo, existUser.toPOJO());
  }

  @ApiOperation({ description: 'Детальная информация о пользователе' })
  @ApiResponse({
    type: UserRdo,
    status: HttpStatus.OK,
    description: 'User found',
  })
  @ApiParam({
    description: 'Id пользователя',
    name: 'id',
  })
  @UseGuards(JwtAuthGuard)
  @Get('old/:id')
  public async showUserById(
    @Param('id', MongoIdValidationPipe) userId: string,
  ): Promise<UserRdo> {
    const existUser = await this.usersService.getUserEntity(userId);
    return fillDTO(UserRdo, existUser.toPOJO());
  }
}
