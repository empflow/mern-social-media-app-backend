import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

export default function connectDB(mongoUri: string) {
  return mongoose.connect(mongoUri, {
    dbName: "social-media-app"
  })
}
