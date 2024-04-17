import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  Logger,
  HttpException,
  HttpStatus,
  Inject,
  forwardRef,
  ForbiddenException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import {
  USER_EXISTS,
  USER_NOT_FOUND,
  USER_PASSWORD_WRONG,
  USER_NOT_FRIEND,
} from './users.constant';
import { UserEntity } from './user.entity';
import { UsersRepository } from './users.repository';
import { PaginationResult, Token, User, UserRole } from 'src/shared/libs/types';
import { JwtService } from '@nestjs/jwt';
import { jwtConfig } from 'src/shared/libs/config';
import { ConfigType } from '@nestjs/config';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { createJWTPayload, updateArray } from 'src/shared/libs/utils/helpers';
import * as crypto from 'node:crypto';
import { IndexUsersQuery } from 'src/shared/query/index-users.query';
import { NotificationsService } from 'src/notifications/notifications.service';
import { generateUserEntities } from 'src/shared/libs/utils/database/generate-user';
import { LoginUserPickDto } from './dto/login-user-pick.dto';
import { UpdateUserPartialDto } from './dto/update-user-partial.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtOptions: ConfigType<typeof jwtConfig>,
    private readonly refreshTokenService: RefreshTokenService,
    @Inject(forwardRef(() => NotificationsService))
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
    };
    const userEntity = await new UserEntity(user).setPassword(password);
    return await this.usersRepository.save(userEntity);
  }

  public async verifyUser(dto: LoginUserPickDto): Promise<UserEntity> {
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

  public async changeFriendsList(
    userId: string,
    friendId: string,
  ): Promise<UserEntity | null> {
    const { friends, name } = await this.getUserEntity(userId);
    const newFriendsList: string[] = updateArray<string>(friends, friendId);
    const updatedUser = await this.updateUser(userId!, {
      friends: newFriendsList,
    });
    if (newFriendsList > friends) {
      await this.notificationsService.createNewFriendNotification(
        friendId,
        userId,
        name,
      );
    }
    const { friends: friendsOfFriend } = await this.getUserEntity(friendId);
    const newFriendsListOfFriend: string[] = updateArray<string>(
      friendsOfFriend,
      userId,
    );
    await this.updateUser(friendId, {
      friends: newFriendsListOfFriend,
    });
    return updatedUser;
  }

  public async seedDatabase(count: number): Promise<void> {
    const usersEntities = generateUserEntities(count);
    await this.usersRepository.insertMany(usersEntities);
  }

  public async getUsersList(role: UserRole): Promise<UserEntity[]> {
    return await this.usersRepository.indexUsers(role);
  }

  public async changeUserSubscription(
    userId: string,
    trainerId: string,
  ): Promise<UserEntity | null> {
    const { subscribedFor } = await this.getUserEntity(userId);
    const newSubscriptionList = updateArray<string>(subscribedFor, trainerId);
    return await this.updateUser(userId, {
      subscribedFor: newSubscriptionList,
    });
  }

  public async getUserEntity(id: string): Promise<UserEntity> {
    const existUser = await this.usersRepository.findById(id);
    if (!existUser) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    return existUser;
  }

  public async getUserDetails(
    trainerId: string,
    findUserId: string,
  ): Promise<UserEntity> {
    const existUser = await this.getUserEntity(findUserId);
    if (existUser.friends.includes(trainerId)) {
      return existUser;
    }
    throw new ForbiddenException(USER_NOT_FRIEND);
  }

  public async getUserByEmail(email: string): Promise<UserEntity> {
    const existUser = await this.usersRepository.findByEmail(email);
    if (!existUser) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    return existUser;
  }

  public async updateUser(userId: string, dto: UpdateUserPartialDto) {
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
    take: number,
    userId: string,
  ): Promise<PaginationResult<UserEntity>> {
    const { friends } = await this.getUserEntity(userId);
    return await this.usersRepository.indexFriends(take, friends);
  }

  public async indexSubscribers(trainerId: string): Promise<UserEntity[]> {
    return await this.usersRepository.indexSubscribers(trainerId);
  }

  public async indexAuthors(authorIds: string[]): Promise<UserEntity[]> {
    return await this.usersRepository.findAuthors(authorIds);
  }
}
