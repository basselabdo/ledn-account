import { NextFunction, Request, Response } from 'express';
import { AccountSearchCriteria } from '../domain/ledn-account';
import AccountService from '../application/account/account-service';
import _ from 'lodash';
import { JsonFormatter } from './json-formatter';

export default class AccountHandler {
    constructor(private accountService: AccountService) {}

    public async handleGetAccounts(
        req: Request,
        res: Response & JsonFormatter,
        next: NextFunction
    ): Promise<void> {
        try {
            // extracting the query parameters
            const { country, mfa, name, sortField }: any = req.query;
            const accountSearchCriteria: AccountSearchCriteria = {
                country,
                mfa,
                name,
                sortField
            };
            const accounts = await this.accountService.getAccounts(
                _.omitBy(accountSearchCriteria, _.isNil) // removing the fields with null/undefined values from accountSearchCriteria
            );
            // calling formattedJson to format the response and encapsulate it with data bag
            res.formattedJson(undefined, accounts);
        } catch (err) {
            next(err);
        }
    }
}
