import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";


export default async function connectDB(mongoUri: string) {
  await mongoose.connect(mongoUri, {
    dbName: "social-media-app"
  })
}
