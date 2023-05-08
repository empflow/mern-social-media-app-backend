import { findDocsByIds } from "../utils/findDocs";
import User from "../models/User";
import { IReq, IRes } from "../utils/reqResInterfaces";
import { NextFunction } from "express";
import { ForbiddenErr, NotFoundErr } from "../utils/errs";
import userProjection from "../utils/projections/userProjection";
import findFriendInFriendRequestsContext from "../utils/reqs/findFriendInFriendRequestsContext";


export default async function validateRejectingFriendRequest(
  req: IReq, res: IRes, next: NextFunction
) {
  const { friendId: senderId } = req.params;
  const receiverId = req.data.user.userId;

  if (senderId === receiverId) {
    throw new ForbiddenErr("you cannot reject a friend request from yourself");
  }

  const [sender, receiver] = await findFriendInFriendRequestsContext(senderId, receiverId);

  if (!sender) throw new NotFoundErr("sender not found");
  if (!receiver) throw new NotFoundErr("receiver not found");

  req.data.sender = sender;
  req.data.receiver = receiver;

  next();
}
