import express from "express";
import { addComment, getComments } from "../controllers/comments";
import { addPost, deleteUserPost, getPost, getUserPosts, patchPost } from "../controllers/posts";
import patchPostuploadNewImgsIfPresent from "../middleware/posts/patchPost/uploadNewImgsIfPresent";
import patchPostValidate from "../middleware/posts/patchPost/validate";
const router = express.Router();


router.route("/:postPath")
  .get(getPost)
  .patch(patchPostValidate, patchPostuploadNewImgsIfPresent, patchPost)
  .delete(deleteUserPost);

router.route("/:postPath/comments")
  .get(getComments)
  .post(addComment);

export default router;
