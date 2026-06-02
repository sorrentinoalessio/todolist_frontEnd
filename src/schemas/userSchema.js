import mongoose from "mongoose";
import { userStatus } from '../constants/const.js';

const userSchema = new mongoose.Schema(
    {
        name: String,
        email: {type: String, unique: true},
        password: String,
        salt: String,
        status: { type: String, default: userStatus.PENDING},
        registrationToken: String
    },
    { 
        timestamps: true 
    }
);

export default mongoose.model('user', userSchema);
