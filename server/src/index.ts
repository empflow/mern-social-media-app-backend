import dotenv from "dotenv";
dotenv.config();
import "express-async-errors";
import express, { Request } from "express";
const app = express();
import multer from "multer";
import multerDiskStorageConf from "./config/multer";
const storage = multer.diskStorage(multerDiskStorageConf);
export const upload = multer({ storage });
import globalMiddleware from "./routes/globalMiddleware";
import connectDB from "./utils/connectDB";
import authRoute from "./routes/auth";
import errHandler from "./middleware/errHandler";
const PORT = process.env.PORT || 3000;

app.use(globalMiddleware);

app.use("/auth", authRoute);

app.get("/", (req, res) => { res.send("hello this is a test") });

app.use(errHandler);

(async () => {
  try {
    await connectDB(process.env.MONGO_URI!);
    app.listen(PORT, () => console.log(`running on port ${PORT}`));
  } catch (err) {
    console.error(err);
  }
})();