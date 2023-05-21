import express from "express";
import { addPost, getUserPosts } from "../controllers/posts";
import { getUserById, getUserFriends } from "../controllers/users";
import { getUser, getUsers } from "../controllers/users";
const router = express.Router();
import { upload } from "../config/multer";
import handleMulterUploadArray from "../utils/handleMulterUpload";
import { imgsUploadLimit, vidsUploadLimit } from "../utils/s3";
import addPostValidator from "../middleware/posts/addPost/validator";
import postUploadImgsIfPresent from "../middleware/posts/uploadImgsIfPresent";


const uploadMw = upload.array("imgs");

router.get("/", getUsers);
router.get("/:profilePath", getUser);
router.get("/id/:userId", getUserById);
router.get("/:profilePath/friends", getUserFriends)

router.route("/:profilePath/posts")
  .get(getUserPosts)
  .post(
    handleMulterUploadArray(uploadMw, imgsUploadLimit),
    addPostValidator,
    postUploadImgsIfPresent,
    addPost
  );

export default router;
