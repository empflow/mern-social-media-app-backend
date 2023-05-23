import { NextFunction } from "express";
import Comment from "../../../models/Comment";
import Post from "../../../models/Post";
import checkReplyToCommentExists from "../../../utils/checkReplyToCommentExists";
import { BadRequestErr, NotFoundErr } from "../../../utils/errs";
import { IReq, IRes } from "../../../utils/reqResInterfaces";

export default async function addCommentValidator(req: IReq, res: IRes, next: NextFunction) {
  const { postPath } = req.params;
  const { replyTo, content } = req.body;
  const filesLen = req.files ? (req.files.length) : 0;

  if (!content && !replyTo && !filesLen) throw new BadRequestErr("no data provided");

  await checkReplyToCommentExists(replyTo);

  const post = await Post.findOne({ postPath });
  if (!post) throw new NotFoundErr("post not found");

  next();
}