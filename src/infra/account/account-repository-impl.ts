import Config from '../../common/config/config';
import AccountRepository from '../../application/account/account-repository';
import { LednAccount, AccountSearchCriteria } from '../../domain/ledn-account';
import fs from 'fs';
import StreamArray from 'stream-json/streamers/StreamArray';
import _ from 'lodash';

export default class AccountRepositoryImpl implements AccountRepository {
    constructor(private fileReader: typeof fs, private appConfig: Config) {}

    async getAccounts(
        accountSearchCriteria: AccountSearchCriteria
    ): Promise<LednAccount[]> {
        try {
            const rawData = new Array<LednAccount>();
            // getting the path of the json file (input) - change the value from infra.account.src -> infra.account.large-src to load the big json file.
            const jsonPath = this.appConfig.get<string>('infra.account.src');
            // reading the content of the file using StreamArray parser
            let accounts = await new Promise<LednAccount[]>(
                (resolve, reject) => {
                    const readStream = this.fileReader.createReadStream(
                        jsonPath
                    );
                    const pipeline = readStream.pipe(StreamArray.withParser());
                    // pushing the data we recieve into a variabl to be filtered/sorted after.
                    pipeline.on('data', data => {
                        rawData.push(data.value);
                    });
                    pipeline.on('end', () => {
                        resolve(rawData);
                    });
                    pipeline.on('error', err => {
                        reject(err);
                    });
                }
            );
            // checking the search criteria if it is defined or not
            if (accountSearchCriteria) {
                // fitlering by name (either if the name is in firstName or lastName field)
                if (accountSearchCriteria.name) {
                    accounts = _.filter(
                        accounts,
                        entry =>
                            entry.firstName
                                .toLowerCase()
                                .includes(
                                    accountSearchCriteria.name.toLowerCase()
                                ) ||
                            entry.lastName
                                .toLowerCase()
                                .includes(
                                    accountSearchCriteria.name.toLowerCase()
                                )
                    );
                }
                // filter by country (works upper or lower case)
                if (accountSearchCriteria.country) {
                    accounts = _.filter(accounts, entry => {
                        if (entry.country) {
                            // ignore field with null value
                            return (
                                entry.country.toLowerCase() ===
                                accountSearchCriteria.country.toLowerCase()
                            );
                        }
                    });
                }
                // filter by mfa field (works upper or lower case)
                if (accountSearchCriteria.mfa) {
                    accounts = _.filter(accounts, entry => {
                        if (entry.mfa) {
                            // ignore field with null value
                            return (
                                entry.mfa ===
                                accountSearchCriteria.mfa.toUpperCase()
                            );
                        }
                    });
                }
                // // sorting by a specified field
                if (accountSearchCriteria.sortField) {
                    accounts.sort((a, b) => {
                        return a[accountSearchCriteria.sortField] <
                            b[accountSearchCriteria.sortField]
                            ? -1
                            : 1;
                    });
                }
            }
            return accounts;
        } catch (err) {
            throw new Error(`Error Processing the file! ${err}`);
        }
    }
}
