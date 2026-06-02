import { expect } from 'chai';
import fixturesUtils from '../../tests/fixtures/fixturesUtils.js';
import SocketFixtures from '../../tests/fixtures/SocketFixtures.js';
import sinon from 'sinon';
import { actions } from '../../src/constants/const.js';
import e from 'express';


const sandbox = sinon.createSandbox();

let client;
let user;

describe('ADD activity test', () => {
    afterEach(async () => {
        sandbox.restore();
        await fixturesUtils.clearDb();
    });

    beforeEach(async () => {
        user = await fixturesUtils.createUser({});
        client = SocketFixtures.createClient(user);
        client.connect();
    });

    describe('ADD activity success', () => {
        it('Should ADD activity', async () => {

            const activityData = {
                name: 'name test',
                description: 'description test',
                dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24)
            }

            await new Promise((resolve, reject) => {

                client.emit(actions.ADD_ACTIVITY, activityData, (data) => {
                    expect(data.result.data._id).to.exist;
                    expect(data.result.data.description).eq(activityData.description);
                    expect(data.result.data.name).eq(activityData.name);
                    console.log(data.result.data.ownerId)
                    expect(data.result.data.ownerId).eq(user._id.toString());
                    resolve();
                });
            });

            client.disconnect();
        })
    })
    describe('ADD activity fail', () => {
        it('Should fail if name is missing', async () => {

            const activityData = {
            }

            await new Promise((resolve, reject) => {

                client.emit(actions.ADD_ACTIVITY, activityData, (data) => {
                    expect(data.result.success).to.be.false;
                    expect(data.result.error).eq('"name" is required');
                    resolve();
                });
            });

            client.disconnect();
        })


        it('Should fail if describe is missing', async () => {

            const activityData = {
                name: 'name test',
                dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24)

            }

            await new Promise((resolve, reject) => {

                client.emit(actions.ADD_ACTIVITY, activityData, (data) => {
                    expect(data.result.success).to.be.false;
                    expect(data.result.error).eq('"description" is required');
                    resolve();
                });
            });

            client.disconnect();
        })


        it('Should fail if dueDate is invalid date', async () => {

            const activityData = {
                name: 'name test',
                description: 'description test',
                dueDate: ''

            }

            await new Promise((resolve, reject) => {

                client.emit(actions.ADD_ACTIVITY, activityData, (data) => {
                    expect(data.result.success).to.be.false;
                    expect(data.result.error).eq('"dueDate" must be a valid date');
                    resolve();
                });
            });

            client.disconnect();
        })


        it('Should fail if status is not open or closed', async () => {

            const activityData = {
                name: 'name test',
                description: 'description test',
                dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
                status: 'complete'

            }

            await new Promise((resolve, reject) => {

                client.emit(actions.ADD_ACTIVITY, activityData, (data) => {
                    expect(data.result.success).to.be.false;
                    expect(data.result.error).eq('"status" must be one of [open, closed]');
                    resolve();
                });
            });

            client.disconnect();
        })
    })
})