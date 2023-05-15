import express from "express";
import { upload } from "../config/multer";
import { addComment, getComments } from "../controllers/comments";
import { addPost, deleteUserPost, getPost, getUserPosts, patchPost } from "../controllers/posts";
import patchPostuploadNewImgsIfPresent from "../middleware/posts/patchPost/uploadNewImgsIfPresent";
import patchPostValidate from "../middleware/posts/patchPost/validate";
import handleMulterUploadArray from "../utils/handleMulterUpload";
import { imgsUploadLimit } from "../utils/s3";
const router = express.Router();

const uploadMw = upload.array("imgs")

router.route("/:postPath")
  .get(getPost)
  .patch(patchPostValidate, patchPostuploadNewImgsIfPresent, patchPost)
  .delete(deleteUserPost);

router.route("/:postPath/comments")
  .get(getComments)
  .post(handleMulterUploadArray(uploadMw, imgsUploadLimit), addComment);

export default router;
