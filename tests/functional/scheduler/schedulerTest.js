import * as chai from 'chai';
const { expect } = chai;
//import app from '../../../server.js';
import mongoose from 'mongoose';
import { SchedulerService } from '../../../src/services/schedulerService.js';
import fixturesUtils from '../../fixtures/fixturesUtils.js';
import sinon from 'sinon';
import mailService from '../../../src/services/mailService.js';
import activityRepository from '../../../src/repository/ActivityRepository.js'
import { activityStatus } from '../../../src/constants/const.js';

const objectId = mongoose.Types.ObjectId;
let sandbox;

describe('Scheduler test', () => {
    beforeEach(() => {

        sandbox = sinon.createSandbox();

    });
    afterEach(async () => {
        await fixturesUtils.clearDb();
        sandbox.restore();

    });

    describe('Scheduler success test', () => {
        it('Should call mailer once when activities have passed dueDate for the same user', async () => {
            const user = await fixturesUtils.createUser(
                { email: "first@gmail.com" },
                true
            );
            const user2 = await fixturesUtils.createUser(
                { email: "second@gmail.com" },
                true
            );


            const activity1 = await fixturesUtils.createActivity({
                ownerId: user._id.toString(),
                name: 'Test Activity',
                description: 'This is a test activity',
                dueDate: new Date(Date.now() - 1000 * 60 * 60)
            }, true);


            const activity2 = await fixturesUtils.createActivity({
                ownerId: user._id.toString(),
                name: 'Test Activity2',
                description: 'This is a test activity',
                dueDate: new Date(Date.now() + 1000 * 60 * 60)
            }, true);

            const activity3 = await fixturesUtils.createActivity({
                ownerId: user2._id.toString(),
                name: 'Test Activity',
                description: 'This is a test activity',
                dueDate: new Date(Date.now() - 1000 * 60 * 60)
            }, true);

            const activity4 = await fixturesUtils.createActivity({
                ownerId: user2._id.toString(),
                name: 'Test Activity',
                description: 'This is a test activity',
                dueDate: new Date(Date.now() - 1000 * 60 * 60)
            }, true);

            const scheduler = new SchedulerService();

            const mailStub = sandbox.stub(mailService, 'sendActivityOverdueMail').callsFake((email, activities) => {
                return Promise.resolve();

            });

            await scheduler.getJob();
            await scheduler.exec();
            expect(mailStub.callCount).to.eq(2); //errore deve essere 2

        });

        it('Should call mailer once when activities have dueDate and status of one activity at least one is not open for the same user', async () => {
            const user = await fixturesUtils.createUser(
                { email: "second@gmail.com" },
                true
            );

            const activity1 = await fixturesUtils.createActivity({
                ownerId: user._id.toString(),
                name: 'Test Activity',
                description: 'This is a test activity',
                status: activityStatus.COMPLETED,
                dueDate: new Date(Date.now() - 1000 * 60 * 60)
            }, true);


            const activity2 = await fixturesUtils.createActivity({
                ownerId: user._id.toString(),
                name: 'Test Activity2',
                description: 'This is a test activity',
                dueDate: new Date(Date.now() - 1000 * 60 * 60)
            }, true);

            const scheduler = new SchedulerService();
            const mailStub = sandbox.stub(mailService, 'sendActivityOverdueMail').callsFake((email, activities) => {
                return Promise.resolve();
            });

            await scheduler.getJob();
            await scheduler.exec();
            expect(mailStub.calledOnce).to.eq(true);
        });

    })

    describe('Scheduler error', () => {
        it('Should call not mailer once when activities have dueDate for the same user', async () => {
            const user = await fixturesUtils.createUser(
                { email: "second@gmail.com" },
                true
            );

            const activity1 = await fixturesUtils.createActivity({
                ownerId: user._id.toString(),
                name: 'Test Activity',
                description: 'This is a test activity',
                dueDate: new Date(Date.now() + 1000 * 60 * 60)
            }, true);


            const activity2 = await fixturesUtils.createActivity({
                ownerId: user._id.toString(),
                name: 'Test Activity2',
                description: 'This is a test activity',
                dueDate: new Date(Date.now() + 1000 * 60 * 60)
            }, true);

            const scheduler = new SchedulerService();
            const mailStub = sandbox.stub(mailService, 'sendActivityOverdueMail').callsFake((email, activities) => {
                return Promise.resolve();
            });

            await scheduler.getJob();
            await scheduler.exec();
            expect(mailStub.calledOnce).to.eq(false);
        });

        it('Should call not mailer once when activities have dueDate and status of one activity is not open for the same user', async () => {
            const user = await fixturesUtils.createUser(
                { email: "second@gmail.com" },
                true
            );

            const activity1 = await fixturesUtils.createActivity({
                ownerId: user._id.toString(),
                name: 'Test Activity',
                description: 'This is a test activity',
                status: activityStatus.COMPLETED,
                dueDate: new Date(Date.now() - 1000 * 60 * 60)
            }, true);


            const activity2 = await fixturesUtils.createActivity({
                ownerId: user._id.toString(),
                name: 'Test Activity2',
                description: 'This is a test activity',
                status: activityStatus.COMPLETED,
                dueDate: new Date(Date.now() - 1000 * 60 * 60)
            }, true);

            const scheduler = new SchedulerService();
            const mailStub = sandbox.stub(mailService, 'sendActivityOverdueMail').callsFake((email, activities) => {
                return Promise.resolve();
            });

            await scheduler.getJob();
            await scheduler.exec();
            expect(mailStub.calledOnce).to.eq(false);
        });


        it('Should call not mailer when activities not have user', async () => {
            const user2 = [];
            const fakeIdUser = "6962d917885d52fbd401b1d3";

            const activity1 = await fixturesUtils.createActivity({
                ownerId: fakeIdUser,
                name: 'Test Activity',
                description: 'This is a test activity',
                dueDate: new Date(Date.now() - 1000 * 60 * 60)
            }, true);


            const activity2 = await fixturesUtils.createActivity({
                ownerId: fakeIdUser,
                name: 'Test Activity2',
                description: 'This is a test activity',
                dueDate: new Date(Date.now() - 1000 * 60 * 60)
            }, true);

            const scheduler = new SchedulerService();
            const mailStub = sandbox.stub(mailService, 'sendActivityOverdueMail').callsFake((email, activities) => {
                return Promise.resolve();
            });

            await scheduler.getJob();
            await scheduler.exec();
            expect(mailStub.calledOnce).to.eq(false);
        });

        it('Should handle empty activities array', async () => {
            const scheduler = new SchedulerService();
            const mailStub = sandbox.stub(mailService, 'sendActivityOverdueMail');

            await scheduler.getJob();
            await scheduler.exec();
            expect(mailStub.notCalled).to.eq(true);

        });

    })
});