import { HydratedDocument } from "mongoose";
import Post from "../models/Post";
import User, { IUser } from "../models/User";
import { NotFoundErr } from "../utils/errs";
import { findDocByIdAndUpdate } from "../utils/findDocs";
import { IReq, IRes } from "../utils/reqResInterfaces";

export async function patchAccount(req: IReq, res: IRes) {
  const userId: string = req.data.user.userId;
  const patchedAccount = await findDocByIdAndUpdate(User, userId, req.body);
  if (!patchedAccount) throw new NotFoundErr("account not found");
  res.status(200).json(patchedAccount);
}

export async function deleteAccount(req: IReq, res: IRes) {
  const deletedAccount = await User.findByIdAndDelete(req.data.user.userId);
  if (!deletedAccount) throw new NotFoundErr("account not found");
  await Post.deleteMany({ _id: { $in: deletedAccount.posts }});
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
  const sender: HydratedDocument<IUser> = req.data.sender;
  const receiver: HydratedDocument<IUser> = req.data.receiver;

  // "id" is the string version of "_id"
  const updatedSenderPromise = findDocByIdAndUpdate(
    User, sender.id, { $pull: { friendRequestsSent: receiver._id } }
  )
  const updatedReceiverPromise = findDocByIdAndUpdate(
    User, receiver.id, { $pull: { friendRequestsReceived: sender._id }
  });

  const [updatedSender, updatedReceiver] = await Promise.all([
    updatedSenderPromise, updatedReceiverPromise
  ]);

  res.status(200).json({ updatedSender, updatedReceiver });
}

export async function deleteFriend(req: IReq, res: IRes) {
  const { friendId: friendToDeleteId } = req.params;
  const accountToDeleteFromId: string = req.data.user.userId;

  const account = await findDocByIdAndUpdate(
    User,
    accountToDeleteFromId,
    { $pull: { friends: friendToDeleteId }}
  )
  if (!account) throw new NotFoundErr("account not found");
  res.status(200).json(account);
}
