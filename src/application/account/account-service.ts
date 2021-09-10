import { LednAccount, AccountSearchCriteria } from '../../domain/ledn-account';

export default interface AccountService {
    getAccounts(
        accountSearchCriteria: AccountSearchCriteria
    ): Promise<LednAccount[]>;
}
