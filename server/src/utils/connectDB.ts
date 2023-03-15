import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

export default function connectDB(uri: string) {
  return mongoose.connect(uri, {
    dbName: "social-media-app"
  })
}
