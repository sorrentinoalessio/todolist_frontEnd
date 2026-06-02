import * as chai from 'chai';
const { expect } = chai;
import chaiHttp, { request } from 'chai-http';
import app from '../../../server.js';
import mongoose from 'mongoose';
import CryptoUtils from '../../../src/utils/CryptoUtils.js';
import fixturesUtils from '../../fixtures/fixturesUtils.js';
import sinon from 'sinon';
const sandbox = sinon.createSandbox();
import * as activityService from '../../../src/services/activityService.js';


chai.use(chaiHttp);
describe.skip('Add activity controller tests', () => {
    afterEach(async () => {
        await fixturesUtils.clearDb();
        sandbox.restore();
    });

    describe('POST add activity failure', () => {
        it('Should return 400 if name is not defined', async () => {

            //Crea user
            const user = await fixturesUtils.createUser({}, true);
            const token = CryptoUtils.generateToken(user, 86400);

            //Crea payload per creare activity
            const activityData = {
                description: 'Test Description'
            };

            // POST con token e payload
            const res = await request.execute(app)
                .post('/')
                .set('Authorization', `Bearer ${token}`)
                .send(activityData)

            //Asserzioni
            expect(res.status).eq(400);
            expect(res.body.message).eq('ValidationError: "name" is required');
        })

        it('Should return 400 if description is not defined', async () => {

            //Crea user
            const user = await fixturesUtils.createUser({}, true);
            const token = CryptoUtils.generateToken(user, 86400);

            //Crea payload per creare activity
            const activityData = {
                name: 'Test Name'
            };

            // POST con token e payload
            const res = await request.execute(app)
                .post('/')
                .set('Authorization', `Bearer ${token}`)
                .send(activityData)

            //Asserzioni
            expect(res.status).eq(400);
            expect(res.body.message).eq('ValidationError: "description" is required');
        })

        it('Should return 401 if token is not provided', async () => {

            //Crea user
            //const user = await fixturesUtils.createUser({}, true);

            //Crea payload per creare activity (non serve perchè l'errore viene mandato prima)
            const activityData = {
                name: 'Test Name',
                description: 'Test Description'
            };

            // POST senza token e con payload
            const res = await request.execute(app)
                .post('/')
                .send(activityData)

            //Asserzioni
            expect(res.status).eq(401);
            //expect(res.body.ownerId).eq(undefined);
        })

        it('Should return 401 if token is not valid', async () => {

            //Crea fake token
            const token = null;

            //Crea payload per creare activity (non serve perchè l'errore viene mandato prima)
            const activityData = {
                name: 'Test Name',
                description: 'Test Description'
            };

            // POST con fake token e con payload
            const res = await request.execute(app)
                .post('/')
                .set('Authorization', `Bearer ${token}`)
                .send(activityData)

            //Asserzioni
            expect(res.status).eq(401);
            //expect(res.body.ownerId).eq(undefined);
        })

       
    })

    describe('POST add activity success', () => {
        it('Should return 201 and activity in status open', async () => {

            //Crea user
            const user = await fixturesUtils.createUser({}, true);
            const token = CryptoUtils.generateToken(user, 86400);

            //Crea payload per creare activity
            const activityData = {
                name: 'Test Name',
                description: 'Test Description',
                status: "open",
                dueDate: new Date(2025, 12, 25)
            };

            // POST con token e payload
            const res = await request.execute(app)
                .post('/')
                .set('Authorization', `Bearer ${token}`)
                .send(activityData)

            //Asserzioni
            expect(res.status).eq(201);
            expect(res.body._id).to.exist;
            expect(res.body.name).eq(activityData.name);
            expect(res.body.ownerId).eq(user._id.toString());
            expect(res.body.dueDate).eq(activityData.dueDate.toISOString());
        })
    })
})
