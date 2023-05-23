import express from "express";
import { upload } from "../config/multer";
import { deleteComment, patchComment } from "../controllers/comments";
import deleteCommentValidator from "../middleware/comments/deleteComment/validator";
import patchCommentAppendNewImgsToComment from "../middleware/comments/patchComment/appendNewImgs";
import patchCommentDeleteImgsIfNeeded from "../middleware/comments/patchComment/deleteImgsIfNeeded";
import patchCommentValidator from "../middleware/comments/patchComment/validator";
import commentUploadImgsIfPresent from "../middleware/commentUploadImgsIfPresent";
import handleMulterUploadArray from "../utils/handleMulterUpload";
import { imgsUploadLimit } from "../utils/s3";
const router = express.Router();

const uploadMw = upload.array("imgs");


router.route("/:commentId")
  .patch(
    handleMulterUploadArray(uploadMw, imgsUploadLimit),
    patchCommentValidator,
    commentUploadImgsIfPresent,
    patchCommentAppendNewImgsToComment,
    patchCommentDeleteImgsIfNeeded,
    patchComment
  )
  .delete(
    deleteCommentValidator,
    deleteComment
  );

export default router;
