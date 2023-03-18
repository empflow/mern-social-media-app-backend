import User from "../models/User";
import { Request, Response } from "express";
import { ForbiddenErr, NotFoundErr } from "../utils/errs";

export async function deleteAccount(req: Request, res: Response) {
  const { profileId: profileIdToDelete } = req.params;

  const userToDelete = await User.findOne({ profileId: profileIdToDelete });
  if (!userToDelete) throw new NotFoundErr("user not found");
  const requesterId = (req as any).user.userId;
  const userToDeleteId = userToDelete._id.toString();

  if (userToDeleteId !== requesterId) {
    throw new ForbiddenErr("you can only delete your own account");
  }

  await User.deleteOne({ profileId: profileIdToDelete });
  res.status(200).json({ message: "user deleted" });
}

export async function patchAccount(req: Request, res: Response) {
  const patchedUser = await User.findByIdAndUpdate(
    (req as any).user.userId,
    req.body,
    { runValidators: true, new: true }
  )
  res.status(200).json(patchedUser);
}
