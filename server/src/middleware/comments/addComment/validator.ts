import { NextFunction } from "express";
import Comment from "../../../models/Comment";
import Post from "../../../models/Post";
import { NotFoundErr } from "../../../utils/errs";
import { IReq, IRes } from "../../../utils/reqResInterfaces";

export default async function addCommentValidator(req: IReq, res: IRes, next: NextFunction) {
  const { postPath } = req.params;
  const { replyTo } = req.body;

  if (replyTo) {
    const hostComment = await Comment.findById(replyTo)
    const msg = "the comment you're trying to reply to does not exist";
    if (!hostComment) throw new NotFoundErr(msg)
  };

  const post = await Post.findOne({ postPath });
  if (!post) throw new NotFoundErr("post not found");

  next();
}