import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import { createSandbox } from 'sinon';
import AccountRepositoryImpl from '../../../../src/infra/account/account-repository-impl';
import { EventEmitter } from 'events';
import {
    AccountSearchCriteria,
    LednAccount,
    MFA
} from '../../../../src/domain/ledn-account';

chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('AccountRepositoryImpl', () => {
    const lednAccountA: LednAccount = {
        firstName: 'Emily',
        lastName: 'Smith',
        country: 'CA',
        email: 'Rollin43@hotmail.com',
        dob: '1967-05-05T13:14:32.526Z',
        mfa: MFA.SMS,
        amt: 962169704,
        createdDate: '2020-08-15T20:07:24.157Z',
        referredBy: null
    };
    const lednAccountB: LednAccount = {
        firstName: 'Mike',
        lastName: 'Banning',
        country: 'CA',
        email: 'testMike@hotmail.com',
        dob: '1945-05-05T13:14:32.526Z',
        mfa: MFA.SMS,
        amt: 2169704,
        createdDate: '2021-08-15T20:07:24.157Z',
        referredBy: null
    };
    let accountRepositoryImpl: AccountRepositoryImpl;
    let emitter: EventEmitter;
    const sandbox = createSandbox();
    const config: any = {
        get: sandbox.stub()
    };
    const readFileStream: any = {
        pipe: sandbox.stub()
    };
    const fileReader: any = {
        createReadStream: sandbox.stub()
    };
    const onEvent = sandbox.stub();
    const pipeline: any = {
        on: onEvent
    };
    const accountSearchCriteria: AccountSearchCriteria = {
        country: 'CA',
        mfa: MFA.SMS,
        sortField: 'amt'
    };
    beforeEach(async () => {
        emitter = new EventEmitter();
        onEvent.callsFake((event, callback) => emitter.on(event, callback));
        config.get.returns('');
        readFileStream.pipe.returns(pipeline);
        fileReader.createReadStream.returns(readFileStream);
        accountRepositoryImpl = new AccountRepositoryImpl(fileReader, config);
    });
    afterEach(() => {
        sandbox.reset();
    });
    describe('getAccounts', () => {
        describe('Success path - with search criteria', () => {
            it('should return result', async () => {
                const stream = accountRepositoryImpl.getAccounts(
                    accountSearchCriteria
                );
                await Promise.resolve();
                await Promise.resolve();
                emitter.emit('data', { key: 0, value: lednAccountA });
                emitter.emit('end');
                const result = await stream;
                expect(result[0]).to.eql(lednAccountA);
            });
            it('should return result with Two sorted entries', async () => {
                const stream = accountRepositoryImpl.getAccounts(
                    accountSearchCriteria
                );
                await Promise.resolve();
                await Promise.resolve();
                emitter.emit('data', { key: 0, value: lednAccountA });
                emitter.emit('data', { key: 1, value: lednAccountB });
                emitter.emit('end');
                const result = await stream;
                expect(result.length).to.eql(2);
            });
            it('should return result with one sorted entry (filter by name)', async () => {
                accountSearchCriteria.name = 'Emily';
                const stream = accountRepositoryImpl.getAccounts(
                    accountSearchCriteria
                );
                await Promise.resolve();
                await Promise.resolve();
                emitter.emit('data', { key: 0, value: lednAccountA });
                emitter.emit('data', { key: 1, value: lednAccountB });
                emitter.emit('end');
                const result = await stream;
                expect(result.length).to.eql(1);
                expect(
                    result[0].firstName + ' ' + result[0].lastName
                ).to.includes(accountSearchCriteria.name);
            });
            it('should return result - no mfa field', async () => {
                delete accountSearchCriteria.mfa;
                const stream = accountRepositoryImpl.getAccounts(
                    accountSearchCriteria
                );
                await Promise.resolve();
                await Promise.resolve();
                emitter.emit('data', { key: 0, value: lednAccountA });
                emitter.emit('data', { key: 1, value: lednAccountB });
                emitter.emit('end');
                const result = await stream;
                expect(result.length).to.eql(1);
            });
            it('should return two un-sorted entries - without sortField', async () => {
                const stream = accountRepositoryImpl.getAccounts({
                    country: 'CA',
                    mfa: MFA.SMS
                });
                await Promise.resolve();
                await Promise.resolve();
                emitter.emit('data', { key: 0, value: lednAccountA });
                emitter.emit('data', { key: 1, value: lednAccountB });
                emitter.emit('end');
                const result = await stream;
                expect(result.length).to.eql(2);
            });
            it('should return two entries - without country field', async () => {
                const stream = accountRepositoryImpl.getAccounts({
                    mfa: MFA.SMS
                });
                await Promise.resolve();
                await Promise.resolve();
                emitter.emit('data', { key: 0, value: lednAccountA });
                emitter.emit('data', { key: 1, value: lednAccountB });
                emitter.emit('end');
                const result = await stream;
                expect(result.length).to.eql(2);
            });
            it('should return one entry - when country is null', async () => {
                lednAccountA.country = null;
                const stream = accountRepositoryImpl.getAccounts({
                    country: 'CA',
                    mfa: MFA.SMS
                });
                await Promise.resolve();
                await Promise.resolve();
                emitter.emit('data', { key: 0, value: lednAccountA });
                emitter.emit('data', { key: 1, value: lednAccountB });
                emitter.emit('end');
                const result = await stream;
                expect(result.length).to.eql(1);
            });
            it('should return one entry - when mfa is null', async () => {
                lednAccountA.mfa = null;
                const stream = accountRepositoryImpl.getAccounts({
                    country: 'CA',
                    mfa: MFA.SMS
                });
                await Promise.resolve();
                await Promise.resolve();
                emitter.emit('data', { key: 0, value: lednAccountA });
                emitter.emit('data', { key: 1, value: lednAccountB });
                emitter.emit('end');
                const result = await stream;
                expect(result.length).to.eql(1);
            });
            it('should return two entries - when search criteria is null', async () => {
                const stream = accountRepositoryImpl.getAccounts(null);
                await Promise.resolve();
                await Promise.resolve();
                emitter.emit('data', { key: 0, value: lednAccountA });
                emitter.emit('data', { key: 1, value: lednAccountB });
                emitter.emit('end');
                const result = await stream;
                expect(result.length).to.eql(2);
            });
        });
        describe('Fail path - with errors', () => {
            it('should be rejected with error', () => {
                setTimeout(() => {
                    emitter.emit('error', new Error('Error reading file!'));
                }, 1);
                expect(
                    accountRepositoryImpl.getAccounts(accountSearchCriteria)
                ).to.be.eventually.rejectedWith(
                    Error,
                    'Error Processing the file!'
                );
            });
        });
    });
});
