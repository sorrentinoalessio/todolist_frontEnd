import * as chai from 'chai';
const { expect } = chai;
import chaiHttp, { request } from 'chai-http';
import app from '../../../server.js';
import mongoose from 'mongoose';
import fixturesUtils from '../../fixtures/fixturesUtils.js';
import sinon from 'sinon';
import mailer, { createTransport } from 'nodemailer';
import cryptoUtils from '../../../src/utils/CryptoUtils.js'
import userSchema from '../../../src/schemas/userSchema.js';
import { userStatus } from '../../../src/constants/const.js';



const sandbox = sinon.createSandbox();

const objectId = mongoose.Types.ObjectId;
chai.use(chaiHttp);

describe('Add user controller tests', () => {
    afterEach(async () => {
        sandbox.restore();
        await fixturesUtils.clearDb();
    })

    describe('post add User failure', () => {
        it('Should return 400 if name is not defined', async () => {
            const userData = {
                email: 'test1@gmail.com',
                password: 'Test user'
            }
            const res = await request.execute(app)
                .post('/user')
                .send(userData);
            expect(res.status).eq(400);
            expect(res.body.message).eq('ValidationError: "name" is required');

        })
        it('Should return 400 if email is not defined', async () => {
            const userData = {
                name: 'nameTest',
                password: 'Test user'
            }
            const res = await request.execute(app)
                .post('/user')
                .send(userData);
            expect(res.status).eq(400);
            expect(res.body.message).eq('ValidationError: "email" is required');

        })
        it('Should return 400 if password is not defined', async () => {
            const userData = {
                name: 'nameTest',
                email: 'test2@gmail.com'
            }
            const res = await request.execute(app)
                .post('/user')
                .send(userData);

            expect(res.status).eq(400);
            expect(res.body.message).eq('ValidationError: "password" is required');

        })
        it('Should return 400 if email is valid', async () => {
            const userData = {
                name: 'nameTest',
                email: 'testgmail.com',
                password: 'passwordTest'
            }
            const res = await request.execute(app)
                .post('/user')
                .send(userData);
            expect(res.status).eq(400);
            expect(res.body.message).eq('ValidationError: "email" must be a valid email');

        })
        it('Should return 500 if email is exist', async () => {
            const user = await fixturesUtils.createUser({}, true);
            const userData = {
                name: 'nameTest',
                email: user.email,
                password: 'passwordTest'
            }
            const res = await request.execute(app)
                .post('/user')
                .send(userData);
            expect(res.status).eq(500);
            expect(res.body.message).eq('something went wrong');
        })
        it('Should return 400 if name is too short', async () => {
            const userData = {
                name: 'nt',
                email: 'test4@email.com',
                password: 'passwordTest'
            }
            const res = await request.execute(app)
                .post('/user')
                .send(userData);
            expect(res.status).eq(400);
            expect(res.body.message).eq('ValidationError: "name" length must be at least 3 characters long');
        })
        it('Should return 400 if password is too short', async () => {
            const userData = {
                name: 'nomeTest',
                email: 'test5@email.com',
                password: 'pw'
            }
            const res = await request.execute(app)
                .post('/user')
                .send(userData);
            expect(res.status).eq(400);
            expect(res.body.message).eq('ValidationError: "password" length must be at least 3 characters long');
        })
        it('Should return 400 if name is too long', async () => {
            const userData = {
                name: 'a'.repeat(260),
                email: 'test6@email.com',
                password: 'password'
            }
            const res = await request.execute(app)
                .post('/user')
                .send(userData);
            expect(res.status).eq(400);
            expect(res.body.message).eq('ValidationError: "name" length must be less than or equal to 256 characters long');
        })
    })
    describe('post add User success', () => {
        it('Should return 201 if status pending', async () => {
            const userData = {
                name: 'testname',
                email: 'test1@gmail.com',
                password: 'Test_user',

            }
            const sendMailStub = sandbox.stub().resolves({
                messageId: '1'
            });
            sandbox.stub(mailer, 'createTransport').returns({
                sendMail: sendMailStub
            });

            const res = await request.execute(app)
                .post('/user')
                .send(userData);
            expect(res.status).eq(201);
            expect(sendMailStub.calledOnce).eq(true);
            expect(sendMailStub.calledWithMatch({
                to: userData.email,
                subject: 'Conferma il tuo indirizzo email',
                from: sinon.match(values => values.includes('todolist service')),
                text: sinon.match(values => values.includes(`Ciao ${userData.name}`))
            }
            )).eq(true);


            const userInDb = await fixturesUtils.getUserFromId(res.body._id);
            expect(userInDb).to.not.be.null;
            expect(userInDb.name).eq(userData.name);
            expect(userInDb.email).eq(userData.email);

            const userPass = cryptoUtils.sha256(userData.password, userInDb.salt);
            expect(userPass).eq(userInDb.password);

        })

    });
});
describe('Add user confirm registration', () => {
    afterEach(async () => {
        sandbox.restore();
        await fixturesUtils.clearDb();
    })

    describe('GET add User failure', () => {
        it('Should return 404 if token invalid', async () => {
            const userData = await userSchema.create({
                registrationToken: "token_registr16c"
            });
            const tokenWrong = "token_wrong"
            const res = await request.execute(app)
                .get(`/user/${userData._id}/confirm/${tokenWrong}`)
                .send();
            expect(res.status).eq(400);
        })
        it('Should return 404 if id invalid', async () => {
            const userData = await userSchema.create({
                registrationToken: "token_registr16c"
            });
            const idWrong = "id_wrong"
            const res = await request.execute(app)
                .get(`/user/${idWrong}/confirm/${userData.registrationToken}`)
                .send();
            expect(res.status).eq(404);
        })
    })

    describe('GET User confirm', () => {
        it('Should return 200 id e token valid', async () => {
            const userData = await userSchema.create({
                registrationToken: "token_registr16c"
            });
            const res = await request.execute(app)
                .get(`/user/${userData._id}/confirm/${userData.registrationToken}`)
                .send();
            expect(res.status).eq(200);
        })


    });

});
describe('Login user controller tests', () => {
    afterEach(async () => {
        sandbox.restore();
        await fixturesUtils.clearDb();
    });

    describe('Post login failure', () => {
        it('Should return 401 if status is pending', async () => {
            const userData = await fixturesUtils.createUser({
                status: userStatus.PENDING
            }, true);
            const res = await request.execute(app)
                .post('/user/login')
                .send({
                    email: userData.email,
                    password: 'password'
                });
            expect(res.status).eq(401);

        })
        it('Should return 400 if email not valid', async () => {
            const userData = await fixturesUtils.createUser({
                email: "firs"
            }, true);
            const res = await request.execute(app)
                .post('/user/login')
                .send({
                    email: userData.email,
                    password: 'password'
                });
            expect(res.status).eq(400);

        })
        it('Should return 401 if email not exist', async () => {
            const userData = await fixturesUtils.createUser({
            }, true);
            const res = await request.execute(app)
                .post('/user/login')
                .send({
                    email: 'test2@gmail.com',
                    password: 'password'
                });
            expect(res.status).eq(401);

        })
        it('Should return 401 if password is incorrect', async () => {
            const userData = await fixturesUtils.createUser({
            }, true);

            const res = await request.execute(app)
                .post('/user/login')
                .send({
                    email: userData.email,
                    password: 'passwordIncorrect'
                });
            expect(res.status).eq(401);

        })
    })
    describe('Post login true', () => {
        afterEach(async () => {
            sandbox.restore();
            await fixturesUtils.clearDb();
        })
        it('Should return 200 if email and password is correct', async () => {
            const user = await fixturesUtils.createUser({
            }, true);

            const res = await request.execute(app)
                .post('/user/login')
                .send({
                    email: 'test@gmail.com',
                    password: 'password'
                });
            expect(res.status).eq(200);

        })
    });
});
describe('Login user for status pending send email', () => {
    afterEach(async () => {
        sandbox.restore();
        await fixturesUtils.clearDb();
    });

    describe('Post login failure', () => {
        it('Should return 401 if status is different pending', async () => {
            const userData = await fixturesUtils.createUser({
                status: userStatus.ACTIVE
            }, true);
            const res = await request.execute(app)
                .post('/user/pending')
                .send({
                    email: userData.email,
                    password: 'password'
                });
            expect(res.status).eq(401);

        })
        it('Should return 400 if email not valid', async () => {
            const userData = await fixturesUtils.createUser({
                email: "firs"
            }, true);
            const res = await request.execute(app)
                .post('/user/pending')
                .send({
                    email: userData.email,
                    password: 'password'
                });
            expect(res.status).eq(400);

        })
        it('Should return 401 if email not exist', async () => {
            const userData = await fixturesUtils.createUser({
            }, true);
            const res = await request.execute(app)
                .post('/user/pending')
                .send({
                    email: 'test2@gmail.com',
                    password: 'password'
                });
            expect(res.status).eq(401);

        })
        it('Should return 401 if password is incorrect', async () => {
            const userData = await fixturesUtils.createUser({
            }, true);

            const res = await request.execute(app)
                .post('/user/pending')
                .send({
                    email: userData.email,
                    password: 'passwordIncorrect'
                });
            expect(res.status).eq(401);

        })
    })
   describe('Post login pendig email true', () => {
        afterEach(async () => {
            sandbox.restore();
            await fixturesUtils.clearDb();
        })
        it('Should return 200 if email and password is correct and status is pending', async () => {
            const user = await fixturesUtils.createUser({
                    email: 'test@gmail.com',
                    status: userStatus.PENDING
            }, true);
            
            const sendMailStub = sandbox.stub().resolves({
                messageId: '1'
            });
            sandbox.stub(mailer, 'createTransport').returns({
                sendMail: sendMailStub
            });

            const res = await request.execute(app)
                .post('/user/pending')
                .send({
                    email: 'test@gmail.com',
                    password: 'password'
                });
            expect(res.status).eq(200);

        })
    });
});


