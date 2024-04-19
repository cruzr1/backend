import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { AccountEntity } from './account.entity';
import { AccountsRepository } from './accounts.repository';
import {
  ACCOUNT_NOT_FOUND,
  NO_AVAILABLE_TRAININGS_LEFT,
} from './accounts.constant';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
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

  public async findOne(
    userId: string,
    trainingId: string,
  ): Promise<AccountEntity | null> {
    const existAccount = await this.accountsRepository.findAccount(
      userId,
      trainingId,
    );
    if (existAccount) {
      return existAccount;
    }
    return null;
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
    userId: string,
    { trainingsCount, trainingId }: UpdateAccountDto,
  ): Promise<AccountEntity | null> {
    const existAccount = await this.findOne(userId, trainingId);
    if (existAccount) {
      if (existAccount.trainingsActive < trainingsCount) {
        throw new BadRequestException(NO_AVAILABLE_TRAININGS_LEFT);
      }
      const trainingsActive = existAccount.trainingsActive - trainingsCount;
      const trainingsInactive = existAccount.trainingsInactive + trainingsCount;
      const updatedAccount = new AccountEntity({
        ...existAccount,
        trainingsActive,
        trainingsInactive,
      });
      return await this.accountsRepository.update(
        existAccount.id,
        updatedAccount,
      );
    }
    return null;
  }

  public async indexUserAccounts(
    userId: string,
    isActiveTrainings?: boolean,
  ): Promise<AccountEntity[]> {
    return await this.accountsRepository.findManyByUserId(
      userId,
      isActiveTrainings,
    );
  }
}
