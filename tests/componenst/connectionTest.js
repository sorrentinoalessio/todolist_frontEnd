import { expect } from 'chai';
import fixturesUtils from '../fixtures/fixturesUtils.js'
import SocketFixtures from '../fixtures/SocketFixtures.js';
import sinon from 'sinon';


const sandbox = sinon.createSandbox();
afterEach(async () => {
        sandbox.restore();
        await fixturesUtils.clearDb();
    });


describe('Connection test', () => {
    
    describe('Connection successfully', () => {
        it('Should connect successfully', async () => {
            const user = await fixturesUtils.createUser({});
            const client = SocketFixtures.createClient(user);
            client.on('connect', (data) => {
                expect(client.connected).to.be.true;
                SocketFixtures.resultSynchronizer.increment();
                console.log('connected')
            });

            client.on('disconnect', (data) => {
                expect(client.connected).to.be.false;
                SocketFixtures.resultSynchronizer.increment();
                console.log('disconnected')
            });
            client.connect();
            await SocketFixtures.resultSynchronizer.wait(1);
            client.disconnect();
            await SocketFixtures.resultSynchronizer.wait(1);
            client.disconnect();
        })

        it('Should connect successfully and return the logged user', async () => {
            const user = await fixturesUtils.createUser({});
            const client = SocketFixtures.createClient(user);
            client.on('connect', (data) => {

                SocketFixtures.resultSynchronizer.increment();
                console.log('connected')
            });

            client.connect();

            await SocketFixtures.resultSynchronizer.wait(1);

            client.disconnect();
        })
    })
})