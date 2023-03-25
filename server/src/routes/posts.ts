import express from "express";
import { addPost, deleteUserPost, getUserPosts } from "../controllers/posts";
import { checkUserAndPostBeforeDeletingPost } from "../middleware/checkUserAndPostBeforeDeletingPost";
const router = express.Router();

router.route("/:profilePath")
  .get(getUserPosts)
  .post(addPost);

router.route("/:profilePath/:postPath")
  .delete(checkUserAndPostBeforeDeletingPost, deleteUserPost);

export default router;