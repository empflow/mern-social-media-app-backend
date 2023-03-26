import { NextFunction } from "express";
import User from "../models/User";
import { ConflictErr, NotFoundErr } from "../utils/errs";
import idAlreadyExistsInArrayOfIds from "../utils/idAlreadyExistsInArrayOfIds";
import { IReq, IRes } from "../utils/ReqResInterfaces";

export async function validateSendingFriendReq(req: IReq, res: IRes, next: NextFunction) {
  const { friendId } = req.params;
  const userId = req.data.user.userId;

  const senderPromise = User.findById(userId);
  const receiverPromise = User.findById(friendId);
  const [sender, receiver] = await Promise.all([senderPromise, receiverPromise]);

  if (!sender) throw new NotFoundErr("request sender not found");
  if (!receiver) throw new NotFoundErr("request receiver not found");

  const isRequestAlreadySent = idAlreadyExistsInArrayOfIds(sender.friendRequestsSent, friendId);
  const isFriendAlreadyAdded = idAlreadyExistsInArrayOfIds(sender.friends, friendId);
  if (isRequestAlreadySent) {
    throw new ConflictErr("friend request already sent");
  }
  if (isFriendAlreadyAdded) {
    throw new ConflictErr("friend already added");
  }

  next();
}