import { NextFunction } from "express";
import User from "../models/User";
import { ConflictErr, ForbiddenErr, NotFoundErr } from "../utils/errs";
import idAlreadyExistsInArrayOfIds from "../utils/idAlreadyExistsInArrayOfIds";
import { IReq, IRes } from "../utils/ReqResInterfaces";

export default async function validateAcceptingFriendRequest(req: IReq, res: IRes, next: NextFunction) {
  const { friendId } = req.params;
  const userId = req.data.user.userId;

  if (friendId === userId) {
    throw new ForbiddenErr("you cannot accept a friend request from yourself");
  }

  const senderPromise = User.findById(friendId);
  const receiverPromise = User.findById(userId);
  const [sender, receiver] = await Promise.all([senderPromise, receiverPromise]);

  if (!sender) throw new NotFoundErr("request sender not found");
  if (!receiver) throw new NotFoundErr("request receiver not found");

  const isFriendAlreadyAdded = idAlreadyExistsInArrayOfIds(receiver.friends, sender._id);
  if (isFriendAlreadyAdded) {
    throw new ConflictErr("friend already added");
  }

  next();
}