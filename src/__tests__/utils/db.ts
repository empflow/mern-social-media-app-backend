import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";


export async function dbConnSetup() {
  const mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
  return mongod;
}


export async function dbConnTeardown(mongod: MongoMemoryServer) {
  await mongod.stop();
  await mongoose.disconnect();
  await mongoose.connection.close();
}
