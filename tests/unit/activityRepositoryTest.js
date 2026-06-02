import { expect } from 'chai';
import activityRepository from '../../src/repository/ActivityRepository.js';
import mongoose from 'mongoose';
import sinon from 'sinon';
import activitySchema from '../../src/schemas/activitySchema.js';

const sandbox = sinon.createSandbox();
const objectId = mongoose.Types.ObjectId;

describe('Activity Repository Unit Tests', () => {

    afterEach(() => {
        sandbox.restore();
    });

    describe('complete()', () => {
        it('Should set activity status completed', async () => {
            const userId = new objectId();                                  // Crea un objectId fake per simulare l'id di un utente che possiede l'attività
            sandbox.stub(activitySchema, 'findOneAndUpdate').resolves({     // Invece di accedere al db, crea uno stub che restituisce una fake attività con i seguenti campi:
                _id: new objectId(),        // Id dell'attività
                ownerId: userId,            // Id dell'utente a cui appartiene l’attività
                name: 'Test Activity',
                description: 'This is a test activity',
                status: 'completed',
                toObject: function() { return this; }
            });
            const activity = await activityRepository.complete(new objectId().toString(), userId.toString()); // Chiama metodo complete() del repository con i suoi parametri
            expect(activity.status).to.equal('completed');      // Verifica che lo status restituito sia completed
            expect(activity.ownerId.toString()).to.equal(userId.toString());    // Verifica che l’attività restituita appartenga all’utente corretto
        });
        it('Should throw not found exception if activity not found', async () => {
            const userId = new objectId();
            sandbox.stub(activitySchema, 'findOneAndUpdate').resolves(null);    // Stub di findOneAndUpdate che restituisce null, simulando attività non trovata
            try {
                await activityRepository.complete(new objectId().toString(), userId.toString());    // Chiama complete() su un’attività che non esiste per testare la gestione dell’errore
            } catch(err) {
                expect(err.message).to.equal('activity not found');     // Verifica che il messaggio dell’errore sia quello previsto
                return;
            }
            expect.fail('Expected exception was not thrown');   // Se arriva qua (il catch non scatta) significa che non è stato lasciato l'errore, quindi TEST FALLITO

        });
    })

    describe('add()', () => {
        it('Should create a new activity with correct properties', async () => {
            const userId = new objectId();      // Simula id utente
            const content = {       // Simula un oggetto content con i campi neccessari dell'attività
                name: 'Activity name',
                description: 'This is a test activity',
                ownerId: userId
            }
            sandbox.stub(activitySchema, 'create').resolves({       // Stub che restituisce una fake attività con: id attività e content
                toObject: () => { 
                    return {
                        _id: new objectId(),
                        ...content,
                    }; 
                },
            });
            const activity = await activityRepository.add(content);     // Chiama il metodo add() del repository con il contenuto dell’attività
            expect(activity.name).to.equal(content.name);       // Verifica che il nome restituito sia quello che abbiamo passato
            expect(activity.description).to.equal(content.description);     // Verifica che la descrizione restituita sia quella che abbiamo passato
            expect(activity.ownerId.toString()).to.equal(userId.toString());        // Verifica che l’attività appartenga all’utente finto confrontando ownerId con userId
        });

        it('Should throw domain exception if database fails on add', async () => {
            const userId = new objectId();
            const content = {
                name: 'Activity name',
                description: 'This is a test activity',
                ownerId: userId
            }

            sandbox.stub(activitySchema, 'create').rejects(new Error('DB error'));     // Simula un errore del database quando viene chiamato create

            try {
                await activityRepository.add(content);
            } catch(err) {
                expect(err.message).to.equal(`something went wrong: DB error`);     // Verifica che il messaggio dell’errore sia quello previsto
                expect(err.status).eq(500);
                return;
            }
            expect.fail('Expected exception was not thrown');
        });
    })

    describe('getById()', () => {
        it('Should return the activity with the correct activity ID and owner ID', async () => {
            const userId = new objectId();
            
            const content = {
                _id: new objectId(),
                ownerId: userId,
                name: 'Test Activity',
                description: 'This is a test activity',
            }
            sandbox.stub(activitySchema, 'findOne').resolves({      // Stub che restituisce una fake attività completa
                toObject: function() { return content; }
            });

            const activity = await activityRepository.getById(content._id.toString(), userId.toString());    // Chiama getById() passando gli i due ID

            expect(activity._id.toString()).to.equal(content._id.toString())     // Controlla che l'ID dell'attività restituita corrisponda a quello finto
            expect(activity.ownerId.toString()).to.equal(userId.toString());    // Controlla che l'ID dell'utente proprietario sia corretto
            expect(activity.name).to.equal(content.name);
            expect(activity.description).to.equal(content.description);
        });

        it('Should throw domain exception if database fails on getActivityById', async () => {
            const userId = new objectId();
            const activityId = new objectId();

            sandbox.stub(activitySchema, 'findOne').rejects(new Error('DB error'));     // Simula un errore del database quando viene chiamato findOne

            try {
                await activityRepository.getById(activityId.toString(), userId.toString());
            } catch(err) {
                expect(err.message).to.equal(`something went wrong: DB error`);     // Verifica che il messaggio dell’errore sia quello previsto
                expect(err.status).eq(500);
                return;
            }
            expect.fail('Expected exception was not thrown');
        });

        it('Should throw not found exception if activity does not exist', async () => {
            const userId = new objectId();
            const activityId = new objectId();

            sandbox.stub(activitySchema, 'findOne').resolves(null);     // Simula findOne che non trova l'attività (restituisce null)

            try {
                await activityRepository.getById(activityId.toString(), userId.toString());
            } catch(err) {
                expect(err.message).to.equal(`error: activity ${activityId.toString()} not found`);
                expect(err.status).eq(404);
                return;
            }
            expect.fail('Expected exception was not thrown');
        });
    })

    describe('update()', () => {
        it('Should update activity successfully', async () => {
            const userId = new objectId();
            const activityId = new objectId();

            const params = {    
                name: 'New name',
                description: 'This is a new test activity',
            }
            sandbox.stub(activitySchema, 'findOneAndUpdate').resolves({
                _id: activityId,
                ownerId: userId,
                ...params,
                toObject: function() { return this; }
            });
            const activity = await activityRepository.update(activityId.toString(), params, userId.toString());
            expect(activity.ownerId.toString()).to.equal(userId.toString());
            expect(activity.name).to.equal(params.name);
            expect(activity.description).to.equal(params.description);
        });

        it('Should throw domain exception if database fails', async () => {
            const userId = new objectId();
            const activityId = new objectId();
            const params = {    
                name: 'New name',
                description: 'This is a new test activity',
            }

            sandbox.stub(activitySchema, 'findOneAndUpdate').rejects(new Error('DB error'));     // Simula un errore del database quando viene chiamato findOne

            try {
                await activityRepository.update(activityId.toString(), params, userId.toString());
            } catch(err) {
                console.log(err.message)
                expect(err.message).to.equal(`something went wrong: DB error`);     // Verifica che il messaggio dell’errore sia quello previsto
                return;
            }
           expect.fail('Expected exception was not thrown');
        });

        it('Should return null if activity does not exist', async () => {
            const userId = new objectId();
            const activityId = new objectId();
            const params = {    
                name: 'New name',
                description: 'This is a new test activity',
            }

            sandbox.stub(activitySchema, 'findOneAndUpdate').resolves(null);     // Simula findOne che non trova l'attività (restituisce null)

            const activity = await activityRepository.update(activityId.toString(), params, userId.toString());
            expect(activity).to.be.null;
        })
    })
})   
