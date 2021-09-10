import { LednAccount, AccountSearchCriteria } from '../../domain/ledn-account';

export default interface AccountRepository {
    getAccounts(
        accountSearchCriteria: AccountSearchCriteria
    ): Promise<LednAccount[]>;
}
