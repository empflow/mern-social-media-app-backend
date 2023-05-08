import express from "express";
import { addPost, getUserPosts } from "../controllers/posts";
import { getUserById, getUserFriends } from "../controllers/users";
import { getUser, getUsers } from "../controllers/users";
const router = express.Router();
import { upload } from "../config/multer";
import uploadArray from "../utils/handleMulterUpload";


const imgsLimit = 10;
const uploadMw = upload.array("imgs", imgsLimit);

router.get("/", getUsers);
router.get("/:profilePath", getUser);
router.get("/id/:userId", getUserById);
router.get("/:profilePath/friends", getUserFriends)

router.route("/:profilePath/posts")
  .get(getUserPosts)
  .post(uploadArray(uploadMw, imgsLimit), addPost);

export default router;
