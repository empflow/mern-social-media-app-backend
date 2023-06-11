import { NextFunction } from "express";
import { IPost } from "../../../models/Post";
import { IUser } from "../../../models/User";
import { BadRequestErr } from "../../../utils/errs";
import { IReq, IRes } from "../../../utils/reqResInterfaces";

export default async function removeReactionValidator(req: IReq, res: IRes, next: NextFunction) {
  const { user }: { user: IUser } = req.data;
  const { likedByStrIds, dislikedByStrIds }: { likedByStrIds: string[], dislikedByStrIds: string[] } = req.data;

  if (!likedByStrIds.includes(user.id) && !dislikedByStrIds.includes(user.id)) {
    throw new BadRequestErr("You have not reacted to this post yet. Nothing to remove")
  }

  next();
}