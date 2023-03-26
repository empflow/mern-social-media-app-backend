import Post from "../models/Post";
import User from "../models/User";
import { NotFoundErr } from "../utils/errs";
import { IReq, IRes } from "../utils/ReqResInterfaces";

export async function patchAccount(req: IReq, res: IRes) {
  const patchedAccount = await User.findByIdAndUpdate(
    req.data.user.userId,
    req.body,
    { runValidators: true, new: true }
  )
  if (!patchedAccount) throw new NotFoundErr("account not found");
  res.status(200).json(patchedAccount);
}

export async function deleteAccount(req: IReq, res: IRes) {
  const deletedAccount = await User.findByIdAndDelete(req.data.user.userId);
  if (!deletedAccount) throw new NotFoundErr("account not found");
  await Post.deleteMany({ _id: { $in: deletedAccount.posts }});
  res.status(200).json(deletedAccount);
}

export async function addFriend(req: IReq, res: IRes) {
  const account = req.data.account;
  account.friends.push(req.body);
  await account.save();
  res.status(200).json(account);
}

export async function deleteFriend(req: IReq, res: IRes) {
  const { friendProfilePath: friendToDeleteProfilePath } = req.params;
  const accountToDeleteFromId = req.data.user.userId;

  const friend = await User.findOne({ profilePath: friendToDeleteProfilePath }, { _id: 1 });
  if (!friend) throw new NotFoundErr("friend not found");

  const account = await User.findOneAndUpdate(
    { _id: accountToDeleteFromId },
    { $pull: { friends: friend._id }},
    { runValidators: true, new: true }
  )
  if (!account) throw new NotFoundErr("account not found");
  res.status(200).json(account);
}
