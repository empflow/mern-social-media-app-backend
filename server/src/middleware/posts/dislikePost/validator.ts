import { NextFunction } from "express";
import { IPost } from "../../../models/Post";
import { IUser } from "../../../models/User";
import { BadRequestErr } from "../../../utils/errs";
import { IReq, IRes } from "../../../utils/reqResInterfaces";


export default async function dislikePostValidator(req: IReq, res: IRes, next: NextFunction) {
  const post: IPost = req.data.post;
  const { user }: { user: IUser } = req.data;
  const { dislikedByStrIds }: { dislikedByStrIds: string[] } = req.data;

  if (dislikedByStrIds.includes(user.id)) {
    throw new BadRequestErr("you have already disliked this post");
  }
  next();
}