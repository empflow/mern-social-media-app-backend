import { NextFunction } from "express";
import Comment from "../../../models/Comment";
import Post from "../../../models/Post";
import checkReplyToCommentExists from "../../../utils/checkReplyToCommentExists";
import { NotFoundErr } from "../../../utils/errs";
import { IReq, IRes } from "../../../utils/reqResInterfaces";

export default async function addCommentValidator(req: IReq, res: IRes, next: NextFunction) {
  const { postPath } = req.params;
  const { replyTo } = req.body;

  await checkReplyToCommentExists(replyTo);

  const post = await Post.findOne({ postPath });
  if (!post) throw new NotFoundErr("post not found");

  next();
}