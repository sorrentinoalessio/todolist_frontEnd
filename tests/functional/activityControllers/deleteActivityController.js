import * as chai from 'chai';
const { expect } = chai;
import chaiHttp, { request } from 'chai-http';
import app from '../../../server.js';
import mongoose from 'mongoose';
import CryptoUtils from '../../../src/utils/CryptoUtils.js';
import { activityStatus } from '../../../src/constants/const.js';
import fixturesUtils from '../../fixtures/fixturesUtils.js';
import Sinon from 'sinon';


const objectId = mongoose.Types.ObjectId;
chai.use(chaiHttp);

describe('Delete activity controller tests', () => {
    beforeEach(async () => {
        await fixturesUtils.clearDb();
    });

    describe('DELETE remove activity failure', () => {
        it('Should return 404 if activityId is not valid', async () => {
            const user = {
                _id: new objectId(),
                name: 'Test user'
            }
            const token = CryptoUtils.generateToken(user, 86400);
            const res = await request.execute(app)
                .delete('/invalidId/remove')
                .set('Authorization', `Bearer ${token}`)
                .send();
            expect(res.status).eq(404);
        })
        it('Should return 404 if token is not provided', async () => {
            const activityId = new objectId();
            const res = await request.execute(app).delete(`/${activityId}/remove`).send();
            expect(res.status).eq(404);
        })
        it('Should return 404 if token is not valid', async () => {
            const activityId = new objectId();
            const token = 'fake token';
            const res = await request.execute(app).delete(`/${activityId}/remove`).set('Authorization', `Bearer ${token}`).send();
            expect(res.status).eq(404);
        })

    })

    describe('DELETE remove activity success', () => {
        it('Should return 200', async () => {

            const user = await fixturesUtils.createUser({}, true);
            const activity = await fixturesUtils.createActivity({
                ownerId: user._id.toString(),
            }, true);

            const token = CryptoUtils.generateToken(user, 86400);
            const res = await request.execute(app)
                .delete(`/${activity._id.toString()}`)
                .set('Authorization', `Bearer ${token}`)
                .send();
            
            expect(res.status).eq(200);
        })

    })
});



