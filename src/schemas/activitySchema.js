import mongoose, { Schema } from "mongoose";
import { activityStatus } from '../constants/const.js';

const activitySchemas = new mongoose.Schema(
    {
        ownerId: { type: Schema.Types.ObjectId, default: null },
        name: String,
        description: String,
        status: { type: String, default: activityStatus.OPEN },
        dueDate: { type: Date, default: new Date() }
    },
    {
        timestamps: true
    }
);

export default mongoose.model('activity', activitySchemas);
