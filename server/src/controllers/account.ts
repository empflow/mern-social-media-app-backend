import { HydratedDocument } from "mongoose";
import Post from "../models/Post";
import User, { IUser } from "../models/User";
import { ForbiddenErr, NotFoundErr } from "../utils/errs";
import { findDocByIdAndUpdate } from "../utils/findDocs";
import friendReqUserProjection from "../utils/projections/friendReqUserProjection";
import userProjection from "../utils/projections/userProjection";
import { IReq, IRes } from "../utils/reqResInterfaces";


export async function patchAccount(req: IReq, res: IRes) {
  const { firstName, lastName, email, profilePath, birthday, city, occupation, status, canAnyonePost } = req.body;
  const { avatarUrl400px, avatarUrl200px, avatarUrl100px } = req.data.avatarUrls ?? {};
  const update: Partial<IUser> = {
    firstName, lastName, email, profilePath,
    birthday, city, occupation, status, canAnyonePost,
    avatarUrl400px, avatarUrl200px, avatarUrl100px
  };
  const userId: string = req.data.user.userId;
  const patchedAccount = await findDocByIdAndUpdate(
    User, userId, update, userProjection
  );
  res.status(200).json(patchedAccount);
}


export async function getOwnAccount(req: IReq, res: IRes) {
  const { userId } = req.data.user;
  // { password: -1 } projection didn't work here :/
  const user = await User.findById(userId, "-password");
  if (!user) throw new NotFoundErr("user not found");
  res.status(200).json(user);
}


export async function deleteAccount(req: IReq, res: IRes) {
  // TODO: deactivate account instead of removing from db entirely
  const deletedAccount = await User.findByIdAndDelete(
    req.data.user.userId, { projection: userProjection }
  );
  if (!deletedAccount) throw new NotFoundErr("account not found");
  await Post.deleteMany({ createdBy: deletedAccount.id });
  res.status(200).json(deletedAccount);
}


export async function sendFriendRequest(req: IReq, res: IRes) {
  const { friendId: receiverId } = req.params;
  const senderId = req.data.user.userId;

  const sender = req.data.sender;
  const receiver = req.data.receiver;

  sender.friendRequestsSent.push(receiverId);
  receiver.friendRequestsReceived.push(senderId);

  const updatedSenderPromise = sender.save();
  const updatedReceiverPromise = receiver.save();
  const [updatedSender, updatedReceiver] = await Promise.all([
    updatedSenderPromise, updatedReceiverPromise
  ])

  res.status(200).json({ updatedSender, updatedReceiver });
}


export async function acceptFriendRequest(req: IReq, res: IRes) {
  const { friendId: senderId } = req.params;
  const receiverId = req.data.user.userId;

  const sender = req.data.sender;
  const receiver = req.data.receiver;
  
  sender.friendRequestsSent.pull(receiverId);
  sender.friends.push(receiverId);

  receiver.friendRequestsReceived.pull(senderId);
  receiver.friends.push(senderId);

  const updatedSenderPromise = sender.save();
  const updatedReceiverPromise = receiver.save();
  const [updatedSender, updatedReceiver] = await Promise.all([
    updatedSenderPromise, updatedReceiverPromise
  ]);

  res.send({ updatedSender, updatedReceiver });
}


export async function rejectFriendRequest(req: IReq, res: IRes) {
  const sender: IUser = req.data.sender;
  const receiver: IUser = req.data.receiver;

  const hasReqBeenSent = receiver.friendRequestsReceived.indexOf(sender.id) !== -1;
  if (!hasReqBeenSent) {
    const msg = "this user did not send you a friend request or you may have already rejected it";
    throw new ForbiddenErr(msg);
  }

  // "id" is the string version of "_id"
  sender.friendRequestsSent = sender.friendRequestsSent.filter(
    req => req === receiver.id
  );
  receiver.friendRequestsReceived = receiver.friendRequestsReceived.filter(
    req => req === sender.id
  );
  const [updatedSender, updatedReceiver] = await Promise.all([sender.save(), receiver.save()]);

  res.status(200).json({ updatedSender, updatedReceiver });
}


export async function deleteFriend(req: IReq, res: IRes) {
  const { friendId: friendToDeleteId } = req.params;
  const accountToDeleteFromId: string = req.data.user.userId;

  const account = await findDocByIdAndUpdate(
    User,
    accountToDeleteFromId,
    { $pull: { friends: friendToDeleteId }},
    friendReqUserProjection
  )
  if (!account) throw new NotFoundErr("account not found");
  res.status(200).json(account);
}
