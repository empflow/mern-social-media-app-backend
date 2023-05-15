import express from "express";
import { addPost, getUserPosts } from "../controllers/posts";
import { getUserById, getUserFriends } from "../controllers/users";
import { getUser, getUsers } from "../controllers/users";
const router = express.Router();
import { upload } from "../config/multer";
import handleMulterUploadArray from "../utils/handleMulterUpload";
import { imgsUploadLimit as imgsLimit, vidsUploadLimit as vidsLimit } from "../utils/s3";


const uploadMw = upload.array("imgs", imgsLimit);

router.get("/", getUsers);
router.get("/:profilePath", getUser);
router.get("/id/:userId", getUserById);
router.get("/:profilePath/friends", getUserFriends)

router.route("/:profilePath/posts")
  .get(getUserPosts)
  .post(handleMulterUploadArray(uploadMw, imgsLimit), addPost);

export default router;
