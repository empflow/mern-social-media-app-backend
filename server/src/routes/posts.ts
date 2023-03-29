import express from "express";
import { addComment, getComments } from "../controllers/comments";
import { addPost, deleteUserPost, getPost, getUserPosts, patchPost } from "../controllers/posts";
const router = express.Router();

router.route("/:postPath")
  .get(getPost)
  .patch(patchPost)
  .delete(deleteUserPost);

router.route("/:postPath/comments")
  .get(getComments)
  .post(addComment);

export default router;