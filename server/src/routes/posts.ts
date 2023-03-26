import express from "express";
import { addPost, deleteUserPost, getUserPosts } from "../controllers/posts";
const router = express.Router();

router.route("/:profilePath")
  .get(getUserPosts)
  .post(addPost);

router.route("/:postPath")
  .delete(deleteUserPost);

export default router;