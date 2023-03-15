import dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();
import globalMiddleware from "./routes/globalMiddleware";
import connectDB from "./utils/connectDB";
const PORT = process.env.PORT || 3000;


app.use(globalMiddleware);

app.get("/", (req, res) => { res.send("hello this is a test") });

(async () => {
  try {
    await connectDB(process.env.MONGO_URI!);
    app.listen(PORT, () => console.log(`running on port ${PORT}`));
  } catch (err) {
    console.error(err);
  }
})();
