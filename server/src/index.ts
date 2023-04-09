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
import commentsRoute from "./routes/comments";
import errHandler from "./middleware/errHandler";
import authorize from "./middleware/authorize";
import notFound from "./middleware/notFound";
const PORT = process.env.PORT || 3000;


app.use(globalMiddleware);

// routes that don't require authorization
app.use("/auth", authRoute);

// routes that require authorization
app.use("/users", authorize, usersRoute);
app.use("/account", authorize, accountRoute);
app.use("/posts", authorize, postsRoute);
app.use("/comments", authorize, commentsRoute);

app.use(notFound);
app.use(errHandler);

(async () => {
  try {
    await connectDB(process.env.MONGO_URI!);
    app.listen(PORT, () => console.log(`running on port ${PORT}`));
  } catch (err) {
    console.error(err);
  }
})();


export default app;