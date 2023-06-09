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
router.use(authorize);
router.use("/users", usersRoute);
router.use("/account", accountRoute);
router.use("/posts", postsRoute);
router.use("/comments", commentsRoute);


export default router;
