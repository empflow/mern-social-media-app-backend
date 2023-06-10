import express from "express";
import { addPost, getUserPosts } from "../controllers/posts";
import { getUserById, getUserFriends } from "../controllers/users";
import { getUser, getUsers } from "../controllers/users";
const router = express.Router();
import { upload } from "../config/multer";
import handleMulterUploadArray from "../utils/handleMulterUpload";
import addPostValidator from "../middleware/posts/addPost/validator";
import postUploadImgsIfPresent from "../middleware/posts/postUploadImgsIfPresent";
import getUserByIdValidator from "../middleware/users/getUserById/validator";
import { imgsAmountUploadLimit, vidsAmountUploadLimit } from "../config/global";


const uploadMw = upload.array("imgs");

router.get("/", getUsers);
router.get("/:profilePath", getUser);
router.get("/id/:userId", getUserByIdValidator, getUserById);
router.get("/:profilePath/friends", getUserFriends)

router.route("/:profilePath/posts")
  .get(getUserPosts)
  .post(
    handleMulterUploadArray(uploadMw, imgsAmountUploadLimit),
    addPostValidator,
    postUploadImgsIfPresent,
    addPost
  );

export default router;
