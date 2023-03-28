import express from "express";
import { addPost, deleteUserPost, getPost, getUserPosts, patchPost } from "../controllers/posts";
const router = express.Router();

router.route("/:postPath")
  .get(getPost)
  .patch(patchPost)
  .delete(deleteUserPost);

export default router;