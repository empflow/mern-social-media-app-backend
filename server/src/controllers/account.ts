import User from "../models/User";
import { Request, Response } from "express";
import { ForbiddenErr, NotFoundErr } from "../utils/errs";

export async function deleteAccount(req: Request, res: Response) {
  const deletedAccount = await User.findByIdAndDelete((req as any).user.userId);
  if (!deletedAccount) throw new NotFoundErr("account not found");
  res.status(200).json(deletedAccount);
}

export async function patchAccount(req: Request, res: Response) {
  const patchedAccount = await User.findByIdAndUpdate(
    (req as any).user.userId,
    req.body,
    { runValidators: true, new: true }
  )
  if (!patchedAccount) throw new NotFoundErr("account not found");
  res.status(200).json(patchedAccount);
}

export async function addFriend(req: Request, res: Response) {
  const account = await User.findById((req as any).user.userId);
  if (!account) throw new NotFoundErr("account not found");
  account.friends.push(req.body);
  await account.save();
  res.status(200).json(account);
}
