import config from 'config';
import jsonFormatter from './web/json-formatter';
import Config from './common/config/config';
import AccountServiceImpl from './application/account/account-service-impl';
import AccountHandler from './web/account-handler';
import AccountRepositoryImpl from './infra/account/account-repository-impl';
import fs from 'fs';
export interface Container {
    [key: string]: any;
}

async function containerFactory(override: Container = {}): Promise<Container> {
    const appConfig: Config = config;
    const accountRepository = new AccountRepositoryImpl(fs, appConfig);
    const accountService = new AccountServiceImpl(accountRepository);
    const accountHandler = new AccountHandler(accountService);

    // Return the singletons that is needed to setup the app
    return {
        appConfig,
        jsonFormatter: jsonFormatter(),
        accountHandler
    };
}

export default containerFactory;
