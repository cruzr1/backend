import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  Logger,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import {
  USER_EXISTS,
  USER_NOT_FOUND,
  USER_PASSWORD_WRONG,
} from './users.constant';
import { UserEntity } from './user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { UsersRepository } from './users.repository';
import { PaginationResult, Token, User } from 'src/shared/libs/types';
import { JwtService } from '@nestjs/jwt';
import { jwtConfig } from 'src/shared/libs/config';
import { ConfigType } from '@nestjs/config';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { createJWTPayload, updateArray } from 'src/shared/libs/utils/helpers';
import * as crypto from 'node:crypto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IndexUsersQuery } from 'src/shared/query/index-users.query';
import { NotificationsService } from 'src/notifications/notifications.service';
import { ADD_FRIEND } from './users.constant';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtOptions: ConfigType<typeof jwtConfig>,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly notificationsService: NotificationsService,
  ) {}

  public async registerNewUser(dto: CreateUserDto): Promise<UserEntity> {
    const { email, password } = dto;
    const existUser = await this.usersRepository.findByEmail(email);
    if (existUser) {
      throw new ConflictException(USER_EXISTS);
    }
    const user = {
      ...dto,
      passwordHash: '',
      friends: [],
    };
    const userEntity = await new UserEntity(user).setPassword(password);
    return await this.usersRepository.save(userEntity);
  }

  public async verifyUser(dto: LoginUserDto): Promise<UserEntity> {
    const { email, password } = dto;
    const existUser = await this.getUserByEmail(email);
    if (!(await existUser.comparePassword(password))) {
      throw new UnauthorizedException(USER_PASSWORD_WRONG);
    }
    return existUser;
  }

  public async createUserToken(user: User): Promise<Token> {
    const accessTokenPayload = createJWTPayload(user);
    const refreshTokenPayload = {
      ...accessTokenPayload,
      tokenId: crypto.randomUUID(),
    };
    await this.refreshTokenService.createRefreshSession(refreshTokenPayload);
    try {
      const accessToken = await this.jwtService.signAsync(accessTokenPayload);
      const refreshToken = await this.jwtService.signAsync(
        refreshTokenPayload,
        {
          secret: this.jwtOptions.refreshTokenSecret,
          expiresIn: this.jwtOptions.refreshTokenExpiresIn,
        },
      );
      return { accessToken, refreshToken };
    } catch (error) {
      this.logger.error('[Token generation error]: ' + error.message);
      throw new HttpException(
        'Ошибка при создании токена.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async notifyNewFriend(
    friends: string[],
    friendId: string,
    userId: string,
  ): Promise<string[]> {
    const newFriendsList: string[] = updateArray<string>(friends!, friendId);
    if (newFriendsList.length > friends!.length) {
      await this.notificationsService.createNewNotification({
        userId,
        description: ADD_FRIEND,
      });
    }
    return newFriendsList;
  }

  public async getUserEntity(id: string): Promise<UserEntity> {
    const existUser = await this.usersRepository.findById(id);
    if (!existUser) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    return existUser;
  }

  public async getUserByEmail(email: string): Promise<UserEntity> {
    const existUser = await this.usersRepository.findByEmail(email);
    if (!existUser) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    return existUser;
  }

  public async updateUser(userId: string, dto: UpdateUserDto) {
    const existUser = await this.getUserEntity(userId);
    const updateUser = new UserEntity({ ...existUser, ...dto });
    return await this.usersRepository.update(userId, updateUser);
  }

  public async indexUsers(
    query?: IndexUsersQuery,
  ): Promise<PaginationResult<UserEntity>> {
    return await this.usersRepository.findMany(query ?? {});
  }

  public async indexUserFriends(
    userFriends?: string[] | undefined,
  ): Promise<UserEntity[]> {
    const friendsFound: UserEntity[] = await this.usersRepository.indexFriends(
      userFriends ?? [],
    );
    return friendsFound;
  }

  public async indexSubscribers(trainerId: string): Promise<UserEntity[]> {
    return await this.usersRepository.indexSubscribers(trainerId);
  }
}
