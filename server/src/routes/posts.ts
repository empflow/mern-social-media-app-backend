import express from "express";
import { upload } from "../config/multer";
import { addComment, getComments } from "../controllers/comments";
import { addPost, deleteUserPost, getPost, getUserPosts, patchPost } from "../controllers/posts";
import commentUploadImgsIfPresent from "../middleware/commentUploadImgsIfPresent";
import addCommentValidator from "../middleware/comments/addComment/validator";
import patchPostuploadNewImgsIfPresent from "../middleware/posts/patchPost/uploadNewImgsIfPresent";
import patchPostValidator from "../middleware/posts/patchPost/validator";
import handleMulterUploadArray from "../utils/handleMulterUpload";
import { imgsUploadLimit } from "../utils/s3";
const router = express.Router();

const uploadMw = upload.array("imgs")


router.route("/:postPath")
  .get(getPost)
  .patch(patchPostValidator, patchPostuploadNewImgsIfPresent, patchPost)
  .delete(deleteUserPost);

router.route("/:postPath/comments")
  .get(getComments)
  .post(
    handleMulterUploadArray(uploadMw, imgsUploadLimit),
    addCommentValidator,
    commentUploadImgsIfPresent,
    addComment
  );

export default router;
