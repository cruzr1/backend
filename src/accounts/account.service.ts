import { CreateAccountDto } from './dto/create-account.dto';
import { AccountEntity } from './account.entity';
import { AccountsRepository } from './accounts.repository';

export class AccountsService {
  constructor(private readonly accountsRepository: AccountsRepository) {}

  public async createNewAccount(dto: CreateAccountDto): Promise<AccountEntity> {
    const newAccount = new AccountEntity({ ...dto });
    return await this.accountsRepository.save(newAccount);
  }
}
