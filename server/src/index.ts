import dotenv from "dotenv";
dotenv.config();
import "express-async-errors";
import express from "express";
const app = express();
import multer from "multer";
import multerDiskStorageConf from "./config/multer";
const storage = multer.diskStorage(multerDiskStorageConf);
export const upload = multer({ storage });
import globalMiddleware from "./middleware/globalMiddleware";
import connectDB from "./utils/connectDB";
import authRoute from "./routes/auth";
import usersRoute from "./routes/users";
import accountRoute from "./routes/account";
import postsRoute from "./routes/posts";
import errHandler from "./middleware/errHandler";
import authorize from "./middleware/authorize";
const PORT = process.env.PORT || 3000;

app.use(globalMiddleware);

app.use("/auth", authRoute);

// all routes that require authorization
app.use(authorize);
app.use("/users", usersRoute);
app.use("/account", accountRoute);
app.use("/posts", postsRoute);

app.use(errHandler);

(async () => {
  try {
    await connectDB(process.env.MONGO_URI!);
    app.listen(PORT, () => console.log(`running on port ${PORT}`));
  } catch (err) {
    console.error(err);
  }
})();