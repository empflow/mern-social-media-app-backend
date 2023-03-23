import express from "express";
import { addPost } from "../controllers/posts";
const router = express.Router();

router.post("/:profilePath", addPost);

export default router;