import dotenv from "dotenv";
dotenv.config();
import "express-async-errors";
import express from "express";
import multer from "multer";
import multerDiskStorageConf from "./config/multer";
const app = express();
import globalMiddleware from "./routes/globalMiddleware";
import connectDB from "./utils/connectDB";
import authRoute from "./routes/auth";
const PORT = process.env.PORT || 3000;

app.use(globalMiddleware);
const storage = multer.diskStorage(multerDiskStorageConf);
const upload = multer({ storage });


app.use("/auth", authRoute);

app.get("/", (req, res) => { res.send("hello this is a test") });

(async () => {
  try {
    await connectDB(process.env.MONGO_URI!);
    app.listen(PORT, () => console.log(`running on port ${PORT}`));
  } catch (err) {
    console.error(err);
  }
})();
