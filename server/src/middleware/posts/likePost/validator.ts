import { NextFunction } from "express";
import { IPost } from "../../../models/Post";
import { IUser } from "../../../models/User";
import { BadRequestErr } from "../../../utils/errs";
import { IReq, IRes } from "../../../utils/reqResInterfaces";


export default async function likePostValidator(req: IReq, res: IRes, next: NextFunction) {
  const post: IPost = req.data.post;
  const { user }: { user: IUser } = req.data;
  const { likedByStrIds }: { likedByStrIds: string[] } = req.data;

  if (likedByStrIds.includes(user.id)) {
    throw new BadRequestErr("you have already liked this post");
  }
  next();
}
