import dotenv from "dotenv";
dotenv.config();
import "express-async-errors";
import mongoose from "mongoose";
import app from "./app";
import getMongoUri from "./utils/getMongoUri";
const PORT = process.env.PORT ?? 3000;

app.listen(PORT, async () => {
  console.log(`app running on port ${PORT}`);
  await mongoose.connect(getMongoUri());
  console.log("DB connected");
})

export default app;
