
import mongoose from 'mongoose';
import CryptoUtils from '../../src/utils/CryptoUtils.js';
import userSchema from '../../src/schemas/userSchema.js';
import { activityStatus, userStatus } from '../../src/constants/const.js';
import activitySchema from '../../src/schemas/activitySchema.js';

const objectId = mongoose.Types.ObjectId;

class FixturesUtils {
    async createUser(data, save) {
        const { password, salt } = CryptoUtils.hashPassword(data.password || 'password');

        const user = {
            name: data.name || 'test user',
            _id: data.id || new objectId(),
            email: data.email || 'test@gmail.com',
            status: data.status || userStatus.ACTIVE,
            password: password,
            salt: salt
        }
        if (save) {
            const res = await userSchema.create(user);
            return res.toObject();
        }
        return user;
    }
    async createActivity(data, save) {
        const activity = {
            name: data.name || 'test activity',
            _id: data.id || new objectId(),
            ownerId: data.ownerId || null,
            description: data.description || 'test description',
            status: data.status || activityStatus.OPEN,
            dueDate: data.dueDate || new Date()
        }
        if (save) {
            const res = await activitySchema.create(activity);
            return res.toObject();
        }
        return activity;
    }
    async clearDb() {
        await activitySchema.deleteMany();
       await userSchema.deleteMany();
        //await mongoose.connection.dropDatabase();
    }

    
    async getUserFromId(id){
        const user = await userSchema.findOne({id});
        return user ? user.toObject() : null; 

    }

}


export default new FixturesUtils();