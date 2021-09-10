import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { createSandbox } from 'sinon';
import AccountHandler from '../../../src/web/account-handler';

import { Response } from 'express';
import { JsonFormatter } from '../../../src/web/json-formatter';
import { LednAccount, MFA } from '../../../src/domain/ledn-account';

chai.use(sinonChai);

describe('AccountHandler', () => {
    const lednAccounts: LednAccount[] = [
        {
            firstName: 'Emily',
            lastName: 'Smith',
            country: 'CA',
            email: 'Rollin43@hotmail.com',
            dob: '1967-05-05T13:14:32.526Z',
            mfa: MFA.SMS,
            amt: 962169704,
            createdDate: '2020-08-15T20:07:24.157Z',
            referredBy: null
        },
        {
            firstName: 'Warren',
            lastName: 'Emmerich',
            country: 'CA',
            email: 'Fabian.Wolf@yahoo.com',
            dob: '1951-12-17T20:37:27.065Z',
            mfa: MFA.TOTP,
            amt: 397834067,
            createdDate: '2020-08-29T03:58:45.274Z',
            referredBy: null
        },
        {
            firstName: 'Deion',
            lastName: 'Doyle',
            country: 'CA',
            email: 'Lawrence.Stroman@yahoo.com',
            dob: '1972-08-09T03:54:01.610Z',
            mfa: MFA.SMS,
            amt: 504277192,
            createdDate: '2019-01-12T20:48:03.239Z',
            referredBy: null
        }
    ];
    let accountHandler: AccountHandler;
    const sandbox = createSandbox();
    const accountService: any = {
        getAccounts: sandbox.stub()
    };
    const req: any = {
        query: {
            country: 'CA',
            mfa: 'SMS',
            name: 'Adrian',
            sortField: 'amt'
        }
    };
    const res: Response & JsonFormatter = {
        formattedJson: sandbox.stub()
    } as any;
    const next: any = sandbox.stub();
    beforeEach(() => {
        accountHandler = new AccountHandler(accountService);
    });
    afterEach(() => {
        sandbox.reset();
    });

    describe('handleGetAccounts', () => {
        describe('When operation is successfull!', () => {
            beforeEach(() => {
                accountService.getAccounts.resolves(lednAccounts);
            });
            it('should return accounts', async () => {
                await accountHandler.handleGetAccounts(req, res, next);
                expect(res.formattedJson).to.have.been.calledWith(
                    undefined,
                    lednAccounts
                );
            });
        });
        describe('When the operation fails', () => {
            beforeEach(() => accountService.getAccounts.rejects('OHHHHHHHH'));

            it('should call next()', async () => {
                await accountHandler.handleGetAccounts(req, res, next);
                expect(next).to.have.callCount(1);
            });
        });
    });
});
