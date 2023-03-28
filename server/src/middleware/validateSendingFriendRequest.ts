import { NextFunction } from "express";
import User from "../models/User";
import { ConflictErr, ForbiddenErr, NotFoundErr } from "../utils/errs";
import idExistsInIdsArr from "../utils/idAlreadyExistsInArrayOfIds";
import { IReq, IRes } from "../utils/ReqResInterfaces";
import { IUser } from "../models/User";

export async function validateSendingFriendRequest(req: IReq, res: IRes, next: NextFunction) {
  const { friendId: receiverId } = req.params;
  const senderId = req.data.user.userId;
  validateIds(senderId, receiverId);

  const [sender, receiver] = await getSenderAndReceiver(senderId, receiverId);
  validateSenderAndReceiver(sender, receiver);

  req.data.sender = sender;
  req.data.receiver = receiver;

  next();
}

function validateIds(senderId: string, receiverId: string) {
  if (senderId === receiverId) {
    throw new ForbiddenErr("you cannot send a friend request to yourself");
  }
}

function validateSenderAndReceiver(sender: IUser | null, receiver: IUser | null) {
  if (!sender) throw new NotFoundErr("request sender not found");
  if (!receiver) throw new NotFoundErr("request receiver not found");

  const senderId = sender._id;
  const receiverId = receiver._id;

  const isReqAlreadySent = idExistsInIdsArr(
    sender.friendRequestsSent, receiverId
  );
  const isReqAlreadySentByReceiver = idExistsInIdsArr(
    receiver.friendRequestsSent, senderId
  );
  const isFriendAlreadyAdded = idExistsInIdsArr(
    sender.friends, receiverId
  );

  throwIfNeeded(
    isReqAlreadySent, isReqAlreadySentByReceiver, isFriendAlreadyAdded
  )
}

function throwIfNeeded(
  isReqAlreadySent: boolean,
  isReqAlreadySentByReceiver: boolean,
  isFriendAlreadyAdded: boolean
) {
  if (isReqAlreadySent) {
    throw new ConflictErr("friend request already sent");
  }
  if (isReqAlreadySentByReceiver) {
    const msg = "this person has sent you a friend request. Accept it instead";
    throw new ConflictErr(msg);
  }
  if (isFriendAlreadyAdded) {
    throw new ConflictErr("friend already added");
  }
}

async function getSenderAndReceiver(senderId: string, receiverId: string) {
  const senderPromise = User.findById(senderId);
  const receiverPromise = User.findById(receiverId);
  const result = await Promise.all([senderPromise, receiverPromise]);
  return result;
}
