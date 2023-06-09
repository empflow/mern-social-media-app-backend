import { NextFunction } from "express";
import { isValidObjectId } from "mongoose";
import PostView from "../../../models/PostView";
import { BadRequestErr } from "../../../utils/errs";
import { IReq, IRes } from "../../../utils/reqResInterfaces";


export default async function viewPostValidator(req: IReq, res: IRes, next: NextFunction) {
  const { postId } = req.params;
  const { userId } = req.data.user;

  if (!isValidObjectId(postId)) throw new BadRequestErr("invalid post id");
  const alreadyViewed = await PostView.findOne({ userId, postId });
  if (alreadyViewed) throw new BadRequestErr("Post already viewed");

  next();
}