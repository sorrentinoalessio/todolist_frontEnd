import * as chai from 'chai';
const { expect } = chai;
import chaiHttp, { request } from 'chai-http';
import app from '../../../server.js';
import mongoose from 'mongoose';
import CryptoUtils from '../../../src/utils/CryptoUtils.js';
import { activityStatus } from '../../../src/constants/const.js';
import fixturesUtils from '../../fixtures/fixturesUtils.js';

const objectId = mongoose.Types.ObjectId;
chai.use(chaiHttp);

describe('GET activity controller tests', () => {
    beforeEach(async () => {
        await fixturesUtils.clearDb();
    });

    describe('GET activity failure', () => {
        it('Should return 401 if token is not provided', async () => {
            const activityId = new objectId();
            const res = await request.execute(app).get(`/id`).send();
            expect(res.status).eq(401);
        })
        it('Should return 401 if token is not valid', async () => {
            const activityId = new objectId();
            const token = 'fake token';
            const res = await request.execute(app).get(`/id`).set('Authorization', `Bearer ${token}`).send();
            expect(res.status).eq(401);
        })
    })
    describe('GET activity success', () => {
        it('Should return 200 if activity exist', async () => {

            const user = await fixturesUtils.createUser({}, true);
            const activity1 = await fixturesUtils.createActivity({
                ownerId: user._id.toString()
            }, true);
            const activity2 = await fixturesUtils.createActivity({
                ownerId: user._id.toString(),
            }, true);

            const token = CryptoUtils.generateToken(user, 86400);
            const res = await request.execute(app)
                .get(`/${activity1._id}`)
                .set('Authorization', `Bearer ${token}`)
                .send();
            expect(res.status).eq(200);
         })
    })
});



