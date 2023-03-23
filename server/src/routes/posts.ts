import express from "express";
import { addPost, getUserPosts } from "../controllers/posts";
const router = express.Router();

router.route("/:profilePath")
  .get(getUserPosts)
  .post(addPost);

export default router;