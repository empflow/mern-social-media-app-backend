import { ObjectId } from "mongoose";
import User from "../models/User";
import { NotFoundErr } from "../utils/errs";
import { IReq, IRes } from "../utils/ReqResInterfaces";

export async function deleteAccount(req: IReq, res: IRes) {
  const deletedAccount = await User.findByIdAndDelete(req.data.user.userId);
  if (!deletedAccount) throw new NotFoundErr("account not found");
  res.status(200).json(deletedAccount);
}

export async function patchAccount(req: IReq, res: IRes) {
  const patchedAccount = await User.findByIdAndUpdate(
    req.data.user.userId,
    req.body,
    { runValidators: true, new: true }
  )
  if (!patchedAccount) throw new NotFoundErr("account not found");
  res.status(200).json(patchedAccount);
}

export async function addFriend(req: IReq, res: IRes) {
  const account = req.data.account;
  account.friends.push(req.body);
  await account.save();
  res.status(200).json(account);
}

export async function deleteFriend(req: IReq, res: IRes) {
  const { friendId: friendToDeleteId } = req.params;
  const account = req.data.account;
  account.friends = account.friends.filter((friendObjectId: ObjectId) => (
    friendObjectId.toString() !== friendToDeleteId
  ));
  await account.save();
  res.status(200).json(account);
}
