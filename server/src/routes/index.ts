import express from "express";
const router = express.Router();
import authRoute from "./auth";
import authorize from "../middleware/authorize";
import usersRoute from "./users";
import accountRoute from "./account";
import postsRoute from "./posts";
import commentsRoute from "./comments";


// routes that don't require authorization
router.use("/auth", authRoute);

// routes that do require authorization
router.use("/users", authorize, usersRoute);
router.use("/account", authorize, accountRoute);
router.use("/posts", authorize, postsRoute);
router.use("/comments", authorize, commentsRoute);


export default router;
