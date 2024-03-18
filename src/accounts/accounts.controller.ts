import {
  Body,
  Controller,
  Post,
  UseGuards,
  HttpStatus,
  Get,
  Param,
  Patch,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { CreateAccountDto } from './dto/create-account.dto';
import { AccountRdo } from './rdo/account.rdo';
import { fillDTO } from 'src/shared/libs/utils/helpers';
import { CheckAuthGuard } from 'src/shared/guards/check-auth.guard';
import { MongoIdValidationPipe } from 'src/shared/pipes/mongo-id-validation.pipe';
import { UpdateAccountDto } from './dto/update-account.dto';

@ApiTags('accounts')
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

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

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The account has been updated.',
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

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The account has been updated.',
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

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The account details have been provided.',
  })
  @UseGuards(CheckAuthGuard)
  @Get(':userId')
  public async show(
    @Param('accountId', MongoIdValidationPipe) userId: string,
  ): Promise<AccountRdo> {
    const existAccount = await this.accountsService.findByUserId(userId);
    return fillDTO(AccountRdo, existAccount?.toPOJO());
  }
}
