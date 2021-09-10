import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import { createSandbox } from 'sinon';
import AccountServiceImpl from '../../../../src/application/account/account-service-impl';

import {
    AccountSearchCriteria,
    LednAccount,
    MFA
} from '../../../../src/domain/ledn-account';

chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('AccountServiceImpl', () => {
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
    const accountSearchCriteria: AccountSearchCriteria = {
        country: 'CA',
        mfa: 'SMS'
    };
    let accountServiveImpl: AccountServiceImpl;
    const sandbox = createSandbox();
    const accountRepository: any = {
        getAccounts: sandbox.stub()
    };
    beforeEach(() => {
        accountServiveImpl = new AccountServiceImpl(accountRepository);
    });
    afterEach(() => {
        sandbox.reset();
    });
    describe('getAccounts', () => {
        describe('when operation is successful', () => {
            beforeEach(() => {
                accountRepository.getAccounts
                    .withArgs(accountSearchCriteria)
                    .resolves(lednAccounts);
            });
            it('should return success', async () => {
                const result = await accountServiveImpl.getAccounts(
                    accountSearchCriteria
                );
                expect(result).to.eql(lednAccounts);
            });
        });
        describe('when operation fails!', () => {
            const err = new Error('nop');
            beforeEach(() => {
                accountRepository.getAccounts.rejects(err);
            });
            it('should throw an error', () => {
                return expect(
                    accountServiveImpl.getAccounts(accountSearchCriteria)
                ).to.eventually.be.rejectedWith(Error, 'nop');
            });
        });
    });
});
