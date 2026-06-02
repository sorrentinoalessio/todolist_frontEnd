import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
const dbName = 'todolist-prod';
const connectionString = process.env.MONGODB_URI || `mongodb://localhost:27017/${dbName}`;
let mongoServer;

export const connect = async () => {
  try {
    if (process.env.NODE_ENV === 'test') {
      mongoServer = await MongoMemoryServer.create();
      await mongoose.connect(mongoServer.getUri(), { dbName });
      console.log('Connected to memory server');
    } else {
      await mongoose.connect(connectionString);
      console.log('Connected to mongodb');
    }
  } catch (err) {
    console.error('Connection error', err);
    throw err;
  }
};

export const disconnect = async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
};


