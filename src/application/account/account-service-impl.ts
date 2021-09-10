import AccountRepository from './account-repository';
import AccountService from './account-service';
import { LednAccount, AccountSearchCriteria } from '../../domain/ledn-account';

export default class AccountServiceImpl implements AccountService {
    public constructor(private accountRepo: AccountRepository) {}
    async getAccounts(
        accountsSearchCriteria: AccountSearchCriteria
    ): Promise<LednAccount[]> {
        return await this.accountRepo.getAccounts(accountsSearchCriteria);
    }
}
