import express from "express";
import { deleteComment, patchComment } from "../controllers/comments";
const router = express.Router();


router.route("/:commentId")
  .patch(patchComment)
  .delete(deleteComment);

export default router;
