import { NextFunction } from "express";
import Comment from "../../../models/Comment";
import Post from "../../../models/Post";
import checkReplyToCommentExists from "../../../utils/checkReplyToCommentExists";
import { BadRequestErr, NotFoundErr } from "../../../utils/errs";
import { IReq, IRes } from "../../../utils/reqResInterfaces";
import validateObjectId from "../../../utils/validateObjectId";

export default async function addCommentValidator(req: IReq, res: IRes, next: NextFunction) {
  const { postPath } = req.params;
  const { replyTo, content } = req.body;
  const filesLen = req.files ? (req.files.length) : 0;

  if (replyTo) validateObjectId(replyTo);
  throwIfNoDataProvided(content, filesLen);
  const [post] = await findPostAndCheckReplyToCommentExists(postPath, replyTo);

  if (!post) throw new NotFoundErr("post not found");

  next();
}


function throwIfNoDataProvided(...data: any[]) {
  for (let i = 0; i < data.length; i++) {
    if (data[i]) return;
  }
  throw new BadRequestErr("no data provided");
}


function findPostAndCheckReplyToCommentExists(postPath: string, replyTo: string) {
  return Promise.all([
    Post.findOne({ postPath }, { _id: 1 }),
    checkReplyToCommentExists(replyTo, { shouldReturnBool: false })
  ]);
}
