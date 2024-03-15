import { NotFoundException } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { AccountEntity } from './account.entity';
import { AccountsRepository } from './accounts.repository';
import { ACCOUNT_NOT_FOUND } from './accounts.constant';
import { UpdateAccountDto } from './dto/update-account.dto';

export class AccountsService {
  constructor(private readonly accountsRepository: AccountsRepository) {}

  public async createNewAccount(dto: CreateAccountDto): Promise<AccountEntity> {
    const newAccount = new AccountEntity({ ...dto, trainingsInactive: 0 });
    return await this.accountsRepository.save(newAccount);
  }

  public async getAccountEntity(accountId: string): Promise<AccountEntity> {
    const existAccount = await this.accountsRepository.findById(accountId);
    if (!existAccount) {
      throw new NotFoundException(ACCOUNT_NOT_FOUND);
    }
    return existAccount;
  }

  public async findByUserId(userId: string): Promise<AccountEntity | null> {
    return await this.accountsRepository.findAccountByUserId(userId);
  }

  public async addActiveTrainings(
    accountId: string,
    { trainingsCount }: UpdateAccountDto,
  ): Promise<AccountEntity | null> {
    const existAccount = await this.getAccountEntity(accountId);
    const trainingsActive = existAccount.trainingsActive + trainingsCount;
    const updatedAccount = new AccountEntity({
      ...existAccount,
      trainingsActive,
    });
    return await this.accountsRepository.update(accountId, updatedAccount);
  }

  public async useActiveTrainings(
    accountId: string,
    { trainingsCount }: UpdateAccountDto,
  ): Promise<AccountEntity | null> {
    const existAccount = await this.getAccountEntity(accountId);
    const trainingsActive = existAccount.trainingsActive - trainingsCount;
    const trainingsInactive = existAccount.trainingsInactive + trainingsCount;
    const updatedAccount = new AccountEntity({
      ...existAccount,
      trainingsActive,
      trainingsInactive,
    });
    return await this.accountsRepository.update(accountId, updatedAccount);
  }
}
