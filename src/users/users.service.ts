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
import { Token, User } from 'src/shared/libs/types';
import { JwtService } from '@nestjs/jwt';
import { jwtConfig } from 'src/shared/libs/config';
import { ConfigType } from '@nestjs/config';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { createJWTPayload } from 'src/shared/libs/utils/helpers';
import * as crypto from 'node:crypto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtOptions: ConfigType<typeof jwtConfig>,
    private readonly refreshTokenService: RefreshTokenService,
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
}
