import { userStatus } from "../constants/const.js";
import DomainException from "../exceptions/DomainException.js";
import NotFoundException from "../exceptions/NotFoundException.js";
import UnauthorizedException from "../exceptions/UnauthorizedException.js";
import userSchema from "../schemas/userSchema.js";
import MongoInternalException from '../exceptions/MongoInternalException.js';

class UserRepository {
    async add(content) {
        const res = await userSchema.create(content).catch((err) => {
            if(err.code === 11000){
            throw new MongoInternalException(`something went wrong`, 500);
            }
            throw new MongoInternalException(`something went wrong: ${err.message}`, err.code);

        });
        return res.toObject();
    }

    async getByIdAndToken(id, token) {
        const res = await userSchema.findOneAndUpdate(
            { _id: id, registrationToken: token },
            { status: userStatus.ACTIVE, registrationToken: null },
            { new: true }                                                        //restituisco il documento aggiornato
        ).catch((err) => {
            throw new NotFoundException('Token not found');
        });
        if (!res) {
            throw new NotFoundException('Token not found');
        }
        return res.toObject();
    }

    async getActiveByEmail(email) {
        const res = await userSchema.findOne({ email: email, status: userStatus.ACTIVE }).catch((err) => {
            throw new DomainException('Generic error');
        })
        if (!res) {
            throw new UnauthorizedException('Unauthorized');
        }
        return res.toObject();
    }
    async getManyByUserOwnerId(ownerId) {
        const res = await userSchema.find({ _id: ownerId }).catch(err => {
            throw new MongoInternalException(`something went wrong: ${err.message}`, err.code);
        })
        return res.map(({ _id, name, email }) => ({_id, name, email }));

    }
    
    
    async findPendingbyEmail(email) {
        try {
                 const res = await userSchema.findOne({ email: email, status: userStatus.PENDING });
             
        if (!res) {
            throw new UnauthorizedException('Unauthorized');
        }
        return res.toObject();
    }catch (err) {
        if (err instanceof UnauthorizedException) throw err;
        throw new DomainException('Generic error');
    }}
}

export default new UserRepository();
