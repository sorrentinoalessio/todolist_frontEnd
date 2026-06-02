import * as chai from 'chai';
const { expect } = chai;
import chaiHttp, { request } from 'chai-http';
import app from '../../../server.js';
import mongoose from 'mongoose';
import CryptoUtils from '../../../src/utils/CryptoUtils.js';
import fixturesUtils from '../../fixtures/fixturesUtils.js';


const objectId = mongoose.Types.ObjectId;
chai.use(chaiHttp);

describe('Update activity controller tests', () => {
    beforeEach(async () => {
        await fixturesUtils.clearDb();
    });

    describe('PATCH update activity failure', () => {
        it('Should return 404 if activityId is not valid', async () => {
            const user = {
                _id: new objectId(),
                name: 'Test user'
            }
            const token = CryptoUtils.generateToken(user, 86400);
            const res = await request.execute(app)
                .patch('/invalidId/update')
                .set('Authorization', `Bearer ${token}`)
                .send();
            expect(res.status).eq(404);
        })
        it('Should return 404 if token is not provided', async () => {
            const activityId = new objectId();
            const res = await request.execute(app).patch(`/${activityId}/update`).send();
            expect(res.status).eq(404);
        })
        it('Should return 404 if token is not valid', async () => {
            const activityId = new objectId();
            const token = 'fake token';
            const res = await request.execute(app).patch(`/${activityId}/update`).set('Authorization', `Bearer ${token}`).send();
            expect(res.status).eq(404);
        })

        it('Should return 404 if activity does not exists in db', async () => {
            const user = await fixturesUtils.createUser({}, true);

            const token = CryptoUtils.generateToken(user, 86400);
            const activityIdWrong = new objectId().toString();

            const res = await request.execute(app)
                .patch(`/${activityIdWrong}`)
                .set('Authorization', `Bearer ${token}`)
                .send();

            expect(res.status).eq(404);
            expect(res.body.message).to.eq(`error: activity ${activityIdWrong} not found`);


        })


    })
    describe('PATCH update activity success', () => {
        it('Should return 200', async () => {

            const user = await fixturesUtils.createUser({}, true);
            const activity = await fixturesUtils.createActivity({
                ownerId: user._id.toString(),
                name: "nameUpdate3",
                description: "descriptionUpdate3"

            }, true);

            const token = CryptoUtils.generateToken(user, 86400);
            const res = await request.execute(app)
                .patch(`/${activity._id.toString()}`)
                .set('Authorization', `Bearer ${token}`)
                .send();

            expect(res.status).eq(200);
            expect(res.body._id).eq(activity._id.toString());
            expect(res.body.ownerId).eq(user._id.toString());
        })

    })
});



