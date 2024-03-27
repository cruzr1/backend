import {
  Body,
  Controller,
  Post,
  UseGuards,
  HttpStatus,
  Get,
  Param,
  Patch,
  Req,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import {
  ApiTags,
  ApiResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { CreateAccountDto } from './dto/create-account.dto';
import { AccountRdo } from './rdo/account.rdo';
import { fillDTO } from 'src/shared/libs/utils/helpers';
import { CheckAuthGuard } from 'src/shared/guards/check-auth.guard';
import { MongoIdValidationPipe } from 'src/shared/pipes/mongo-id-validation.pipe';
import { UpdateAccountDto } from './dto/update-account.dto';
import { RoleGuard } from 'src/shared/guards/check-role.guard';
import { UserRole, RequestWithTokenPayload } from 'src/shared/libs/types';

@ApiBearerAuth()
@ApiTags('Сервис балансов пользователей')
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @ApiOperation({ description: 'Создание баланса' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The new account has been created.',
  })
  @UseGuards(CheckAuthGuard)
  @Post('/')
  public async create(@Body() dto: CreateAccountDto): Promise<AccountRdo> {
    const newAccount = await this.accountsService.createNewAccount(dto);
    return fillDTO(AccountRdo, newAccount.toPOJO());
  }

  @ApiOperation({ description: 'Пополнение баланса' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The account has been updated.',
  })
  @ApiParam({
    name: 'accountId',
    description: 'Id баланса',
  })
  @UseGuards(CheckAuthGuard)
  @Patch('add/:accountId')
  public async addTrainings(
    @Param('accountId', MongoIdValidationPipe) accountId: string,
    @Body() dto: UpdateAccountDto,
  ): Promise<AccountRdo> {
    const updatedAccount = await this.accountsService.addActiveTrainings(
      accountId,
      dto,
    );
    return fillDTO(AccountRdo, updatedAccount?.toPOJO());
  }

  @ApiOperation({ description: 'Списание тренировок' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The account has been updated.',
  })
  @ApiParam({
    name: 'accountId',
    description: 'Id баланса',
  })
  @UseGuards(CheckAuthGuard)
  @Patch('use/:accountId')
  public async useTrainings(
    @Param('accountId', MongoIdValidationPipe) accountId: string,
    @Body() dto: UpdateAccountDto,
  ): Promise<AccountRdo> {
    const updatedAccount = await this.accountsService.useActiveTrainings(
      accountId,
      dto,
    );
    return fillDTO(AccountRdo, updatedAccount?.toPOJO());
  }

  @ApiOperation({
    description: 'Получение баланса: количество доступных тренировок.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The account details have been provided.',
  })
  @UseGuards(CheckAuthGuard)
  @UseGuards(RoleGuard(UserRole.User))
  @Get('/')
  public async show(
    @Req() { user: { sub } }: RequestWithTokenPayload,
  ): Promise<AccountRdo> {
    const existAccount = await this.accountsService.findByUserId(sub!);
    return fillDTO(AccountRdo, existAccount?.toPOJO());
  }
}
