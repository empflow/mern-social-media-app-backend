import dotenv from "dotenv";
dotenv.config();
import "express-async-errors";
import mongoose from "mongoose";
import app from "./app";
import getMongoUrl from "./utils/getMongoUrl";
const PORT = process.env.PORT ?? 3000;


app.listen(PORT, async () => {
  console.log(`app running on port ${PORT}`);
  await mongoose.connect(getMongoUrl(), { dbName: "social-media-app" });
  console.log("DB connected");
})


export default app;
