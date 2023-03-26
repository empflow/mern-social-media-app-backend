import express from "express";
import { addPost, deleteUserPost, getUserPosts, patchPost } from "../controllers/posts";
const router = express.Router();

router.route("/:profilePath")
  .get(getUserPosts)
  .post(addPost);

router.route("/:postPath")
  .patch(patchPost)
  .delete(deleteUserPost);

export default router;