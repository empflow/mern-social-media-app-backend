import express from "express";
import { upload } from "../config/multer";
import { addComment, getComments } from "../controllers/comments";
import likePost, { addPost, deleteUserPost, getPost, getUserPosts, patchPost } from "../controllers/posts";
import commentUploadImgsIfPresent from "../middleware/commentUploadImgsIfPresent";
import addCommentValidator from "../middleware/comments/addComment/validator";
import patchPostValidator from "../middleware/posts/patchPost/validator";
import handleMulterUploadArray from "../utils/handleMulterUpload";
import { imgsUploadLimit } from "../utils/s3";
import postsUploadImgsIfPresent from "../middleware/posts/postUploadImgsIfPresent";
import patchPostAppendNewImgs from "../middleware/posts/patchPost/appendNewImgs";
import patchPostDeleteImgsIfNeeded from "../middleware/posts/patchPost/deleteImgsIfNeeded";
import likePostValidator from "../middleware/posts/likePost/validator";
const router = express.Router();

const uploadMw = upload.array("imgs")


router.route("/:postPath")
  .get(getPost)
  .patch(
    handleMulterUploadArray(uploadMw, imgsUploadLimit),
    patchPostValidator,
    postsUploadImgsIfPresent,
    patchPostAppendNewImgs,
    patchPostDeleteImgsIfNeeded,
    patchPost
  )
  .delete(deleteUserPost);

router.route("/:postPath/like")
    .post(likePostValidator, likePost)

router.route("/:postPath/comments")
  .get(getComments)
  .post(
    handleMulterUploadArray(uploadMw, imgsUploadLimit),
    addCommentValidator,
    commentUploadImgsIfPresent,
    addComment
  );

export default router;
