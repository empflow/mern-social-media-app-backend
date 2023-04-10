import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

export default function connectDB() {
  const uri = process.env.MONGO_URI as string;

  return mongoose.connect(uri, {
    dbName: "social-media-app"
  })
}
